"use client"

import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native"
import { useState, useEffect } from "react"
import { colors, spacing, borderRadius, shadows } from "../theme/colors"
import { ArrowLeftIcon, ActivityIcon, PlusIcon } from "../components/Icons"
import { athleteService } from "../services/athleteService"
import { trainingService } from "../services/trainingService"
import { esrService } from "../services/esrService"

export default function AthleteDetailTreinador({ navigation, route }) {
  const { athleteId } = route.params || {}
  const [athlete, setAthlete] = useState(null)
  const [plans, setPlans] = useState([])
  const [lastESR, setLastESR] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAthleteData()
  }, [athleteId])

  const loadAthleteData = async () => {
    try {
      setLoading(true)
      const [athleteData, plansData, esrData] = await Promise.all([
        athleteService.getAthleteById(athleteId),
        trainingService.getTrainingPlans(athleteId),
        esrService.getLatestESR(athleteId).catch(() => null),
      ])

      setAthlete(athleteData)
      setPlans(plansData || [])
      setLastESR(esrData)
    } catch (error) {
      console.error(" Error loading athlete data:", error)
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
              {athlete.name
                ?.split(" ")
                .map((n) => n[0])
                .join("") || "??"}
            </Text>
          </View>
          <Text style={styles.name}>{athlete.name || "Atleta"}</Text>
          <Text style={styles.email}>{athlete.email || "email@example.com"}</Text>
        </View>

        <View style={[styles.card, shadows.sm]}>
          <Text style={styles.cardTitle}>Dados Físicos</Text>
          <View style={styles.dataGrid}>
            <View style={styles.dataItem}>
              <Text style={styles.dataLabel}>Peso</Text>
              <Text style={styles.dataValue}>{athlete.peso || 0} kg</Text>
            </View>
            <View style={styles.dataItem}>
              <Text style={styles.dataLabel}>Altura</Text>
              <Text style={styles.dataValue}>{athlete.altura || 0} m</Text>
            </View>
            <View style={styles.dataItem}>
              <Text style={styles.dataLabel}>Idade</Text>
              <Text style={styles.dataValue}>{athlete.age || 0} anos</Text>
            </View>
            <View style={styles.dataItem}>
              <Text style={styles.dataLabel}>FC Rep.</Text>
              <Text style={styles.dataValue}>{athlete.hrRep || athlete.frequencia_cardiaca_repouso || 0} bpm</Text>
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
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Planos de Treinamento</Text>
            <TouchableOpacity
              style={styles.addPlanButton}
              onPress={() => navigation.navigate("PlanEditor", { athleteId, mode: "create" })}
            >
              <PlusIcon color={colors.primary} size={20} />
            </TouchableOpacity>
          </View>

          {plans.length === 0 ? (
            <View style={styles.emptyPlans}>
              <Text style={styles.emptyPlansText}>Nenhum plano criado ainda</Text>
              <Text style={styles.emptyPlansSubtext}>Crie um plano para começar</Text>
            </View>
          ) : (
            <View style={styles.plansList}>
              {plans.map((plan) => (
                <TouchableOpacity
                  key={plan.id}
                  style={styles.planItem}
                  onPress={() => navigation.navigate("PlanEditor", { athleteId, planId: plan.id, mode: "edit" })}
                  activeOpacity={0.7}
                >
                  <View style={styles.planInfo}>
                    <Text style={styles.planName}>{plan.nome}</Text>
                    <Text style={styles.planDates}>
                      {new Date(plan.data_inicio).toLocaleDateString("pt-BR")} -{" "}
                      {new Date(plan.data_fim).toLocaleDateString("pt-BR")}
                    </Text>
                    <Text style={styles.planSessions}>{plan.sessoes?.length || 0} sessões</Text>
                  </View>
                  <View
                    style={[
                      styles.planStatus,
                      { backgroundColor: plan.status === "ativo" ? colors.success : colors.textSecondary },
                    ]}
                  >
                    <Text style={styles.planStatusText}>{plan.status === "ativo" ? "Ativo" : "Inativo"}</Text>
                  </View>
                </TouchableOpacity>
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
  addPlanButton: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary + "15",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyPlans: {
    alignItems: "center",
    paddingVertical: spacing.xl,
  },
  emptyPlansText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  emptyPlansSubtext: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  plansList: {
    gap: spacing.md,
  },
  planItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.md,
    backgroundColor: colors.neutralBg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  planDates: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    fontWeight: "500",
  },
  planSessions: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: "600",
  },
  planStatus: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  planStatusText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.white,
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
})
