from rest_framework import serializers
from django.db import transaction
from django.contrib.auth import get_user_model
from .models import (
    Athlete,
    TrainingPlan,
    Coach,
    PhysicalEvaluation,
    TrainingSession,
    SubjectiveScale,
    Feedback,
)

import logging

logger = logging.getLogger(__name__)

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "password",
            "first_name",
            "last_name",
            "email",
            "user_type",
        )


class AthleteSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Athlete
        fields = (
            "id",
            "user",
            "birth_date",
            "weight",
            "height",
            "resting_heart_rate",
            "coach_related",
        )

    def create(self, validated_data):
        user_data = validated_data.pop("user")
        username = user_data.pop("username", None)
        password = user_data.pop("password", None)
        try:
            user = User.objects.create(username=username, **user_data)
        except Exception as exc:
            logger.exception(
                "Failed to create User for Athlete: username=%s email=%s. Error: %s",
                username,
                user_data.get("email"),
                exc,
            )
            raise
        if password:
            user.set_password(password)
            user.save()
        if not getattr(user, "user_type", None):
            user.user_type = "athlete"
            user.save()

        athlete = Athlete.objects.create(user=user, **validated_data)
        return athlete

    def update(self, instance, validated_data):
        user_data = validated_data.pop("user", None)
        if user_data:
            user = instance.user
            password = user_data.pop("password", None)
            for attr, value in user_data.items():
                setattr(user, attr, value)
            if password:
                user.set_password(password)
            user.save()

        # update athlete fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class CoachSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Coach
        fields = (
            "id",
            "user",
            "cref",
            "specialty",
        )

    def create(self, validated_data):
        user_data = validated_data.pop("user")
        username = user_data.pop("username", None)
        password = user_data.pop("password", None)
        try:
            user = User.objects.create(username=username, **user_data)
        except Exception as exc:
            logger.exception(
                "Failed to create User for Coach: username=%s email=%s. Error: %s",
                username,
                user_data.get("email"),
                exc,
            )
            raise
        if password:
            user.set_password(password)
            user.save()
        # ensure user_type is set to 'coach' if not provided
        if not getattr(user, "user_type", None):
            user.user_type = "coach"
            user.save()

        coach = Coach.objects.create(user=user, **validated_data)
        return coach

    def update(self, instance, validated_data):
        user_data = validated_data.pop("user", None)
        if user_data:
            user = instance.user
            password = user_data.pop("password", None)
            for attr, value in user_data.items():
                setattr(user, attr, value)
            if password:
                user.set_password(password)
            user.save()

        # update coach fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class TrainingPlanSerializer(serializers.ModelSerializer):
    # Accept English field names that match the model
    name = serializers.CharField(source="name", required=False)
    description = serializers.CharField(
        source="description", required=False, allow_blank=True
    )
    start_date = serializers.DateField(source="start_date", required=False)
    end_date = serializers.DateField(source="end_date", required=False)
    athlete_id = serializers.PrimaryKeyRelatedField(
        source="athlete", queryset=User.objects.all(), required=False
    )

    class Meta:
        model = TrainingPlan
        fields = (
            "id",
            "name",
            "description",
            "start_date",
            "end_date",
            "athlete",
            "athlete_id",
        )
        read_only_fields = ("athlete",)


class TrainingSessionSerializer(serializers.ModelSerializer):
    # # canonical English fields
    # target_zone = serializers.CharField(required=False)
    # training_type = serializers.CharField(required=False, allow_blank=True)
    # intensity = serializers.CharField(required=False, allow_blank=True)
    # duration = serializers.IntegerField(required=False)
    # date = serializers.DateTimeField(required=False)
    # training_plan_id = serializers.PrimaryKeyRelatedField(
    #     source="training_plan", queryset=TrainingPlan.objects.all(), required=False
    # )
    # athlete_id = serializers.PrimaryKeyRelatedField(
    #     source="athlete",
    #     queryset=User.objects.all(), required=False)

    class Meta:
        model = TrainingSession
        fields = (
            "id",
            "target_zone",
            "training_type",
            "intensity",
            "duration",
            "date",
            "training_plan",
        )


class PhysicalEvaluationSerializer(serializers.ModelSerializer):
    heart_rate = serializers.IntegerField()
    observations = serializers.CharField(allow_blank=True, required=False)
    training_zone = serializers.CharField(allow_blank=True, required=False)
    athlete_id = serializers.PrimaryKeyRelatedField(
        source="athlete", queryset=User.objects.all(), required=False
    )

    class Meta:
        model = PhysicalEvaluation
        fields = (
            "id",
            "date",
            "heart_rate",
            "observations",
            "training_zone",
            "athlete",
            "athlete_id",
        )


class SubjectiveScaleSerializer(serializers.ModelSerializer):
    # frontend calls this ESR (esr)
    scale_type = serializers.CharField()
    value = serializers.IntegerField()
    date = serializers.DateTimeField(required=False)
    athlete_id = serializers.PrimaryKeyRelatedField(
        source="athlete", queryset=User.objects.all(), required=False
    )

    class Meta:
        model = SubjectiveScale
        fields = ("id", "scale_type", "value", "date", "athlete", "athlete_id")


