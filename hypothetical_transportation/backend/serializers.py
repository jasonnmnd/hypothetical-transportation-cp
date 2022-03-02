from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from rest_framework import serializers
from .models import Route, School, Student, Stop


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ('id', 'name')


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('id', 'email', 'full_name', 'address', 'latitude', 'longitude', 'groups')
        # fields = ('email', 'password')

    def validate(self, data):
        return data


class EditUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('id', 'email', 'full_name', 'address', 'latitude', 'longitude', 'groups')


class FormatUserSerializer(UserSerializer):
    groups = GroupSerializer(many=True)


class SchoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = '__all__'


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


class LoadStudentSerializer(serializers.ModelSerializer):
    school_name = serializers.CharField(required=True)

    class Meta:
        model = Student
        fields = ("full_name", "student_id", "school_name")


class LoadUserSerializer(serializers.ModelSerializer):
    students = LoadStudentSerializer(many=True)

    class Meta:
        model = get_user_model()
        fields = ("email", "full_name", "address", "students")


class LoadModelDataSerializer(serializers.Serializer):
    users = LoadUserSerializer(many=True, required=False)


class SubmitFileSerializer(serializers.Serializer):
    user_file = serializers.FileField()
    student_file = serializers.FileField()
