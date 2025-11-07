"use client"

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
  ActivityIndicator,
  RefreshControl,
} from "react-native"
import { useEffect, useRef, useState } from "react"
import { colors, spacing, borderRadius, shadows } from "../theme/colors"
import { esrService } from "../services/esrService"
import { trainingService } from "../services/trainingService"
import { athleteService } from "../services/athleteService"
import { useAuth } from "../contexts/AuthContext"
import { ClockIcon, ActivityIcon, ArrowRightIcon } from "../components/Icons"

export default function AtletaHome({ navigation }) {
  const { user } = useAuth()
  const [lastESR, setLastESR] = useState(null)
  const [nextSession, setNextSession] = useState(null)
  const [stats, setStats] = useState(null)
  const [recentAssessments, setRecentAssessments] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    loadData()
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start()
  }, [])

  const loadData = async () => {
    if (!user?.id) return

    try {
      setLoading(true)
      const [esrData, sessionsData, statsData, assessmentsData] = await Promise.all([
        esrService.getLatestESR(user.id).catch(() => null),
        trainingService.getSessions(user.id).catch(() => []),
        athleteService.getAthleteStats(user.id).catch(() => null),
        trainingService.getAssessments(user.id).catch(() => []),
      ])

      setLastESR(esrData)
      const upcoming = sessionsData.filter((s) => s.status !== "concluido")
      setNextSession(upcoming[0] || null)
      setStats(statsData)
      setRecentAssessments((assessmentsData || []).sort((a, b) => new Date(b.data) - new Date(a.data)).slice(0, 3))
    } catch (error) {
      console.error("Error loading athlete data:", error)
    } finally {
      setLoading(false)
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await loadData()
    setRefreshing(false)
  }

  const getESRColor = (value) => {
    if (value <= 3) return colors.danger
    if (value <= 6) return colors.warning
    return colors.success
  }

  const getESRLabel = (value) => {
    if (value <= 3) return "Crítico"
    if (value <= 6) return "Moderado"
    return "Ótimo"
  }

  const getMotivationalMessage = () => {
    if (!lastESR) return "Registre seu ESR para começar!"
    if (lastESR.value >= 8) return "Você está em ótima forma! 💪"
    if (lastESR.value >= 6) return "Pronto para treinar! 🔥"
    if (lastESR.value >= 4) return "Vá com calma hoje. 🧘"
    return "Priorize o descanso! 😴"
  }

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Carregando dados...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
      >
        {/* Header with Greeting */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Olá, {user?.name?.split(" ")[0] || "Atleta"}! 👋</Text>
          <Text style={styles.motivationalMessage}>{getMotivationalMessage()}</Text>
        </View>

        {nextSession && (
          <Animated.View style={[styles.nextSessionCard, shadows.lg, { opacity: fadeAnim }]}>
            <View style={styles.nextSessionBadge}>
              <Text style={styles.nextSessionBadgeText}>PRÓXIMO TREINO</Text>
            </View>
            <Text style={styles.nextSessionTitle}>{nextSession.title}</Text>
            <View style={styles.nextSessionDetails}>
              <View style={styles.detailItem}>
                <ClockIcon color={colors.white} size={16} />
                <Text style={styles.detailText}>{nextSession.timeLabel || "Agora"}</Text>
              </View>
              <View style={styles.detailItem}>
                <ActivityIcon color={colors.white} size={16} />
                <Text style={styles.detailText}>{nextSession.duracao || 45} min</Text>
              </View>
            </View>
            <View
              style={[styles.nextSessionZone, { backgroundColor: colors[`zone${nextSession.zone}`] || colors.primary }]}
            >
              <Text style={styles.zoneLabel}>ZONA {nextSession.zone}</Text>
            </View>
            <TouchableOpacity
              style={styles.nextSessionButton}
              onPress={() => navigation.navigate("SessionDetail", { sessionId: nextSession.id })}
              activeOpacity={0.85}
            >
              <Text style={styles.nextSessionButtonText}>VER DETALHES</Text>
              <ArrowRightIcon color={colors.primary} size={16} />
            </TouchableOpacity>
          </Animated.View>
        )}

        {stats && (
          <Animated.View style={[styles.quickStats, { opacity: fadeAnim }]}>
            <View style={[styles.quickStatItem, shadows.sm]}>
              <Text style={styles.quickStatEmoji}>💪</Text>
              <Text style={styles.quickStatValue}>
                {stats.weeklySessionsCompleted}/{stats.weeklySessionsTotal}
              </Text>
              <Text style={styles.quickStatLabel}>Treinos Semana</Text>
            </View>
            <View style={[styles.quickStatItem, shadows.sm]}>
              <Text style={styles.quickStatEmoji}>🔥</Text>
              <Text style={styles.quickStatValue}>{stats.streak || 0}</Text>
              <Text style={styles.quickStatLabel}>Sequência</Text>
            </View>
            <View style={[styles.quickStatItem, shadows.sm]}>
              <Text style={styles.quickStatEmoji}>⏱️</Text>
              <Text style={styles.quickStatValue}>{stats.totalMinutes || 0}</Text>
              <Text style={styles.quickStatLabel}>Min. Total</Text>
            </View>
          </Animated.View>
        )}

        {lastESR && (
          <Animated.View
            style={[styles.esrCard, { backgroundColor: getESRColor(lastESR.value) }, shadows.md, { opacity: fadeAnim }]}
          >
            <View style={styles.esrContent}>
              <Text style={styles.esrTitle}>Sua Recuperação</Text>
              <View style={styles.esrValueRow}>
                <View style={styles.esrValueContainer}>
                  <Text style={styles.esrValue}>{lastESR.value}</Text>
                  <Text style={styles.esrStatus}>{getESRLabel(lastESR.value)}</Text>
                </View>
                <Text style={styles.esrDescription}>Escala de 0 a 10</Text>
              </View>
            </View>
          </Animated.View>
        )}

        {recentAssessments.length > 0 && (
          <Animated.View style={[styles.assessmentsSection, shadows.sm, { opacity: fadeAnim }]}>
            <View style={styles.assessmentsSectionHeader}>
              <Text style={styles.assessmentsSectionTitle}>Avaliações Recentes</Text>
              <TouchableOpacity onPress={() => navigation.navigate("History")} activeOpacity={0.85}>
                <Text style={styles.seeAllLink}>Ver todas</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.assessmentsList}>
              {recentAssessments.map((assessment) => (
                <View key={assessment.id} style={styles.assessmentPreviewItem}>
                  <View style={styles.assessmentPreviewDate}>
                    <Text style={styles.assessmentPreviewDateText}>
                      {new Date(assessment.data).toLocaleDateString("pt-BR", { month: "short", day: "numeric" })}
                    </Text>
                  </View>
                  <View style={styles.assessmentPreviewInfo}>
                    <View style={styles.assessmentPreviewRow}>
                      <Text style={styles.assessmentPreviewLabel}>FC:</Text>
                      <Text style={styles.assessmentPreviewValue}>{assessment.frequencia_cardiaca} bpm</Text>
                    </View>
                    <Text style={styles.assessmentPreviewZone}>{assessment.zona_treinamento}</Text>
                  </View>
                </View>
              ))}
            </View>
          </Animated.View>
        )}

        <View style={styles.quickActionsSection}>
          <TouchableOpacity
            style={[styles.actionButton, shadows.sm]}
            onPress={() => navigation.navigate("Sessions")}
            activeOpacity={0.85}
          >
            <Text style={styles.actionEmoji}>📋</Text>
            <Text style={styles.actionButtonText}>Todos os Treinos</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, shadows.sm]}
            onPress={() => navigation.navigate("History")}
            activeOpacity={0.85}
          >
            <Text style={styles.actionEmoji}>📊</Text>
            <Text style={styles.actionButtonText}>Histórico</Text>
          </TouchableOpacity>
        </View>

        {!nextSession && !stats && !lastESR && !recentAssessments.length && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📊</Text>
            <Text style={styles.emptyText}>Nenhum dado disponível</Text>
            <Text style={styles.emptySubtext}>Seus dados de treino aparecerão aqui</Text>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.md,
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    marginBottom: spacing.lg,
    paddingTop: spacing.md,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.text,
    marginBottom: spacing.xs,
    letterSpacing: -0.5,
  },
  motivationalMessage: {
    fontSize: 15,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  nextSessionCard: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    overflow: "hidden",
  },
  nextSessionBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  nextSessionBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.white,
    letterSpacing: 1,
  },
  nextSessionTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.white,
    marginBottom: spacing.md,
    letterSpacing: -0.5,
  },
  nextSessionDetails: {
    flexDirection: "row",
    gap: spacing.lg,
    marginBottom: spacing.lg,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  detailText: {
    fontSize: 13,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "600",
  },
  nextSessionZone: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    alignSelf: "flex-start",
    marginBottom: spacing.md,
  },
  zoneLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.white,
    letterSpacing: 0.5,
  },
  nextSessionButton: {
    backgroundColor: colors.white,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  nextSessionButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.primary,
    letterSpacing: 0.5,
  },
  quickStats: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  quickStatItem: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: "center",
  },
  quickStatEmoji: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  quickStatValue: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  quickStatLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    textAlign: "center",
    fontWeight: "600",
  },
  esrCard: {
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    overflow: "hidden",
  },
  esrContent: {
    gap: spacing.md,
  },
  esrTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.white,
    letterSpacing: 0.3,
  },
  esrValueRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  esrValueContainer: {
    alignItems: "flex-start",
  },
  esrValue: {
    fontSize: 44,
    fontWeight: "900",
    color: colors.white,
    lineHeight: 44,
  },
  esrStatus: {
    fontSize: 12,
    color: "rgba(255,255,255,0.85)",
    marginTop: spacing.xs,
    fontWeight: "600",
  },
  esrDescription: {
    fontSize: 12,
    color: "rgba(255,255,255,0.85)",
    fontWeight: "500",
  },
  quickActionsSection: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  actionButton: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: "center",
    justifyContent: "center",
  },
  actionEmoji: {
    fontSize: 26,
    marginBottom: spacing.sm,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.text,
    textAlign: "center",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xxl * 2,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
  },
  assessmentsSection: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  assessmentsSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  assessmentsSectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  seeAllLink: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.primary,
  },
  assessmentsList: {
    gap: spacing.sm,
  },
  assessmentPreviewItem: {
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.neutralBg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  assessmentPreviewDate: {
    justifyContent: "center",
    alignItems: "center",
    minWidth: 60,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.primary + "15",
    borderRadius: borderRadius.md,
  },
  assessmentPreviewDateText: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.primary,
    textAlign: "center",
  },
  assessmentPreviewInfo: {
    flex: 1,
    justifyContent: "center",
  },
  assessmentPreviewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.xs,
  },
  assessmentPreviewLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  assessmentPreviewValue: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.text,
  },
  assessmentPreviewZone: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: "600",
  },
})
