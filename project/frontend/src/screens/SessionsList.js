"use client"

import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from "react-native"
import { useState, useEffect } from "react"
import { colors, spacing, borderRadius, shadows } from "../theme/colors"
import { ClockIcon, ActivityIcon, CheckCircleIcon } from "../components/Icons"
import { trainingService } from "../services/trainingService"
import { useAuth } from "../contexts/AuthContext"

export default function SessionsList({ navigation }) {
  const { user } = useAuth()
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    loadSessions()
  }, [user])

  const loadSessions = async () => {
    setLoading(true)
    try {
      if (user?.id) {
        const fetchedSessions = await trainingService.getSessions(user.id)
        setSessions(fetchedSessions)
      }
    } catch (error) {
      console.error("Error loading sessions:", error)
    } finally {
      setLoading(false)
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await loadSessions()
    setRefreshing(false)
  }

  const getStatusColor = (status) => {
    return status === "concluido" ? colors.success : colors.warning
  }

  const getZoneColor = (zone) => {
    return colors[`zone${zone}`] || colors.primary
  }

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Carregando sessões...</Text>
      </View>
    )
  }

  const completedSessions = sessions.filter((s) => s.status === "concluido")
  const upcomingSessions = sessions.filter((s) => s.status !== "concluido")

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Minhas Sessões</Text>
        <Text style={styles.subtitle}>
          {completedSessions.length} concluídas · {upcomingSessions.length} próximas
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
      >
        {upcomingSessions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Próximas Sessões</Text>
            {upcomingSessions.map((session) => (
              <TouchableOpacity
                key={session.id}
                style={[styles.sessionCard, shadows.sm]}
                onPress={() => navigation.navigate("SessionDetail", { sessionId: session.id })}
                activeOpacity={0.85}
              >
                <View style={styles.sessionLeft}>
                  <View style={styles.timeContainer}>
                    <ClockIcon color={colors.primary} size={14} />
                    <Text style={styles.timeText}>{session.dayLabel || "Hoje"}</Text>
                  </View>
                  <View style={styles.sessionInfo}>
                    <Text style={styles.sessionName}>{session.title}</Text>
                    <View style={styles.sessionMeta}>
                      <ActivityIcon color={colors.textSecondary} size={12} />
                      <Text style={styles.durationText}>{session.duracao} min</Text>
                    </View>
                  </View>
                </View>
                <View style={[styles.zoneBadge, { backgroundColor: getZoneColor(session.zone) }]}>
                  <Text style={styles.zoneText}>Z{session.zone}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {completedSessions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Concluídas Recentemente</Text>
            {completedSessions.map((session) => (
              <TouchableOpacity
                key={session.id}
                style={[styles.sessionCard, styles.completedCard, shadows.sm]}
                onPress={() => navigation.navigate("SessionDetail", { sessionId: session.id })}
                activeOpacity={0.85}
              >
                <View style={styles.sessionLeft}>
                  <CheckCircleIcon color={colors.success} size={20} />
                  <View style={styles.sessionInfo}>
                    <Text style={[styles.sessionName, styles.completedText]}>{session.title}</Text>
                    <View style={styles.sessionMeta}>
                      <Text style={styles.durationText}>{session.duracao} min</Text>
                    </View>
                  </View>
                </View>
                <View style={[styles.zoneBadge, { backgroundColor: getZoneColor(session.zone) }]}>
                  <Text style={styles.zoneText}>Z{session.zone}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {sessions.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📋</Text>
            <Text style={styles.emptyText}>Nenhuma sessão disponível</Text>
            <Text style={styles.emptySubtext}>Fale com seu treinador para agendar treinos</Text>
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
  header: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.text,
    marginBottom: spacing.xs,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: spacing.lg,
    paddingBottom: 0,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textSecondary,
    marginBottom: spacing.md,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sessionCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  completedCard: {
    opacity: 0.7,
  },
  sessionLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  timeContainer: {
    backgroundColor: colors.primary + "15",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    minWidth: 60,
    justifyContent: "center",
  },
  timeText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.primary,
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
  completedText: {
    textDecorationLine: "line-through",
    color: colors.textSecondary,
  },
  sessionMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  durationText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  zoneBadge: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: spacing.sm,
  },
  zoneText: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.white,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xxl * 3,
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
