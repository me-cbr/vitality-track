from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator
from datetime import datetime


class User(AbstractUser):
    user_type = models.CharField(
        max_length=20,
        help_text="Tipo de usuário: Atleta ou Técnico"
    )

    class Meta:
        verbose_name = 'Usuário'
        verbose_name_plural = 'Usuários'
        ordering = ['-date_joined']

    def __str__(self):
        return f"{self.get_full_name()} ({self.get_user_type_display()})"


class Athlete(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name='athlete_profile',
        limit_choices_to={'user_type': 'athlete'}
    )
    birth_date = models.DateField(null=True, blank=True)
    weight = models.FloatField(
        null=True,
        blank=True,
        help_text="Peso em kg",
        validators=[MinValueValidator(0)]
    )
    height = models.FloatField(
        null=True,
        blank=True,
        help_text="Altura em cm",
        validators=[MinValueValidator(0)]
    )
    resting_heart_rate = models.IntegerField(
        null=True,
        blank=True,
        help_text="Frequência cardíaca em repouso (bpm)",
        validators=[MinValueValidator(0)]
    )
    coach = models.ForeignKey(
        'Coach',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='athletes'
    )

    class Meta:
        verbose_name = 'Atleta'
        verbose_name_plural = 'Atletas'

    def __str__(self):
        return f"Atleta: {self.user.get_full_name()}"


class Coach(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name='coach_profile',
        limit_choices_to={'user_type': 'coach'}
    )
    cref = models.CharField(
        max_length=50,
        unique=True,
        help_text="Número de registro profissional (CREF)"
    )
    specialty = models.CharField(
        max_length=100,
        null=True,
        blank=True,
        help_text="Especialidade do técnico"
    )

    class Meta:
        verbose_name = 'Técnico'
        verbose_name_plural = 'Técnicos'

    def __str__(self):
        return f"Técnico: {self.user.get_full_name()} (CREF: {self.cref})"


class PhysicalEvaluation(models.Model):
    date = models.DateTimeField(auto_now_add=True)
    heart_rate = models.IntegerField(
        help_text="Frequência cardíaca (bpm)",
        validators=[MinValueValidator(0)]
    )
    observations = models.TextField(blank=True)
    training_zone = models.CharField(max_length=50, blank=True)
    athlete = models.ForeignKey(
        Athlete,
        on_delete=models.CASCADE,
        related_name='physical_evaluations'
    )
    coach = models.ForeignKey(
        Coach,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='evaluations_created'
    )

    class Meta:
        verbose_name = 'Avaliação Física'
        verbose_name_plural = 'Avaliações Físicas'
        ordering = ['-date']

    def __str__(self):
        return f"Avaliação de {self.athlete.user.get_full_name()} - {self.date.strftime('%d/%m/%Y')}"


class TrainingPlan(models.Model):
    name = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    start_date = models.DateField()
    end_date = models.DateField()
    athlete = models.ForeignKey(
        Athlete,
        on_delete=models.CASCADE,
        related_name='training_plans'
    )
    coach = models.ForeignKey(
        Coach,
        on_delete=models.SET_NULL,
        null=True,
        related_name='training_plans_created'
    )

    class Meta:
        verbose_name = 'Plano de Treinamento'
        verbose_name_plural = 'Planos de Treinamento'
        ordering = ['-start_date']

    def __str__(self):
        return f"{self.name} - {self.athlete.user.get_full_name()}"

    def is_active(self):
        today = datetime.now().date()
        return self.start_date <= today <= self.end_date


class TrainingSession(models.Model):
    INTENSITY_CHOICES = (
        ('Low', 'Baixa'),
        ('Moderate', 'Moderada'),
        ('High', 'Alta'),
        ('Very High', 'Muito Alta'),
    )

    target_zone = models.CharField(max_length=50)
    type = models.CharField(max_length=100, help_text="Tipo de treino")
    intensity = models.CharField(
        max_length=50,
        choices=INTENSITY_CHOICES,
        default='Moderate'
    )
    duration = models.IntegerField(
        help_text="Duração em minutos",
        validators=[MinValueValidator(1)]
    )
    date = models.DateTimeField()
    plan = models.ForeignKey(
        TrainingPlan,
        on_delete=models.CASCADE,
        related_name='sessions'
    )

    class Meta:
        verbose_name = 'Sessão de Treinamento'
        verbose_name_plural = 'Sessões de Treinamento'
        ordering = ['-date']

    def __str__(self):
        return f"{self.type} - {self.date.strftime('%d/%m/%Y %H:%M')}"


class SubjectiveScale(models.Model):
    SCALE_TYPE_CHOICES = (
        ('Borg', 'Escala de Borg'),
        ('Recovery', 'Recuperação'),
    )

    type = models.CharField(
        max_length=30,
        choices=SCALE_TYPE_CHOICES,
        help_text="Tipo de escala"
    )
    value = models.IntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(10)],
        help_text="Valor da escala (0-10)"
    )
    date = models.DateTimeField(auto_now_add=True)
    athlete = models.ForeignKey(
        Athlete,
        on_delete=models.CASCADE,
        related_name='subjective_scales'
    )

    class Meta:
        verbose_name = 'Escala Subjetiva'
        verbose_name_plural = 'Escalas Subjetivas'
        ordering = ['-date']

    def __str__(self):
        return f"{self.get_type_display()}: {self.value} - {self.athlete.user.get_full_name()}"


class Feedback(models.Model):
    message = models.TextField()
    date = models.DateTimeField(auto_now_add=True)
    athlete = models.ForeignKey(
        Athlete,
        on_delete=models.CASCADE,
        related_name='feedbacks_received'
    )
    coach = models.ForeignKey(
        Coach,
        on_delete=models.CASCADE,
        related_name='feedbacks_sent'
    )

    class Meta:
        verbose_name = 'Feedback'
        verbose_name_plural = 'Feedbacks'
        ordering = ['-date']

    def __str__(self):
        return f"Feedback para {self.athlete.user.get_full_name()} - {self.date.strftime('%d/%m/%Y')}"
