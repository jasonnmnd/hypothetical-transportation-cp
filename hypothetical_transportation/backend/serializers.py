from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from rest_framework import serializers
from .models import Route, School, Student, Stop
from geopy.geocoders import Nominatim


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ('id', 'name')


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('id', 'email', 'full_name', 'address', 'latitude', 'longitude', 'groups', 'managed_schools')
        # fields = ('email', 'password')

    def validate(self, data):
        return data


class EditUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('id', 'email', 'full_name', 'address', 'latitude', 'longitude', 'groups', 'managed_schools')


class StaffEditUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('id', 'email', 'full_name', 'address', 'latitude', 'longitude', 'managed_schools')


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
                raise serializers.ValidationError("Student school is not the same as student route!")
        if 'guardian' in data:
            if data['guardian'] and len(data['guardian'].address) == 0:
                raise serializers.ValidationError("User does not have an address configured")
        return data


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
        candidates = find_school_match_candidates(value)
        for candidate in candidates:
            if school_names_match(candidate.name, value):
                return value
        raise serializers.ValidationError("school name could not be matched")

    class Meta:
        model = Student
        fields = ("full_name", "student_id", "parent_email", "school_name")


class LoadUserSerializer(serializers.ModelSerializer):
    def validate_address(self, value):
        # TODO: Uncomment to use paid geolocator API
        # geolocator = GoogleV3(api_key="AIzaSyA6nIh9bWUWFOD_y7hEZ7UQh_KmPn5Sq58")
        geolocator = Nominatim(user_agent="bulk import validator")
        location = geolocator.geocode(value)
        if not location or not location.latitude or not location.longitude:
            raise serializers.ValidationError("address could not be geographically matched")
        return value

    class Meta:
        model = get_user_model()
        fields = ("email", "full_name", "address", "phone_number")


class LoadModelDataSerializer(serializers.Serializer):
    users = LoadUserSerializer(many=True, required=False)
    students = LoadStudentSerializer(many=True, required=False)