class FeedbackSerializer(serializers.ModelSerializer):
    lido = serializers.BooleanField(source="marked_as_read", required=False)
    athlete_id = serializers.PrimaryKeyRelatedField(
        source="athlete", queryset=User.objects.all(), required=False
    )

    class Meta:
        model = Feedback
        fields = (
            "id",
            "message",
            "date",
            "marked_as_read",
            "athlete",
            "athlete_id",
        )


class RegisterSerializer(serializers.Serializer):
    """A flexible registration serializer that accepts a nested `user` object
    and the other profile fields. It will create a `User` and either an
    `Athlete` or `Coach` depending on provided data or explicit `profile_type`.
    """

    user = UserSerializer()
    profile_type = serializers.ChoiceField(choices=("athlete", "coach"), required=False)

    # explicit profile fields so they are validated and available in validated_data
    # coach fields
    cref = serializers.CharField(required=False, allow_blank=True)
    specialty = serializers.CharField(required=False, allow_blank=True)

    # athlete fields
    birth_date = serializers.DateField(required=False, allow_null=True)
    weight = serializers.FloatField(required=False, allow_null=True)
    height = serializers.FloatField(required=False, allow_null=True)
    resting_heart_rate = serializers.IntegerField(required=False, allow_null=True)
    coach_related = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), required=False, allow_null=True
    )

    def create(self, validated_data):
        user_data = validated_data.pop("user")

        # accept explicit profile_type (top-level) or nested user.user_type
        profile_type = validated_data.pop("profile_type", None) or user_data.pop(
            "user_type", None
        )

        password = user_data.pop("password", None)
        username = user_data.pop("username", None)

        profile = None

        try:
            with transaction.atomic():
                user = User.objects.create(username=username, **user_data)
                if password:
                    user.set_password(password)
                    user.save()

                # prefer explicit profile_type; otherwise infer from provided fields
                if not profile_type:
                    if validated_data.get("cref") or validated_data.get("specialty"):
                        profile_type = "coach"
                    else:
                        profile_type = "athlete"

                if profile_type == "coach":
                    cref = validated_data.pop("cref", None)
                    specialty = validated_data.pop("specialty", None)

                    if not cref:
                        raise serializers.ValidationError(
                            {"cref": "CREF is required for coach"}
                        )

                    # ensure the user_type is set
                    if not getattr(user, "user_type", None):
                        user.user_type = "coach"
                        user.save()

                    try:
                        coach = Coach.objects.create(
                            user=user, cref=cref, specialty=specialty
                        )
                    except Exception as exc:
                        logger.exception(
                            "Failed to create Coach for Register: username=%s email=%s. Error: %s",
                            username,
                            user_data.get("email"),
                            exc,
                        )
                        raise
                    profile = coach
                else:
                    # default to athlete - create instance and set fields explicitly
                    try:
                        # set user_type if not provided
                        if not getattr(user, "user_type", None):
                            user.user_type = "athlete"
                            user.save()

                        athlete = Athlete(user=user)

                        # birth_date may come as YYYY-MM-DD or DD/MM/YYYY; try to normalize
                        bd = validated_data.pop("birth_date", None)
                        if bd:
                            try:
                                # if string and contains '/', convert
                                if isinstance(bd, str) and "/" in bd:
                                    from datetime import datetime

                                    parts = bd.split("/")
                                    if len(parts) == 3:
                                        bd_parsed = datetime.strptime(
                                            bd, "%d/%m/%Y"
                                        ).date()
                                    else:
                                        bd_parsed = bd
                                else:
                                    bd_parsed = bd
                                athlete.birth_date = bd_parsed
                            except Exception:
                                logger.warning("Could not parse birth_date=%s", bd)

                        # numeric fields
                        weight = validated_data.pop("weight", None)
                        if weight not in (None, ""):
                            try:
                                athlete.weight = float(weight)
                            except Exception:
                                logger.warning("Invalid weight value: %s", weight)

                        height = validated_data.pop("height", None)
                        if height not in (None, ""):
                            try:
                                athlete.height = float(height)
                            except Exception:
                                logger.warning("Invalid height value: %s", height)

                        rhr = validated_data.pop("resting_heart_rate", None)
                        if rhr not in (None, ""):
                            try:
                                athlete.resting_heart_rate = int(rhr)
                            except Exception:
                                logger.warning(
                                    "Invalid resting_heart_rate value: %s", rhr
                                )

                        # coach_related can be provided as id
                        cr = validated_data.pop("coach_related", None)
                        if cr:
                            try:
                                if isinstance(cr, int):
                                    coach_user = User.objects.filter(id=cr).first()
                                elif isinstance(cr, dict) and cr.get("id"):
                                    coach_user = User.objects.filter(
                                        id=cr.get("id")
                                    ).first()
                                else:
                                    coach_user = None
                                if coach_user:
                                    athlete.coach_related = coach_user
                            except Exception:
                                logger.warning("Could not assign coach_related: %s", cr)

                        athlete.save()
                        profile = athlete
                    except Exception as exc:
                        logger.exception(
                            "Failed to create Athlete for Register: username=%s email=%s. Error: %s",
                            username,
                            user_data.get("email"),
                            exc,
                        )
                        raise

        except Exception:
            # any exception should bubble up after transaction rollback
            raise

        return profile

    def validate(self, attrs):
        # basic passthrough validation; nested UserSerializer will validate user
        user = attrs.get("user")
        # ensure username/email present
        if not user.get("username") and not user.get("email"):
            raise serializers.ValidationError("username or email required")
        return attrs
