from django.urls import path, include
from rest_framework import routers
from rest_framework.authtoken.views import obtain_auth_token
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .api_views import (
    UserViewSet,
    AthleteViewSet,
    TrainingPlanViewSet,
    CoachViewSet,
    TrainingSessionViewSet,
    PhysicalEvaluationViewSet,
    SubjectiveScaleViewSet,
    FeedbackViewSet,
    RegisterAPIView,
    AddAthleteToCoachAPIView,
)

router = routers.DefaultRouter()
router.register(r"users", UserViewSet)
router.register(r"athletes", AthleteViewSet)
router.register(r"coaches", CoachViewSet)

# English routes
router.register(r"training-plans", TrainingPlanViewSet)
router.register(r"training-sessions", TrainingSessionViewSet)
router.register(r"physical-evaluations", PhysicalEvaluationViewSet)
router.register(r"subjective-scales", SubjectiveScaleViewSet)
router.register(r"feedbacks", FeedbackViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("register/", RegisterAPIView.as_view(), name="api_register"),
    path(
        "coach/add-athlete/",
        AddAthleteToCoachAPIView.as_view(),
        name="coach_add_athlete",
    ),
    path("auth/token/", obtain_auth_token, name="api_token_auth"),
    path("auth/jwt/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("auth/jwt/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
