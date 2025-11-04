"use client"

import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated } from "react-native"
import { useEffect, useRef } from "react"
import { colors, spacing, borderRadius, shadows } from "../theme/colors"

export default function AtletaHome({ navigation }) {
  const lastESR = 6
  const weeklyProgress = 0.8
  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start()
  }, [])

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

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Bem-vindo, Rafael</Text>
          <Text style={styles.subGreeting}>Vamos treinar hoje?</Text>
        </View>

        {/* Weekly Progress Card */}
        <Animated.View style={[styles.progressCard, shadows.md, { opacity: fadeAnim }]}>
          <View style={styles.progressHeader}>
            <View>
              <Text style={styles.progressTitle}>Progresso Semanal</Text>
              <Text style={styles.progressSubtitle}>4 de 5 sessões completas</Text>
            </View>
            <View style={styles.progressBadge}>
              <Text style={styles.progressBadgeText}>80%</Text>
            </View>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${weeklyProgress * 100}%` }]} />
          </View>
          <Text style={styles.progressLabel}>Sessão de hoje: Treino Intervalado - 18h00</Text>
        </Animated.View>

        {/* ESR Card - Featured */}
        <Animated.View style={[styles.esrCard, { backgroundColor: getESRColor(lastESR) }, { opacity: fadeAnim }]}>
          <View style={styles.esrContent}>
            <View style={styles.esrHeader}>
              <View>
                <View style={styles.esrTitleRow}>
                  <Text style={styles.esrEmoji}>❤️</Text>
                  <View>
                    <Text style={styles.esrTitle}>Escala Subjetiva (ESR)</Text>
                    <Text style={styles.esrSubtitle}>Avaliação 2h atrás</Text>
                  </View>
                </View>
              </View>
              <View style={styles.esrValueContainer}>
                <Text style={styles.esrValue}>{lastESR}</Text>
                <Text style={styles.esrLabel}>{getESRLabel(lastESR)}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.esrButton}
              onPress={() => navigation.navigate("ESRModal")}
              activeOpacity={0.85}
            >
              <Text style={styles.esrButtonText}>REGISTRAR NOVO ESR</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Stats Grid */}
        <Animated.View style={[styles.statsGrid, { opacity: fadeAnim }]}>
          <View style={[styles.statCard, shadows.sm]}>
            <View style={[styles.statIcon, { backgroundColor: colors.primary + "15" }]}>
              <Text style={styles.statEmoji}>💪</Text>
            </View>
            <Text style={styles.statValue}>4/5</Text>
            <Text style={styles.statLabel}>Sessões Semana</Text>
          </View>
          <View style={[styles.statCard, shadows.sm]}>
            <View style={[styles.statIcon, { backgroundColor: colors.success + "15" }]}>
              <Text style={styles.statEmoji}>🔥</Text>
            </View>
            <Text style={styles.statValue}>342</Text>
            <Text style={styles.statLabel}>Carga Total (TSS)</Text>
          </View>
        </Animated.View>

        {/* Upcoming Sessions Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Próximas Sessões</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Sessions")}>
              <Text style={styles.sectionLink}>Ver todas</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.sessionCard, shadows.sm]}
            onPress={() => navigation.navigate("SessionDetail", { sessionId: "1" })}
            activeOpacity={0.85}
          >
            <View style={styles.sessionLeft}>
              <View style={styles.sessionTime}>
                <Text style={styles.sessionTimeText}>Hoje</Text>
              </View>
              <View>
                <Text style={styles.sessionTitle}>Treino Intervalado Z4</Text>
                <Text style={styles.sessionTime2}>18h00 - 45 min</Text>
              </View>
            </View>
            <View style={[styles.zoneIndicator, { backgroundColor: colors.zone4 }]}>
              <Text style={styles.zoneText}>Z4</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.sessionCard, shadows.sm]}
            onPress={() => navigation.navigate("SessionDetail", { sessionId: "2" })}
            activeOpacity={0.85}
          >
            <View style={styles.sessionLeft}>
              <View style={styles.sessionTime}>
                <Text style={styles.sessionTimeText}>Amanhã</Text>
              </View>
              <View>
                <Text style={styles.sessionTitle}>Recuperação Z1-Z2</Text>
                <Text style={styles.sessionTime2}>19h00 - 60 min</Text>
              </View>
            </View>
            <View style={[styles.zoneIndicator, { backgroundColor: colors.zone1 }]}>
              <Text style={styles.zoneText}>Z1</Text>
            </View>
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
  progressLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "500",
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
  esrTitleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  esrEmoji: {
    fontSize: 28,
    marginTop: spacing.xs,
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
  esrButton: {
    height: 52,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
  esrButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.white,
    letterSpacing: 0.3,
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
})
