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
import { athleteService } from "../services/athleteService"
import { trainingService } from "../services/trainingService"
import { useAuth } from "../contexts/AuthContext"
import AddAthleteModal from "./AddAthleteModal"
import { feedbackService } from "../services/feedbackService"
import { USE_MOCKS, mockData } from "../config/mockData"

export default function TreinadorDashboard({ navigation }) {
  const { user } = useAuth()
  const [athletes, setAthletes] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [recentFeedbacks, setRecentFeedbacks] = useState([])
  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    loadData()
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start()
  }, [user?.id, user?.coachId])

  const loadData = async () => {
    if (!user) {
      console.log("No user available")
      setLoading(false)
      return
    }

    // For mock coach, use the coach record ID; otherwise use coachId/treinador_id/id
    const coachId = USE_MOCKS && user.type === "coach" 
      ? user.id 
      : user?.coachId || user?.treinador_id || user?.id

    if (!coachId) {
      console.log("No coachId found in user:", user)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      
      // Use mock data when USE_MOCKS is enabled
      const athletesData = USE_MOCKS 
        ? mockData.athletes 
        : await athleteService.getAthletes(coachId)

      if (!athletesData || athletesData.length === 0) {
        console.log("No athletes found for coach", coachId)
        setAthletes([])
        setStats({
          totalAthletes: 0,
          activeAthletes: 0,
          alertAthletes: 0,
          adherence: 0,
        })
        setLoading(false)
        return
      }

      // fetch sessions per athlete to compute metrics coming from training plans
      try {
        const athletesWithMetrics = await Promise.all(
          athletesData.map(async (a) => {
            try {
              const sessions = await trainingService.getSessions(a.id).catch(() => [])

              // consider sessions in the next 7 days for weekly metrics
              const now = new Date()
              const weekAhead = new Date()
              weekAhead.setDate(now.getDate() + 7)

              const upcoming = sessions.filter((s) => {
                if (!s.date) return false
                const d = new Date(s.date)
                return d >= now && d <= weekAhead
              })

              const treinos_semana = upcoming.length
              // carga_treino: sum of durations (minutes) in upcoming week
              const carga_treino = upcoming.reduce((acc, s) => acc + (s.duration || 0), 0)

              return { ...a, treinos_semana, carga_treino }
            } catch (err) {
              console.warn(`Error fetching sessions for athlete ${a.id}:`, err)
              return { ...a, treinos_semana: 0, carga_treino: 0 }
            }
          })
        )

        setAthletes(athletesWithMetrics)
      } catch (err) {
        console.warn("Could not compute athlete metrics:", err)
        setAthletes(athletesData)
      }
      
      try {
        const athleteIds = athletesData.map((a) => a.id)
        let allFeedbacks = []
        
        if (USE_MOCKS) {
          allFeedbacks = mockData.feedbacks.filter(f => athleteIds.includes(f.athlete_id))
        } else {
          for (const id of athleteIds) {
            const f = await feedbackService.getFeedbacksByAthlete(id).catch(() => [])
            allFeedbacks = allFeedbacks.concat(f)
          }
        }
        
        const sorted = allFeedbacks.sort((a, b) => new Date(b.data || b.created_at) - new Date(a.data || a.created_at)).slice(0, 3)
        setRecentFeedbacks(sorted)
      } catch (err) {
        console.warn("Could not load recent feedbacks:", err)
        setRecentFeedbacks([])
      }

      const totalAthletes = athletesData?.length || 0
      const activeAthletes = athletesData?.filter((a) => a?.status === "ativo")?.length || 0
      const alertAthletes = athletesData?.filter((a) => a?.ultimaESR && a.ultimaESR <= 4)?.length || 0
      const avgAdherence =
        totalAthletes > 0
          ? Math.round(athletesData.reduce((acc, a) => acc + (a?.adherence || 0), 0) / totalAthletes)
          : 0

      setStats({
        totalAthletes,
        activeAthletes,
        alertAthletes,
        adherence: avgAdherence,
      })
    } catch (error) {
      console.error("Error loading coach data:", error)
      setAthletes([])
      setStats({
        totalAthletes: 0,
        activeAthletes: 0,
        alertAthletes: 0,
        adherence: 0,
      })
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
    if (value <= 3) return colors.dangerDark
    if (value <= 6) return colors.mostarda
    return colors.primaryMedium
  }

  const getAthleteDisplayName = (athlete) => {
    // prefer nested user name coming from backend; fallback to legacy `nome` or `name`
    if (athlete.profile_image) {
      return athlete.profile_image
    }

    const fullName = athlete.user?.first_name
      ? `${athlete.user.first_name}${athlete.user.last_name ? ` ${athlete.user.last_name}` : ""}`
      : athlete.nome || athlete.name || null

    if (!fullName) return "??"

    return fullName
      .split(" ")
      .map((n) => (n ? n[0] : ""))
      .join("")
  }

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Carregando dados...</Text>
      </View>
    )
  }

  const alertAthlete = athletes?.find((a) => a?.ultimaESR && a.ultimaESR <= 4)

  return (
    <View style={styles.container}>
      <AddAthleteModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => {
          loadData()
        }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Painel de Treinador</Text>
          <Text style={styles.subGreeting}>Gerencie seu time de atletas</Text>
        </View>

        {stats && (
          <Animated.View style={[styles.statsGrid, { opacity: fadeAnim }]}>
            <View style={[styles.statCard, shadows.sm]}>
              <View style={[styles.statIcon, { backgroundColor: colors.primary + "15" }]}>
                <Text style={styles.statEmoji}>👥</Text>
              </View>
              <Text style={styles.statValue}>{stats.totalAthletes}</Text>
              <Text style={styles.statLabel}>Atletas</Text>
            </View>
            <View style={[styles.statCard, shadows.sm]}>
              <View style={[styles.statIcon, { backgroundColor: colors.success + "15" }]}>
                <Text style={styles.statEmoji}>📈</Text>
              </View>
              <Text style={styles.statValue}>{stats.adherence}%</Text>
              <Text style={styles.statLabel}>Adesão</Text>
            </View>
            <View style={[styles.statCard, shadows.sm]}>
              <View style={[styles.statIcon, { backgroundColor: colors.danger + "15" }]}>
                <Text style={styles.statEmoji}>⚠️</Text>
              </View>
              <Text style={styles.statValue}>{stats.alertAthletes}</Text>
              <Text style={styles.statLabel}>Alertas</Text>
            </View>
          </Animated.View>
        )}

        {alertAthlete && (
          <Animated.View style={[styles.alertCard, shadows.md, { opacity: fadeAnim }]}>
            <View style={styles.alertLeft}>
              <View style={styles.alertIconBg}>
                <Text style={styles.alertIcon}>⚠️</Text>
              </View>
              <View style={styles.alertContent}>
                <Text style={styles.alertTitle}>Atenção Necessária</Text>
                <Text style={styles.alertMessage}>
                  {(alertAthlete.user?.first_name || alertAthlete.nome)} (ESR {alertAthlete.ultimaESR}) - considere ajustar carga
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.alertAction}
              onPress={() => navigation.navigate("AthleteDetail", { athleteId: alertAthlete.id })}
            >
              <Text style={styles.alertActionText}>→</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {recentFeedbacks.length > 0 && (
          <View style={[styles.feedbackSection, shadows.sm]}>
            <Text style={styles.sectionTitle}>Feedback Recente</Text>
            <View style={styles.feedbacksList}>
              {recentFeedbacks.map((feedback) => {
                const athlete = athletes.find((a) => a.id === feedback.atleta_id)
                return (
                  <View key={feedback.id} style={styles.feedbackItem}>
                    <View style={styles.feedbackHeader}>
                      <View style={styles.feedbackAthleteInfo}>
                        <View
                          style={[
                            styles.feedbackAvatar,
                            {
                              backgroundColor:
                                feedback.tipo_mensagem === "alerta"
                                  ? colors.danger
                                  : feedback.tipo_mensagem === "elogio"
                                    ? colors.success
                                    : colors.primary,
                            },
                          ]}
                        >
                          <Text style={styles.feedbackAvatarText}>
                            {feedback.tipo_mensagem === "alerta"
                              ? "⚠️"
                              : feedback.tipo_mensagem === "elogio"
                                ? "⭐"
                                : "📝"}
                          </Text>
                        </View>
                        <View style={styles.feedbackMeta}>
                          <Text style={styles.feedbackAthleteName}>{athlete?.user?.first_name || athlete?.nome || athlete?.name || "Atleta"}</Text>
                          <Text style={styles.feedbackDate}>{new Date(feedback.data).toLocaleDateString("pt-BR")}</Text>
                        </View>
                      </View>
                      {!feedback.lido && <View style={styles.unreadDot} />}
                    </View>
                    <Text style={styles.feedbackMessage} numberOfLines={2}>
                      {feedback.mensagem}
                    </Text>
                  </View>
                )
              })}
            </View>
          </View>
        )}

        {/* Athletes List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Meus Atletas</Text>
            {stats && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{stats.activeAthletes} ativos</Text>
              </View>
            )}
          </View>

          {athletes.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>👥</Text>
              <Text style={styles.emptyText}>Nenhum atleta cadastrado</Text>
              <Text style={styles.emptySubtext}>Adicione atletas para começar</Text>
            </View>
          ) : (
            athletes.map((athlete) => {
              return (
                <TouchableOpacity
                  key={athlete.id}
                  style={[styles.athleteCard, shadows.sm]}
                  onPress={() => navigation.navigate("AthleteDetail", { athleteId: athlete.id })}
                  activeOpacity={0.85}
                >
                  <View style={styles.athleteCardContent}>
                    <View style={styles.athleteHeader}>
                      <View style={styles.athleteAvatar}>
                        <Text style={styles.athleteInitials}>{getAthleteDisplayName(athlete)}</Text>
                      </View>
                      <View style={styles.athleteInfo}>
                        <Text style={styles.athleteName}>{athlete.user?.first_name || athlete.nome || athlete.name || "Atleta"}</Text>
                        <View style={styles.athleteMetrics}>
                          <Text style={styles.athleteMetric}>{calculateAge(athlete.birth_date)} anos</Text>
                          <View style={styles.metricDot} />
                          <Text style={styles.athleteMetric}>❤️ {athlete.resting_heart_rate} bpm</Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.athleteMetricsRow}>
                      <View style={styles.metricBox}>
                        <Text style={styles.metricLabel}>Adesão</Text>
                        <Text style={styles.metricValue}>{athlete.adherence}%</Text>
                      </View>
                      <View style={styles.metricBox}>
                        <Text style={styles.metricLabel}>Treinos</Text>
                        <Text style={styles.metricValue}>{athlete.treinos_semana || 0}</Text>
                      </View>
                      <View style={styles.metricBox}>
                        <Text style={styles.metricLabel}>Carga</Text>
                        <Text style={styles.metricValue}>{athlete.carga_treino || 0}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.athleteRight}>
                    {athlete.ultimaESR && (
                      <View style={[styles.esrBadge, { backgroundColor: getESRColor(athlete.ultimaESR) }]}>
                        <Text style={styles.esrLabel}>ESR</Text>
                        <Text style={styles.esrValue}>{athlete.ultimaESR}</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              )
            })
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ações Rápidas</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity style={[styles.actionCard, shadows.sm]} onPress={() => setShowAddModal(true)}>
              <View style={[styles.actionIcon, { backgroundColor: colors.primary + "15" }]}>
                <Text style={styles.actionEmoji}>➕</Text>
              </View>
              <Text style={styles.actionLabel}>Adicionar Atleta</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

function calculateAge(birthDate) {
  if (!birthDate) return 0
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
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
    paddingTop: 35,
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
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  statEmoji: {
    fontSize: 20,
  },
  statValue: {
    fontSize: 20,
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
  alertCard: {
    backgroundColor: colors.warningDark,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  alertLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  alertIconBg: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  alertIcon: {
    fontSize: 24,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.white,
    marginBottom: spacing.xs,
  },
  alertMessage: {
    fontSize: 12,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "500",
  },
  alertAction: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  alertActionText: {
    fontSize: 20,
    color: colors.white,
    fontWeight: "700",
  },
  feedbackSection: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  feedbacksList: {
    gap: spacing.md,
  },
  feedbackItem: {
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    paddingLeft: spacing.md,
    paddingVertical: spacing.sm,
  },
  feedbackHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  feedbackAthleteInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    flex: 1,
  },
  feedbackAvatar: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  feedbackAvatarText: {
    fontSize: 14,
  },
  feedbackMeta: {
    flex: 1,
  },
  feedbackAthleteName: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.text,
  },
  feedbackDate: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  feedbackMessage: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "500",
    lineHeight: 18,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
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
    marginBottom: 5,
  },
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.primary + "15",
    borderRadius: borderRadius.full,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.primary,
  },
  athleteCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  athleteCardContent: {
    marginBottom: spacing.md,
  },
  athleteHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  athleteAvatar: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.aquaLight,
    justifyContent: "center",
    alignItems: "center",
  },
  athleteInitials: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.white,
  },
  athleteInfo: {
    flex: 1,
  },
  athleteName: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  athleteMetrics: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  athleteMetric: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  metricDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.divider,
  },
  athleteMetricsRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  metricBox: {
    flex: 1,
    backgroundColor: colors.neutralBg,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    alignItems: "center",
  },
  metricLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: "600",
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.text,
  },
  athleteRight: {
    flexDirection: "column",
    gap: spacing.sm,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  esrBadge: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  esrLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: "rgba(255,255,255,0.85)",
  },
  esrValue: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.white,
    marginTop: 1,
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "700",
  },
  actionGrid: {
    flexDirection: "row",
    gap: spacing.md,
  },
  actionCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  actionIcon: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  actionEmoji: {
    fontSize: 26,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.text,
    textAlign: "center",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xxl * 2,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
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
})
