from django.db import models
from django.contrib.auth.models import AbstractUser
from softdelete.models import SoftDeleteObject
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator


class BaseModel(SoftDeleteObject):
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
                                   related_name='+', null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank=True)
    updated_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
                                   related_name='+', null=True, blank=True)
    deleted_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
                                   related_name='+', null=True, blank=True)

    class Meta:
        abstract = True


class User(AbstractUser):
    user_type = models.CharField(
        max_length=20,
    )

    def __str__(self):
        return f"{self.get_full_name()}"


class Athlete(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='athlete_profile',
        limit_choices_to={'user_type': 'athlete'}
    )
    birth_date = models.DateField(null=True, blank=True)
    weight = models.FloatField(
        null=True,
        blank=True,
        validators=[MinValueValidator(0)]
    )
    height = models.FloatField(
        null=True,
        blank=True,
        validators=[MinValueValidator(0)]
    )
    resting_heart_rate = models.IntegerField(
        null=True,
        blank=True,
        validators=[MinValueValidator(0)]
    )
    coach_related = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='coached_athletes',
    )
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Athlete: {self.user.get_full_name()}"


class Coach(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='coach_profile',
        limit_choices_to={'user_type': 'coach'}
    )
    cref = models.CharField(
        max_length=50,
        unique=True,
    )
    specialty = models.CharField(
        max_length=100,
        null=True,
        blank=True,
    )
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Coach: {self.user.get_full_name()} (CREF: {self.cref})"


class PhysicalEvaluation(BaseModel):
    date = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    heart_rate = models.IntegerField(
        help_text="Frequência cardíaca (bpm)",
        validators=[MinValueValidator(0)]
    )
    observations = models.TextField(null=True, blank=True)
    training_zone = models.CharField(max_length=50, null=True, blank=True)
    athlete = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='physical_evaluations'
    )

    def __str__(self):
        return f"Evaluation of {self.athlete.get_full_name()} - {self.date.strftime('%d/%m/%Y')}"


class TrainingPlan(BaseModel):
    name = models.CharField(max_length=150)
    description = models.TextField(blank=True, null=True)
    start_date = models.DateField()
    end_date = models.DateField()
    athlete = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='training_plans'
    )

    def __str__(self):
        return f"{self.name} - {self.athlete.get_full_name()}"


class TrainingSession(BaseModel):
    target_zone = models.CharField(max_length=50)
    training_type = models.CharField(max_length=100, null=True, blank=True)
    intensity = models.CharField(
        max_length=50,
        null=True,
        blank=True
    )
    duration = models.IntegerField(
        validators=[MinValueValidator(1)],
        null=True,
        blank=True,
    )
    date = models.DateTimeField()
    training_plan = models.ForeignKey(
        TrainingPlan,
        on_delete=models.CASCADE,
        related_name='sessions'
    )

    def __str__(self):
        return f"{self.training_type} - {self.date.strftime('%d/%m/%Y %H:%M')}"


class SubjectiveScale(BaseModel):
    scale_type = models.CharField(
        max_length=30,
    )
    value = models.IntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(10)],
        help_text="Valor da escala (0-10)"
    )
    date = models.DateTimeField(auto_now_add=True)
    athlete = models.ForeignKey(User, on_delete=models.CASCADE, related_name='subjective_scales')

    def __str__(self):
        return f"{self.scale_type} - {self.value} - {self.athlete.get_full_name()}"


class Feedback(BaseModel):
    message = models.TextField()
    date = models.DateTimeField(auto_now_add=True)
    marked_as_read = models.BooleanField(default=False)
    athlete = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='feedbacks_send_to')

    def __str__(self):
        return f"Feedback for {self.created_by_id.get_full_name()} - {self.date.strftime('%d/%m/%Y')}"
