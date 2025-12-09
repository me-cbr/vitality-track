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
        # hide password in logs
        try:
            user_data = request.data.get("user", {})
            logger.debug(
                "Athlete user payload (masked): username=%s, email=%s",
                user_data.get("username"),
                user_data.get("email"),
            )
        except Exception:
            logger.exception("Error reading user payload for logging")

        """Override create to return JWT tokens upon successful registration."""
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
            tokens = {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            }

        data = {**serializer.data, **tokens}
        return Response(data, status=status.HTTP_201_CREATED, headers=headers)


class CoachViewSet(viewsets.ModelViewSet):
    queryset = Coach.objects.select_related("user").all()
    serializer_class = CoachSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        # allow unauthenticated users to register (create) coaches
        if self.action == "create":
            return [AllowAny()]
        return [permission() for permission in self.permission_classes]

    def perform_create(self, serializer):
        serializer.save()

    def create(self, request, *args, **kwargs):
        logger = logging.getLogger(__name__)
        logger.info("Coach create called; payload keys: %s", list(request.data.keys()))
        try:
            user_data = request.data.get("user", {})
            logger.debug(
                "Coach user payload (masked): username=%s, email=%s",
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
            logger.exception("Error creating Coach: %s", exc)
            raise
        headers = self.get_success_headers(serializer.data)

        user = getattr(serializer.instance, "user", None)
        tokens = {}
        if user is not None:
            refresh = RefreshToken.for_user(user)
            tokens = {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            }

        data = {**serializer.data, **tokens}
        return Response(data, status=status.HTTP_201_CREATED, headers=headers)


class TrainingPlanViewSet(viewsets.ModelViewSet):
    queryset = TrainingPlan.objects.select_related("athlete").all()
    serializer_class = TrainingPlanSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # set the owner athlete to the requesting user
        serializer.save(athlete=self.request.user)


class TrainingSessionViewSet(viewsets.ModelViewSet):
    queryset = TrainingSession.objects.select_related("training_plan").all()
    serializer_class = TrainingSessionSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        qs = super().get_queryset()
        atleta_id = self.request.query_params.get(
            "atleta_id"
        ) or self.request.query_params.get("athlete_id")
        if atleta_id:
            qs = qs.filter(training_plan__athlete__id=atleta_id)
        return qs

    @action(detail=True, methods=["patch"], permission_classes=[IsAuthenticated])
    def conclude(self, request, pk=None):
        """Mark a session as completed. Model has no status field; return object for compatibility."""
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class PhysicalEvaluationViewSet(viewsets.ModelViewSet):
    queryset = PhysicalEvaluation.objects.select_related("athlete").all()
    serializer_class = PhysicalEvaluationSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        qs = super().get_queryset()
        atleta_id = self.request.query_params.get(
            "atleta_id"
        ) or self.request.query_params.get("athlete_id")
        if atleta_id:
            qs = qs.filter(athlete__id=atleta_id)
        return qs


class SubjectiveScaleViewSet(viewsets.ModelViewSet):
    queryset = SubjectiveScale.objects.select_related("athlete").all()
    serializer_class = SubjectiveScaleSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        qs = super().get_queryset()
        atleta_id = (
            self.request.query_params.get("atleta_id")
            or self.request.query_params.get("atleta")
            or self.request.query_params.get("athlete_id")
        )
        if atleta_id:
            qs = qs.filter(athlete__id=atleta_id)
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
        atleta_id = request.query_params.get("atleta_id") or request.query_params.get(
            "atleta"
        )
        start = request.query_params.get("start_date")
        end = request.query_params.get("end_date")
        qs = self.get_queryset()
        if atleta_id:
            qs = qs.filter(athlete__id=atleta_id)
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
        atleta_id = self.request.query_params.get(
            "atleta_id"
        ) or self.request.query_params.get("athlete_id")
        if atleta_id:
            qs = qs.filter(athlete__id=atleta_id)
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
