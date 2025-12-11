from rest_framework import viewsets
import logging
from rest_framework.permissions import (
    IsAuthenticatedOrReadOnly,
    IsAuthenticated,
    AllowAny,
)
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
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
from .serializers import (
    UserSerializer,
    AthleteSerializer,
    TrainingPlanSerializer,
    CoachSerializer,
    PhysicalEvaluationSerializer,
    TrainingSessionSerializer,
    SubjectiveScaleSerializer,
    FeedbackSerializer,
    RegisterSerializer,
)

User = get_user_model()


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated])
    def me(self, request):
        """Return the current authenticated user's profile."""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)


class AthleteViewSet(viewsets.ModelViewSet):
    queryset = Athlete.objects.select_related("user").all()
    serializer_class = AthleteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = super().get_queryset()
        coach_id = self.request.query_params.get("coach_id")
        if coach_id:
            qs = qs.filter(coach_related__id=coach_id)
        return qs

    def get_permissions(self):
        # allow unauthenticated users to register (create) athletes
        if self.action == "create":
            return [AllowAny()]
        return [permission() for permission in self.permission_classes]

    def perform_create(self, serializer):
        # If creating via nested user, serializer handles user creation.
        serializer.save()

    def create(self, request, *args, **kwargs):
        logger = logging.getLogger(__name__)
        logger.info(
            "Athlete create called; payload keys: %s", list(request.data.keys())
        )
        try:
            user_data = request.data.get("user", {})
            logger.debug(
                "Athlete user payload (masked): username=%s, email=%s",
                user_data.get("username"),
                user_data.get("email"),
            )
        except Exception:
            logger.exception("Error reading user payload for logging")

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            self.perform_create(serializer)
        except Exception as exc:
            logger.exception("Error creating Athlete: %s", exc)
            raise
        headers = self.get_success_headers(serializer.data)

        # try to build JWT tokens for the created user
        user = getattr(serializer.instance, "user", None)
        tokens = {}
        if user is not None:
            refresh = RefreshToken.for_user(user)
            tokens = {"access": str(refresh.access_token), "refresh": str(refresh)}

        out = AthleteSerializer(serializer.instance).data
        data = {**out, **tokens}
        return Response(data, status=status.HTTP_201_CREATED, headers=headers)

    # AthleteViewSet is intentionally minimal; session-related endpoints
    # belong to TrainingSessionViewSet below.


class CoachViewSet(viewsets.ModelViewSet):
    queryset = Coach.objects.select_related("user").all()
    serializer_class = CoachSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action == "create":
            return [AllowAny()]
        return [permission() for permission in self.permission_classes]

    def create(self, request, *args, **kwargs):
        logger = logging.getLogger(__name__)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            self.perform_create(serializer)
        except Exception as exc:
            logger.exception("Error creating Coach: %s", exc)
            raise
        headers = self.get_success_headers(serializer.data)

        user = getattr(serializer.instance, "user", None)
        tokens = {}
        if user is not None:
            refresh = RefreshToken.for_user(user)
            tokens = {"access": str(refresh.access_token), "refresh": str(refresh)}

        out = CoachSerializer(serializer.instance).data
        data = {**out, **tokens}
        return Response(data, status=status.HTTP_201_CREATED, headers=headers)


class TrainingPlanViewSet(viewsets.ModelViewSet):
    queryset = TrainingPlan.objects.select_related("athlete").all()
    serializer_class = TrainingPlanSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        qs = super().get_queryset()
        athlete_id = self.request.query_params.get("athlete_id")
        if athlete_id:
            qs = qs.filter(athlete__id=athlete_id)
        return qs


class TrainingSessionViewSet(viewsets.ModelViewSet):
    queryset = TrainingSession.objects.select_related(
        "training_plan", "training_plan__athlete"
    ).all()
    serializer_class = TrainingSessionSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        qs = super().get_queryset()
        athlete_id = self.request.query_params.get("athlete_id")
        if athlete_id:
            qs = qs.filter(training_plan__athlete__id=athlete_id)
        return qs

    @action(detail=True, methods=["patch"], permission_classes=[IsAuthenticated])
    def conclude(self, request, pk=None):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        """Create a TrainingSession. Backend expects English field names that
        match the models. For convenience, if `date` and `time` are provided
        separately (or `data`/`hora`), the server will attempt to combine them
        into an ISO datetime string. If `training_plan` is not provided but
        `athlete_id` is, the server will resolve or create a TrainingPlan and
        associate it before saving the session.
        """
        logger = logging.getLogger(__name__)

        data = (
            request.data.copy() if hasattr(request.data, "copy") else dict(request.data)
        )

        # combine date + time if provided separately (expect English keys)
        d = data.get("date")
        t = data.get("time")
        if d and t and "date" not in data:
            try:
                data["date"] = f"{d}T{t}:00"
            except Exception:
                logger.warning("Could not combine date+time into ISO date: %s %s", d, t)

        # prefer explicit training_plan id fields
        plan_id = data.get("training_plan_id") or data.get("training_plan")
        if plan_id and "training_plan" not in data:
            data["training_plan"] = plan_id

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)

        training_plan = serializer.validated_data.get("training_plan")
        if training_plan:
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(
                serializer.data, status=status.HTTP_201_CREATED, headers=headers
            )

        athlete_id = data.get("athlete_id")
        if athlete_id:
            try:
                user = User.objects.filter(id=athlete_id).first()
                if not user:
                    return Response({"detail": "athlete not found"}, status=404)

                plan = (
                    TrainingPlan.objects.filter(athlete__id=athlete_id)
                    .order_by("-start_date")
                    .first()
                )
                if not plan:
                    from datetime import date, timedelta

                    start = date.today()
                    end = start + timedelta(days=30)
                    plan = TrainingPlan.objects.create(
                        name=f"Auto plan {start.isoformat()}",
                        description="Automatically created plan",
                        start_date=start,
                        end_date=end,
                        athlete=user,
                    )

                self.perform_create(serializer, training_plan=plan)
                headers = self.get_success_headers(serializer.data)
                return Response(
                    serializer.data, status=status.HTTP_201_CREATED, headers=headers
                )
            except Exception as exc:
                logger.exception("Error creating session with athlete_id: %s", exc)
                return Response({"detail": "Error creating session"}, status=500)

        return Response({"training_plan": ["This field is required."]}, status=400)

    def perform_create(self, serializer, training_plan=None):
        if training_plan is not None:
            serializer.save(training_plan=training_plan)
        else:
            serializer.save()


