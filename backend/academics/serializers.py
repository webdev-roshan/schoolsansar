from rest_framework import serializers
from .models import Program, AcademicLevel, Section, Subject, SubjectAssignment
from staff.serializers import InstructorSerializer


class SectionSerializer(serializers.ModelSerializer):
    level_name = serializers.CharField(source="level.name", read_only=True)
    program_name = serializers.CharField(source="level.program.name", read_only=True)

    class Meta:
        model = Section
        fields = [
            "id",
            "level",
            "level_name",
            "program_name",
            "name",
            "capacity",
        ]


class AcademicLevelSerializer(serializers.ModelSerializer):
    sections = SectionSerializer(many=True, read_only=True)
    program_name = serializers.CharField(source="program.name", read_only=True)

    class Meta:
        model = AcademicLevel
        fields = [
            "id",
            "program",
            "program_name",
            "name",
            "order",
            "sections",
        ]


class ProgramSerializer(serializers.ModelSerializer):
    levels = AcademicLevelSerializer(many=True, read_only=True)

    class Meta:
        model = Program
        fields = [
            "id",
            "name",
            "code",
            "description",
            "is_active",
            "created_at",
            "levels",
        ]


class SubjectSerializer(serializers.ModelSerializer):
    level_name = serializers.CharField(source="level.name", read_only=True)

    class Meta:
        model = Subject
        fields = [
            "id",
            "level",
            "level_name",
            "name",
            "code",
            "credits",
            "is_elective",
            "description",
        ]


class SubjectAssignmentSerializer(serializers.ModelSerializer):
    subject_details = SubjectSerializer(source="subject", read_only=True)
    section_details = SectionSerializer(source="section", read_only=True)
    instructor_details = InstructorSerializer(source="instructor", read_only=True)

    class Meta:
        model = SubjectAssignment
        fields = [
            "id",
            "section",
            "section_details",
            "subject",
            "subject_details",
            "instructor",
            "instructor_details",
        ]
