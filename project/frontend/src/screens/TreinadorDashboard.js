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
import { useAuth } from "../contexts/AuthContext"
import AddAthleteModal from "./AddAthleteModal"

export default function TreinadorDashboard({ navigation }) {
  const { user } = useAuth()
  const [athletes, setAthletes] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
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

    const coachId = user?.coachId || user?.treinador_id || user?.id

    if (!coachId) {
      console.log("No coachId found in user:", user)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const athletesData = await athleteService.getAthletes(coachId)

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

      setAthletes(athletesData)

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
    if (value <= 3) return colors.danger
    if (value <= 6) return colors.warning
    return colors.success
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
                  {alertAthlete.nome} (ESR {alertAthlete.ultimaESR}) - considere ajustar carga
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
            athletes.map((athlete) => (
              <TouchableOpacity
                key={athlete.id}
                style={[styles.athleteCard, shadows.sm]}
                onPress={() => navigation.navigate("AthleteDetail", { athleteId: athlete.id })}
                activeOpacity={0.85}
              >
                <View style={styles.athleteHeader}>
                  <View style={styles.athleteAvatar}>
                    <Text style={styles.athleteInitials}>
                      {athlete.nome
                        ? athlete.nome
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                        : "??"}
                    </Text>
                  </View>
                  <View style={styles.athleteInfo}>
                    <Text style={styles.athleteName}>{athlete.nome || "Atleta"}</Text>
                    <View style={styles.athleteMetrics}>
                      <Text style={styles.athleteMetric}>{calculateAge(athlete.data_nascimento)} anos</Text>
                      <View style={styles.metricDot} />
                      <Text style={styles.athleteMetric}>❤️ {athlete.frequencia_cardiaca_repouso} bpm</Text>
                    </View>
                  </View>
                </View>
                {athlete.ultimaESR && (
                  <View style={[styles.esrBadge, { backgroundColor: getESRColor(athlete.ultimaESR) }]}>
                    <Text style={styles.esrLabel}>ESR</Text>
                    <Text style={styles.esrValue}>{athlete.ultimaESR}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))
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
    backgroundColor: colors.warning,
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  athleteHeader: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  athleteAvatar: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
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
  actionGrid: {
    flexDirection: "row",
    gap: spacing.md,
  },
  actionCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
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
