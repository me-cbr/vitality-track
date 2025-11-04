"use client"

import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated } from "react-native"
import { useEffect, useRef } from "react"
import { colors, spacing, borderRadius, shadows } from "../theme/colors"

export default function TreinadorDashboard({ navigation }) {
  const athletes = [
    { id: "1", name: "Rafael Silva", age: 26, hrRep: 58, esr: 6, status: "ativo" },
    { id: "2", name: "Júlia Santos", age: 22, hrRep: 62, esr: 4, status: "alerta" },
    { id: "3", name: "Carlos Mendes", age: 30, hrRep: 64, esr: 8, status: "ativo" },
  ]

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

  const getESRStatus = (value) => {
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
          <Text style={styles.greeting}>Painel de Treinador</Text>
          <Text style={styles.subGreeting}>Gerencie seu time de atletas</Text>
        </View>

        {/* Stats Grid */}
        <Animated.View style={[styles.statsGrid, { opacity: fadeAnim }]}>
          <View style={[styles.statCard, shadows.sm]}>
            <View style={[styles.statIcon, { backgroundColor: colors.primary + "15" }]}>
              <Text style={styles.statEmoji}>👥</Text>
            </View>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Atletas</Text>
          </View>
          <View style={[styles.statCard, shadows.sm]}>
            <View style={[styles.statIcon, { backgroundColor: colors.success + "15" }]}>
              <Text style={styles.statEmoji}>📈</Text>
            </View>
            <Text style={styles.statValue}>89%</Text>
            <Text style={styles.statLabel}>Adesão</Text>
          </View>
          <View style={[styles.statCard, shadows.sm]}>
            <View style={[styles.statIcon, { backgroundColor: colors.danger + "15" }]}>
              <Text style={styles.statEmoji}>⚠️</Text>
            </View>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Alertas</Text>
          </View>
        </Animated.View>

        {/* Alert Card */}
        <Animated.View style={[styles.alertCard, shadows.md, { opacity: fadeAnim }]}>
          <View style={styles.alertLeft}>
            <View style={styles.alertIconBg}>
              <Text style={styles.alertIcon}>⚠️</Text>
            </View>
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>Atenção Necessária</Text>
              <Text style={styles.alertMessage}>Júlia (ESR baixo) - considere ajustar carga</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.alertAction}>
            <Text style={styles.alertActionText}>→</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Athletes List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Meus Atletas</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>3 ativos</Text>
            </View>
          </View>

          {athletes.map((athlete) => (
            <TouchableOpacity
              key={athlete.id}
              style={[styles.athleteCard, shadows.sm]}
              onPress={() => navigation.navigate("AthleteDetail", { athleteId: athlete.id })}
              activeOpacity={0.85}
            >
              <View style={styles.athleteHeader}>
                <View style={styles.athleteAvatar}>
                  <Text style={styles.athleteInitials}>
                    {athlete.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </Text>
                </View>
                <View style={styles.athleteInfo}>
                  <Text style={styles.athleteName}>{athlete.name}</Text>
                  <View style={styles.athleteMetrics}>
                    <Text style={styles.athleteMetric}>{athlete.age} anos</Text>
                    <View style={styles.metricDot} />
                    <Text style={styles.athleteMetric}>❤️ {athlete.hrRep} bpm</Text>
                  </View>
                </View>
              </View>
              <View style={[styles.esrBadge, { backgroundColor: getESRColor(athlete.esr) }]}>
                <Text style={styles.esrLabel}>ESR</Text>
                <Text style={styles.esrValue}>{athlete.esr}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ações Rápidas</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity style={[styles.actionCard, shadows.sm]}>
              <View style={[styles.actionIcon, { backgroundColor: colors.primary + "15" }]}>
                <Text style={styles.actionEmoji}>📝</Text>
              </View>
              <Text style={styles.actionLabel}>Novo Treino</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionCard, shadows.sm]}>
              <View style={[styles.actionIcon, { backgroundColor: colors.success + "15" }]}>
                <Text style={styles.actionEmoji}>📊</Text>
              </View>
              <Text style={styles.actionLabel}>Relatório</Text>
            </TouchableOpacity>
          </View>
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
})