class PhysicalEvaluationViewSet(viewsets.ModelViewSet):
    queryset = PhysicalEvaluation.objects.select_related("athlete").all()
    serializer_class = PhysicalEvaluationSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        qs = super().get_queryset()
        athlete_id = self.request.query_params.get("athlete_id")
        if athlete_id:
            qs = qs.filter(athlete__id=athlete_id)
        return qs


class SubjectiveScaleViewSet(viewsets.ModelViewSet):
    queryset = SubjectiveScale.objects.select_related("athlete").all()
    serializer_class = SubjectiveScaleSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        qs = super().get_queryset()
        athlete_id = self.request.query_params.get("athlete_id")
        if athlete_id:
            qs = qs.filter(athlete__id=athlete_id)
        return qs

    @action(
        detail=False, methods=["get"], permission_classes=[IsAuthenticatedOrReadOnly]
    )
    def latest(self, request):
        athlete_id = request.query_params.get("athlete_id") or request.query_params.get(
            "athlete"
        )
        if not athlete_id:
            return Response({"detail": "athlete_id is required"}, status=400)
        obj = (
            self.get_queryset().filter(athlete__id=athlete_id).order_by("-date").first()
        )
        if not obj:
            return Response({}, status=204)
        serializer = self.get_serializer(obj)
        return Response(serializer.data)

    @action(
        detail=False, methods=["get"], permission_classes=[IsAuthenticatedOrReadOnly]
    )
    def history(self, request):
        athlete_id = request.query_params.get("athlete_id")
        start = request.query_params.get("start_date")
        end = request.query_params.get("end_date")
        qs = self.get_queryset()
        if athlete_id:
            qs = qs.filter(athlete__id=athlete_id)
        if start:
            qs = qs.filter(date__gte=start)
        if end:
            qs = qs.filter(date__lte=end)
        serializer = self.get_serializer(qs.order_by("-date"), many=True)
        return Response(serializer.data)


class FeedbackViewSet(viewsets.ModelViewSet):
    queryset = Feedback.objects.select_related("athlete").all()
    serializer_class = FeedbackSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        qs = super().get_queryset()
        athlete_id = self.request.query_params.get("athlete_id")
        if athlete_id:
            qs = qs.filter(athlete__id=athlete_id)
        return qs


class RegisterAPIView(APIView):
    """Unified registration endpoint. Accepts the same payload shape as
    the individual Athlete/Coach create endpoints (nested `user` plus
    profile fields) and returns the created profile along with JWT tokens.
    """

    # Allow any client to call this endpoint. We also remove default
    # authentication classes here so the browser/client is not blocked by
    # SessionAuthentication CSRF checks on POST from web frontends.
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        logger = logging.getLogger(__name__)
        logger.info(
            "Register endpoint called; payload keys: %s", list(request.data.keys())
        )
        try:
            user_data = request.data.get("user", {})
            logger.debug(
                "Register user payload (masked): username=%s, email=%s",
                user_data.get("username"),
                user_data.get("email"),
            )
        except Exception:
            logger.exception("Error reading user payload for logging")

        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            profile = serializer.save()
        except Exception as exc:
            logger.exception("Error creating profile in RegisterAPIView: %s", exc)
            raise

        # build tokens for created user
        user = getattr(profile, "user", None)
        tokens = {}
        if user is not None:
            refresh = RefreshToken.for_user(user)
            tokens = {"access": str(refresh.access_token), "refresh": str(refresh)}

        # choose serializer for response
        if isinstance(profile, Athlete):
            out = AthleteSerializer(profile).data
        elif isinstance(profile, Coach):
            out = CoachSerializer(profile).data
        else:
            out = {}

        data = {**out, **tokens}
        return Response(data, status=status.HTTP_201_CREATED)


class AddAthleteToCoachAPIView(APIView):
    """Allows an authenticated coach to link an existing athlete (by email)
    to their coach account. Expects JSON: { "email": "athlete@example.com" }.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        logger = logging.getLogger(__name__)
        if not getattr(request.user, "user_type", None) == "coach":
            return Response({"detail": "Only coaches can add athletes."}, status=403)

        email = request.data.get("email")
        if not email:
            return Response({"detail": "email required"}, status=400)

        try:
            user = User.objects.filter(email=email, user_type="athlete").first()
            if not user:
                return Response({"detail": "Athlete not found"}, status=404)

            athlete = Athlete.objects.filter(user=user).first()
            if not athlete:
                return Response({"detail": "Athlete profile not found"}, status=404)

            athlete.coach_related = request.user
            athlete.save()
            logger.info("Coach %s linked to athlete %s", request.user.id, user.id)

            from .serializers import AthleteSerializer

            return Response(
                {"success": True, "athlete": AthleteSerializer(athlete).data}
            )
        except Exception as exc:
            logger.exception("Error linking athlete to coach: %s", exc)
            return Response({"detail": "Server error"}, status=500)
