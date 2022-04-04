from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.db.models import Q
from rest_framework import serializers
from .models import Route, School, Student, Stop
from geopy.geocoders import Nominatim, GoogleV3
from .permissions import is_admin, is_school_staff, is_guardian, is_student
from .student_account_managers import sync_student_account, send_invite_email, sync_parent_changes_to_student_account, \
    sync_student_account_changes_to_student


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ('id', 'name')


class ExposeUserInputEmailSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)


class ExposeUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('id', 'email')


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = (
            'id', 'email', 'full_name', 'phone_number', 'address', 'latitude', 'longitude', 'groups', 'managed_schools',
            'linked_student')
        # fields = ('email', 'password')

    def validate(self, data):
        return data


class EditUserSerializer(serializers.ModelSerializer):
    def update(self, instance, validated_data):
        user_email = self.context['request'].user
        user = get_user_model().objects.get(email=user_email)
        if is_admin(user) and user_email == instance and 'groups' in validated_data and Group.objects.get(
                name='Administrator') not in validated_data['groups']:
            raise serializers.ValidationError("You may not revoke your own administrator privileges")
        updated_user = super().update(instance, validated_data)
        if is_guardian(updated_user):
            sync_parent_changes_to_student_account(updated_user)
        if is_student(updated_user):
            sync_student_account_changes_to_student(updated_user)
        return updated_user

    def validate_groups(self, value):
        if len(value) != 1:
            raise serializers.ValidationError("Users may not have more than one role")
        group_name = value[0].name
        if group_name in ["Guardian", "Student"]:
            raise serializers.ValidationError("Users cannot be changed to the Guardian or Student role")
        if self.instance.groups.filter(Q(name='Guardian') | Q(name='Student')).count() > 0:
            raise serializers.ValidationError("Users in the Guardian or Student role cannot have their role changed")
        return value

    class Meta:
        model = get_user_model()
        fields = (
            'id', 'email', 'full_name', 'phone_number', 'address', 'latitude', 'longitude', 'groups', 'managed_schools')


class StaffEditUserSerializer(EditUserSerializer):
    def validate(self, attrs):
        # print(self.context['request'].user)
        return attrs

    class Meta:
        model = get_user_model()
        fields = ('id', 'email', 'full_name', 'phone_number', 'address', 'latitude', 'longitude')


class FormatUserSerializer(UserSerializer):
    groups = GroupSerializer(many=True)


class SchoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = '__all__'


class StaffEditSchoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = ['bus_arrival_time', 'bus_departure_time']


class RouteSerializer(serializers.ModelSerializer):
    is_complete = serializers.BooleanField(read_only=True)

    class Meta:
        model = Route
        fields = '__all__'
        # fields = ['id', 'is_complete', 'school', 'student_count', 'name', 'description']


class StopSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stop
        fields = '__all__'


class FormatRouteSerializer(RouteSerializer):
    school = SchoolSerializer()
    # stops = StopSerializer(many=True)
    student_count = serializers.SerializerMethodField('get_student_count')

    def get_student_count(self, obj):
        return obj.students.count()


class StudentSerializer(serializers.ModelSerializer):
    has_inrange_stop = serializers.BooleanField(read_only=True)

    class Meta:
        model = Student
        fields = '__all__'

    def validate(self, data):
        """
        Handles 1.10 of Evolution 1, Consistency Rule
        :param data:
        :return:
        """
        # if self.partial:
        #     # Handles patch to avoid breaking things
        #     return data
        if 'school' in data and 'routes' in data:
            if not data['school'] or not data['routes']:
                # No consistency to enforce
                return data
            school = data['school']
            route = data['routes']
            if school.pk != route.school.pk:
                raise serializers.ValidationError("Student school is not the same as student route")
        if 'guardian' in data:
            if data['guardian'] and len(data['guardian'].address) == 0:
                raise serializers.ValidationError("User does not have an address configured")
        return data

    def create(self, validated_data):
        # Student accounts created with an email will initiate the process
        created_student = super().create(validated_data)
        if created_student.email is not None:
            send_invite_email(created_student)
        return created_student

    def update(self, instance, validated_data):
        # Previous email has to be cached so setting up a new user account can be initiated
        prev_email = instance.email
        updated_student = super().update(instance, validated_data)
        sync_student_account(updated_student, prev_email)
        return updated_student


