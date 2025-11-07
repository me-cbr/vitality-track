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
import { ClockIcon, ActivityIcon } from "../components/Icons"

export default function AtletaHome({ navigation }) {
  const { user } = useAuth()
  const [lastESR, setLastESR] = useState(null)
  const [weeklyProgress, setWeeklyProgress] = useState(null)
  const [upcomingSessions, setUpcomingSessions] = useState([])
  const [nextSession, setNextSession] = useState(null)
  const [stats, setStats] = useState(null)
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
      const [esrData, sessionsData, statsData] = await Promise.all([
        esrService.getLatestESR(user.id).catch(() => null),
        trainingService.getSessions(user.id).catch(() => []),
        athleteService.getAthleteStats(user.id).catch(() => null),
      ])

      setLastESR(esrData)
      const upcoming = sessionsData.filter((s) => s.status !== "concluido")
      setNextSession(upcoming[0] || null)
      setUpcomingSessions(upcoming.slice(0, 3))
      setStats(statsData)
      setWeeklyProgress(statsData?.weeklyProgress || null)
    } catch (error) {
      console.error(" Error loading athlete data:", error)
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
    if (lastESR.value >= 8) return "Você está em ótima forma! Continue assim! 💪"
    if (lastESR.value >= 6) return "Boa recuperação! Pronto para treinar! 🔥"
    if (lastESR.value >= 4) return "Recuperação moderada. Vá com calma hoje. 🧘"
    return "Priorize o descanso hoje. Seu corpo precisa! 😴"
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
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Olá, {user?.name?.split(" ")[0] || "Atleta"}! 👋</Text>
          <Text style={styles.subGreeting}>{getMotivationalMessage()}</Text>
        </View>

        {/* Quick Actions */}
        <Animated.View style={[styles.quickActions, { opacity: fadeAnim }]}>
          <TouchableOpacity
            style={[styles.quickActionCard, shadows.sm]}
            onPress={() => navigation.navigate("Sessions")}
            activeOpacity={0.85}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: colors.secondary + "15" }]}>
              <Text style={styles.quickActionEmoji}>📋</Text>
            </View>
            <Text style={styles.quickActionText}>Ver Treinos</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickActionCard, shadows.sm]}
            onPress={() => navigation.navigate("History")}
            activeOpacity={0.85}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: colors.action + "15" }]}>
              <Text style={styles.quickActionEmoji}>📊</Text>
            </View>
            <Text style={styles.quickActionText}>Histórico</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Progress Card */}
        {weeklyProgress && (
          <Animated.View style={[styles.progressCard, shadows.md, { opacity: fadeAnim }]}>
            <View style={styles.progressHeader}>
              <View>
                <Text style={styles.progressTitle}>Progresso Semanal</Text>
                <Text style={styles.progressSubtitle}>
                  {weeklyProgress.completed} de {weeklyProgress.total} sessões completas
                </Text>
              </View>
              <View style={styles.progressBadge}>
                <Text style={styles.progressBadgeText}>{Math.round(weeklyProgress.percentage)}%</Text>
              </View>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${weeklyProgress.percentage}%` }]} />
            </View>
          </Animated.View>
        )}

        {/* ESR Card */}
        {lastESR && (
          <Animated.View
            style={[styles.esrCard, { backgroundColor: getESRColor(lastESR.value) }, { opacity: fadeAnim }]}
          >
            <View style={styles.esrContent}>
              <View style={styles.esrHeader}>
                <View>
                  <Text style={styles.esrTitle}>Última Avaliação ESR</Text>
                  <Text style={styles.esrSubtitle}>Como você está se sentindo</Text>
                </View>
                <View style={styles.esrValueContainer}>
                  <Text style={styles.esrValue}>{lastESR.value}</Text>
                  <Text style={styles.esrLabel}>{getESRLabel(lastESR.value)}</Text>
                </View>
              </View>
            </View>
          </Animated.View>
        )}

        {/* Stats Grid */}
        {stats && (
          <Animated.View style={[styles.statsGrid, { opacity: fadeAnim }]}>
            <View style={[styles.statCard, shadows.sm]}>
              <View style={[styles.statIcon, { backgroundColor: colors.primary + "15" }]}>
                <Text style={styles.statEmoji}>💪</Text>
              </View>
              <Text style={styles.statValue}>
                {stats.weeklySessionsCompleted}/{stats.weeklySessionsTotal}
              </Text>
              <Text style={styles.statLabel}>Treinos Semana</Text>
            </View>
            <View style={[styles.statCard, shadows.sm]}>
              <View style={[styles.statIcon, { backgroundColor: colors.success + "15" }]}>
                <Text style={styles.statEmoji}>🔥</Text>
              </View>
              <Text style={styles.statValue}>{stats.streak || 0}</Text>
              <Text style={styles.statLabel}>Dias Seguidos</Text>
            </View>
            <View style={[styles.statCard, shadows.sm]}>
              <View style={[styles.statIcon, { backgroundColor: colors.action + "15" }]}>
                <Text style={styles.statEmoji}>⏱️</Text>
              </View>
              <Text style={styles.statValue}>{stats.totalMinutes || 0}</Text>
              <Text style={styles.statLabel}>Min. Totais</Text>
            </View>
          </Animated.View>
        )}

        {/* Upcoming Sessions Section */}
        {upcomingSessions.length > 1 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Próximas Sessões</Text>
              <TouchableOpacity onPress={() => navigation.navigate("Sessions")}>
                <Text style={styles.sectionLink}>Ver todas</Text>
              </TouchableOpacity>
            </View>

            {upcomingSessions.slice(1).map((session) => (
              <TouchableOpacity
                key={session.id}
                style={[styles.sessionCard, shadows.sm]}
                onPress={() => navigation.navigate("SessionDetail", { sessionId: session.id })}
                activeOpacity={0.85}
              >
                <View style={styles.sessionLeft}>
                  <View style={styles.sessionTime}>
                    <Text style={styles.sessionTimeText}>{session.dayLabel || "Hoje"}</Text>
                  </View>
                  <View>
                    <Text style={styles.sessionTitle}>{session.title}</Text>
                    <Text style={styles.sessionTime2}>{session.timeLabel}</Text>
                  </View>
                </View>
                <View
                  style={[styles.zoneIndicator, { backgroundColor: colors[`zone${session.zone}`] || colors.primary }]}
                >
                  <Text style={styles.zoneText}>Z{session.zone}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Next Session Card */}
        {nextSession && (
          <Animated.View style={[styles.nextSessionCard, shadows.lg, { opacity: fadeAnim }]}>
            <View style={styles.nextSessionHeader}>
              <Text style={styles.nextSessionLabel}>PRÓXIMO TREINO</Text>
              <View
                style={[
                  styles.nextSessionZone,
                  { backgroundColor: colors[`zone${nextSession.zone}`] || colors.primary },
                ]}
              >
                <Text style={styles.nextSessionZoneText}>ZONA {nextSession.zone}</Text>
              </View>
            </View>
            <Text style={styles.nextSessionTitle}>{nextSession.title}</Text>
            <View style={styles.nextSessionMeta}>
              <View style={styles.nextSessionMetaItem}>
                <ClockIcon color={colors.textSecondary} size={16} />
                <Text style={styles.nextSessionMetaText}>{nextSession.timeLabel}</Text>
              </View>
              <View style={styles.nextSessionMetaItem}>
                <ActivityIcon color={colors.textSecondary} size={16} />
                <Text style={styles.nextSessionMetaText}>{nextSession.duracao || 45} min</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.nextSessionButton}
              onPress={() => navigation.navigate("SessionDetail", { sessionId: nextSession.id })}
              activeOpacity={0.85}
            >
              <Text style={styles.nextSessionButtonText}>VER DETALHES</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Empty State */}
        {!weeklyProgress && !lastESR && !stats && upcomingSessions.length === 0 && (
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
  subGreeting: {
    fontSize: 15,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  progressCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.md,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  progressSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  progressBadge: {
    backgroundColor: colors.primary + "15",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  progressBadgeText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.primary,
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: colors.neutralBg,
    borderRadius: borderRadius.full,
    overflow: "hidden",
    marginBottom: spacing.md,
  },
  progressBar: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
  },
  esrCard: {
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 5,
  },
  esrContent: {
    gap: spacing.lg,
  },
  esrHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  esrTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.white,
  },
  esrSubtitle: {
    fontSize: 12,
    color: "rgba(255,255,255,0.85)",
    marginTop: spacing.xs,
    fontWeight: "500",
  },
  esrValueContainer: {
    alignItems: "flex-end",
  },
  esrValue: {
    fontSize: 48,
    fontWeight: "900",
    color: colors.white,
    lineHeight: 48,
  },
  esrLabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.85)",
    marginTop: spacing.xs,
    fontWeight: "600",
  },
  statsGrid: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: "center",
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  statEmoji: {
    fontSize: 24,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: "center",
    fontWeight: "600",
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
    letterSpacing: -0.3,
  },
  sectionLink: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primary,
  },
  sessionCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sessionLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  sessionTime: {
    backgroundColor: colors.primary + "15",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    minWidth: 60,
    alignItems: "center",
  },
  sessionTimeText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.primary,
  },
  sessionTime2: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    fontWeight: "500",
  },
  sessionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
  },
  zoneIndicator: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  zoneText: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.white,
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
  nextSessionCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  nextSessionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  nextSessionLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.primary,
    letterSpacing: 1,
  },
  nextSessionZone: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  nextSessionZoneText: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.white,
    letterSpacing: 0.5,
  },
  nextSessionTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.text,
    marginBottom: spacing.md,
    letterSpacing: -0.5,
  },
  nextSessionMeta: {
    flexDirection: "row",
    gap: spacing.lg,
    marginBottom: spacing.lg,
  },
  nextSessionMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  nextSessionMetaText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  nextSessionButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: "center",
  },
  nextSessionButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.white,
    letterSpacing: 0.5,
  },
  quickActions: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: "center",
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  quickActionEmoji: {
    fontSize: 28,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.text,
    textAlign: "center",
  },
})
