"use client"

import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native"
import { useState, useEffect } from "react"
import { colors, spacing, borderRadius, shadows } from "../theme/colors"
import { ArrowLeftIcon, ActivityIcon, EditIcon } from "../components/Icons"
import { athleteService } from "../services/athleteService"
import { trainingService } from "../services/trainingService"
import { esrService } from "../services/esrService"
import moment from "moment"

export default function AthleteDetailTreinador({ navigation, route }) {
  const { athleteId } = route.params || {}
  const [athlete, setAthlete] = useState(null)
  const [sessions, setSessions] = useState([])
  const [lastESR, setLastESR] = useState(null)
  const [assessments, setAssessments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAthleteData()
  }, [athleteId])

  const loadAthleteData = async () => {
    try {
      setLoading(true)
      const [athleteData, sessionsData, esrData, assessmentsData] = await Promise.all([
        athleteService.getAthleteById(athleteId),
        trainingService.getSessions(athleteId),
        esrService.getLatestESR(athleteId).catch(() => null),
        trainingService.getAssessments(athleteId).catch(() => []),
      ])

      setAthlete(athleteData)
      setSessions(sessionsData || [])
      setLastESR(esrData)
      setAssessments(assessmentsData || [])
    } catch (error) {
      console.error("Error loading athlete data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getESRColor = (value) => {
    if (!value) return colors.textSecondary
    if (value <= 3) return colors.danger
    if (value <= 6) return colors.warning
    return colors.success
  }

  const getESRLabel = (value) => {
    if (!value) return "Sem dados"
    if (value <= 3) return "Crítico"
    if (value <= 6) return "Moderado"
    return "Ótimo"
  }

  const calculateAge = (birthDate) => {
    return moment().diff(birthDate, "years")
  }

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Carregando dados...</Text>
      </View>
    )
  }

  if (!athlete) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Atleta não encontrado</Text>
      </View>
    )
  }

  const displayAthlete = athlete || {}
  const displayName = athlete?.user
    ? `${athlete.user.first_name || ""}${athlete.user.last_name ? ` ${athlete.user.last_name}` : ""}`.trim()
    : displayAthlete.name || displayAthlete.nome || "Atleta"
  const displayEmail = athlete?.user?.email || displayAthlete.email || "email@example.com"
  const displayAge = displayAthlete?.birth_date ? calculateAge(displayAthlete.birth_date) : 0

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeftIcon color={colors.text} size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Detalhes do Atleta</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.profileCard, shadows.md]}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(displayName
                ?.split(" ")
                .map((n) => n[0])
                .join("") || "??")}
            </Text>
          </View>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.email}>{displayEmail}</Text>
        </View>

        <View style={[styles.card, shadows.sm]}>
          <Text style={styles.cardTitle}>Dados Físicos</Text>
          <View style={styles.dataGrid}>
            <View style={styles.dataItem}>
              <Text style={styles.dataLabel}>Peso</Text>
              <Text style={styles.dataValue}>{displayAthlete?.weight || 0} kg</Text>
            </View>
            <View style={styles.dataItem}>
              <Text style={styles.dataLabel}>Altura</Text>
              <Text style={styles.dataValue}>{displayAthlete?.height || 0} m</Text>
            </View>
            <View style={styles.dataItem}>
              <Text style={styles.dataLabel}>Idade</Text>
              <Text style={styles.dataValue}>{displayAge} anos</Text>
            </View>
            <View style={styles.dataItem}>
              <Text style={styles.dataLabel}>FC Rep.</Text>
              <Text style={styles.dataValue}>{displayAthlete?.resting_heart_rate || 0} bpm</Text>
            </View>
          </View>
        </View>

        <View style={[styles.card, shadows.sm]}>
          <Text style={styles.cardTitle}>Última Avaliação ESR</Text>
          <View style={[styles.esrCard, { backgroundColor: getESRColor(lastESR?.value) + "20" }]}>
            <ActivityIcon color={getESRColor(lastESR?.value)} size={32} />
            <View style={styles.esrInfo}>
              <Text style={[styles.esrValue, { color: getESRColor(lastESR?.value) }]}>{lastESR?.value || "-"}/10</Text>
              <Text style={styles.esrLabel}>{getESRLabel(lastESR?.value)}</Text>
            </View>
          </View>
          {lastESR?.observacoes && <Text style={styles.esrObservation}>{lastESR.observacoes}</Text>}
        </View>

        <View style={[styles.card, shadows.sm]}>
          <Text style={styles.cardTitle}>Avaliações Físicas</Text>
          {assessments.length === 0 ? (
            <View style={styles.emptyAssessments}>
              <Text style={styles.emptyAssessmentsText}>Nenhuma avaliação registrada</Text>
              <Text style={styles.emptyAssessmentsSubtext}>Crie uma avaliação física para este atleta</Text>
            </View>
          ) : (
            <View style={styles.assessmentsList}>
              {assessments.map((assessment) => (
                <View key={assessment.id} style={styles.assessmentItem}>
                  <View style={styles.assessmentDate}>
                    <Text style={styles.assessmentDateText}>
                      {new Date(assessment.data).toLocaleDateString("pt-BR")}
                    </Text>
                  </View>
                  <View style={styles.assessmentInfo}>
                    <View style={styles.assessmentRow}>
                      <Text style={styles.assessmentLabel}>FC:</Text>
                      <Text style={styles.assessmentValue}>{assessment.frequencia_cardiaca} bpm</Text>
                    </View>
                    <View style={styles.assessmentRow}>
                      <Text style={styles.assessmentLabel}>Zona:</Text>
                      <Text style={styles.assessmentValue}>{assessment.zona_treinamento}</Text>
                    </View>
                    {assessment.observacoes && (
                      <Text style={styles.assessmentObservation}>{assessment.observacoes}</Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={[styles.card, shadows.sm]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Sessões de Treino</Text>
          </View>

          {sessions.length === 0 ? (
            <View style={styles.emptySessions}>
              <Text style={styles.emptySessionsText}>Nenhuma sessão criada</Text>
              <Text style={styles.emptySessionsSubtext}>Crie sessões de treino para este atleta</Text>
            </View>
          ) : (
            <View style={styles.sessionsList}>
              {sessions.map((session) => (
                <View key={session.id} style={styles.sessionItem}>
                  <View style={styles.sessionInfo}>
                    <Text style={styles.sessionName}>{session.name || session.title}</Text>
                    <Text style={styles.sessionZone}>{session.target_zone || `Zona ${session.zone}`}</Text>
                    <Text style={styles.sessionMeta}>
                      {session.training_type} • {session.duration}min • {session.date?.split("T")[0]}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("PlanEditor", { athleteId, sessionId: session.id, mode: "edit" })
                    }
                    style={styles.editButton}
                  >
                    <EditIcon color={colors.primary} size={18} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.actionsCard}>
          <TouchableOpacity
            style={[styles.actionButton, shadows.sm]}
            onPress={() => navigation.navigate("PlanEditor", { athleteId, mode: "createSession" })}
          >
            <Text style={styles.actionButtonText}>➕ Criar Nova Sessão</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton, shadows.sm]}
            onPress={() => navigation.navigate("Assessment", { athleteId })}
          >
            <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>📊 Nova Avaliação</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutralBg,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: 14,
    color: colors.textSecondary,
  },
  errorText: {
    fontSize: 16,
    color: colors.danger,
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingTop: 60,
    paddingBottom: spacing.lg,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  backButton: {
    padding: spacing.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  profileCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: "800",
    color: colors.white,
  },
  name: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  email: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.md,
  },
  dataGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  dataItem: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: colors.primary + "10",
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: "center",
  },
  dataLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    fontWeight: "600",
  },
  dataValue: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
  },
  esrCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    gap: spacing.lg,
  },
  esrInfo: {
    flex: 1,
  },
  esrValue: {
    fontSize: 32,
    fontWeight: "800",
  },
  esrLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: "600",
    marginTop: spacing.xs,
  },
  esrObservation: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: spacing.md,
    fontStyle: "italic",
  },
  emptySessions: {
    alignItems: "center",
    paddingVertical: spacing.xl,
  },
  emptySessionsText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  emptySessionsSubtext: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  sessionsList: {
    gap: spacing.sm,
  },
  sessionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.md,
    backgroundColor: colors.neutralBg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionName: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  sessionZone: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    fontWeight: "500",
  },
  sessionMeta: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  editButton: {
    padding: spacing.sm,
    marginLeft: spacing.sm,
  },
  actionsCard: {
    gap: spacing.md,
    marginBottom: spacing.xxl,
  },
  actionButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: "center",
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.white,
  },
  secondaryButton: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  secondaryButtonText: {
    color: colors.primary,
  },
  emptyAssessments: {
    alignItems: "center",
    paddingVertical: spacing.lg,
  },
  emptyAssessmentsText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  emptyAssessmentsSubtext: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  assessmentsList: {
    gap: spacing.sm,
  },
  assessmentItem: {
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.neutralBg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  assessmentDate: {
    justifyContent: "center",
    alignItems: "center",
    minWidth: 70,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.primary + "15",
    borderRadius: borderRadius.md,
  },
  assessmentDateText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.primary,
    textAlign: "center",
  },
  assessmentInfo: {
    flex: 1,
    justifyContent: "center",
  },
  assessmentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.xs,
  },
  assessmentLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  assessmentValue: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.text,
  },
  assessmentObservation: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    fontStyle: "italic",
  },
})