class StaffStudentSerializer(StudentSerializer):
    def validate_school(self, data):
        staff_email = self.context['request'].user
        staff_user = get_user_model().objects.get(email=staff_email)
        if data in staff_user.managed_schools.all():
            return data
        raise serializers.ValidationError("Student school is not among schools that you manage")


class FormatStudentSerializer(StudentSerializer):
    school = SchoolSerializer()
    routes = RouteSerializer()
    guardian = FormatUserSerializer()


class StopLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stop
        fields = ['latitude', 'longitude']


class StudentLocationSerializer(serializers.Serializer):
    id = serializers.IntegerField(required=True)
    latitude = serializers.FloatField(required=True)
    longitude = serializers.FloatField(required=True)


class CheckInrangeSerializer(serializers.Serializer):
    stops = StopLocationSerializer(many=True)
    students = StudentLocationSerializer(many=True)


def find_school_match_candidates(school_name: str):
    """

    Django ORM does not appear to have a method to strip extra whitespace from entries that occur in the database.
    This method results to a best-effort filter for the tokens that appear in the school name and then attempts to find
    a best match.
    :param school_name: name of the school
    :return: candidate_schools, queryset containing matches
    """
    school_name_tokens = school_name.split()
    candidate_schools = School.objects.all()
    for token in school_name_tokens:
        candidate_schools = candidate_schools.filter(name__icontains=token)
    return candidate_schools


def school_names_match(school_name1: str, school_name2: str):
    formatted_name1 = " ".join(school_name1.split()).lower()
    formatted_name2 = " ".join(school_name2.split()).lower()
    return formatted_name1 == formatted_name2


class LoadStudentSerializer(serializers.ModelSerializer):
    school_name = serializers.CharField(required=True)
    parent_email = serializers.CharField(required=True)

    def validate_school_name(self, value):
        user_email = self.context['request'].user
        user_object = get_user_model().objects.get(email=user_email)

        candidates = find_school_match_candidates(value)
        for candidate in candidates:
            if school_names_match(candidate.name, value):
                if is_school_staff(user_object) and user_object.managed_schools.filter(pk=candidate.pk).count() == 0:
                    raise serializers.ValidationError(
                        "Student would be assigned to school you do not manage")
                return value
        raise serializers.ValidationError("School name could not be matched")

    class Meta:
        model = Student
        fields = ("email", "full_name", "student_id", "parent_email", "school_name", "phone_number")


class LoadStudentSerializerStrict(LoadStudentSerializer):

    def validate_parent_email(self, value):
        if get_user_model().objects.filter(email=value).count() > 0:
            return value
        raise serializers.ValidationError("Invalid parent email")


class LoadUserSerializer(serializers.ModelSerializer):
    def validate_address(self, value):
        # TODO: Uncomment to use paid geolocator API
        geolocator = GoogleV3(api_key="AIzaSyDsyPs-pIVKGJiy7EVy8aKebN5zg515BCs")
        # geolocator = Nominatim(user_agent="bulk import validator")
        location = geolocator.geocode(value)
        if not location or not location.latitude or not location.longitude:
            raise serializers.ValidationError("Address could not be geographically matched")
        return value

    class Meta:
        model = get_user_model()
        fields = ("email", "full_name", "address", "phone_number")


class LoadModelDataSerializer(serializers.Serializer):
    users = LoadUserSerializer(many=True, required=False)
    students = LoadStudentSerializer(many=True, required=False)
