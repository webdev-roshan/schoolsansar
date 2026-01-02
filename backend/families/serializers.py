from rest_framework import serializers
from .models import Parent, StudentParentRelation
from profiles.serializers import ProfileSerializer


class StudentParentRelationSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentParentRelation
        fields = "__all__"


class ParentSerializer(serializers.ModelSerializer):
    profile_details = ProfileSerializer(source="profile", read_only=True)
    children = serializers.SerializerMethodField()

    class Meta:
        model = Parent
        fields = (
            "id",
            "profile",
            "profile_details",
            "occupation",
            "office_address",
            "income_level",
            "children",
        )

    def get_children(self, obj):
        from students.serializers import StudentSerializer

        relations = obj.student_links.all()
        return [
            {
                "relation_type": rel.relation_type,
                "is_primary": rel.is_primary_contact,
                "student": StudentSerializer(rel.student).data,
            }
            for rel in relations
        ]
