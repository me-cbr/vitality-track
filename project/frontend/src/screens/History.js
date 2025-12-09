"use client"

import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from "react-native"
import { useState, useEffect } from "react"
import { colors, spacing, borderRadius } from "../theme/colors"
import { TrendingUpIcon, HeartIcon, ZoneIcon } from "../components/Icons"
import { useAuth } from "../contexts/AuthContext"
import { esrService } from "../services/esrService"
import { trainingService } from "../services/trainingService"
import { athleteService } from "../services/athleteService"
import { getZoneColorByNumber, getZoneNameByNumber } from "../utils/zoneUtils"

export default function History() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [esrData, setEsrData] = useState([])
  const [sessionsData, setSessionsData] = useState([])
  const [statsData, setStatsData] = useState(null)
  const [assessmentData, setAssessmentData] = useState(null)
  const [selectedPeriod, setSelectedPeriod] = useState("7days")

  useEffect(() => {
    loadHistoricalData()
  }, [user?.id || user?.atleta_id, selectedPeriod])

  const loadHistoricalData = async () => {
    try {
      setLoading(true)
      const athleteId = user?.atleta_id || user?.athleteId || user?.id

      // ESR records
      const esrRecords = await esrService.getESRRecords(athleteId).catch(() => [])
      const filteredESR = filterByPeriod(esrRecords, selectedPeriod)
      setEsrData(filteredESR.sort((a, b) => new Date(a.data) - new Date(b.data)))

      // Sessions
      const sessions = await trainingService.getSessions(athleteId).catch(() => [])
      const completedSessions = sessions.filter((s) => s.status === "concluido")
      const sorted = completedSessions.sort((a, b) => new Date(b.data) - new Date(a.data))
      setSessionsData(sorted.slice(0, 10))

      // Stats (from athlete service)
      const stats = await athleteService.getAthleteStats(athleteId).catch(() => null)
      setStatsData(stats)

      // Assessments
      const assessments = await trainingService.getAssessments(athleteId).catch(() => [])
      const latestAssessment = assessments.sort((a, b) => new Date(b.data) - new Date(a.data))[0]
      setAssessmentData(latestAssessment)
    } catch (error) {
      console.error("Error loading history data:", error)
      Alert.alert("Erro", "Não foi possível carregar o histórico")
    } finally {
      setLoading(false)
    }
  }

  const filterByPeriod = (data, period) => {
    const now = new Date()
    const filtered = data.filter((item) => {
      const itemDate = new Date(item.data)
      if (period === "7days") return (now - itemDate) / (1000 * 60 * 60 * 24) <= 7
      if (period === "30days") return (now - itemDate) / (1000 * 60 * 60 * 24) <= 30
      return true
    })
    return filtered
  }

  const calculateESRStats = () => {
    if (esrData.length === 0) return { media: 0, max: 0, min: 0 }
    const valores = esrData.map((r) => r.valor)
    return {
      media: (valores.reduce((a, b) => a + b, 0) / valores.length).toFixed(1),
      max: Math.max(...valores),
      min: Math.min(...valores),
    }
  }

  const calculateTotalTime = () => {
    return sessionsData.reduce((total, session) => total + (session.duracao || 0), 0)
  }

  const getZoneColor = (zoneNum) => {
    return getZoneColorByNumber(zoneNum)
  }

  const getZoneName = (zoneNum) => {
    return getZoneNameByNumber(zoneNum)
  }

  const esrStats = calculateESRStats()
  const totalTime = calculateTotalTime()

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Histórico</Text>
        <Text style={styles.subtitle}>Acompanhe sua evolução</Text>
      </View>

      <View style={styles.periodSelector}>
        {["7days", "30days", "all"].map((period) => (
          <View
            key={period}
            style={[styles.periodButton, selectedPeriod === period && styles.periodButtonActive]}
            onTouchEnd={() => setSelectedPeriod(period)}
          >
            <Text style={[styles.periodButtonText, selectedPeriod === period && styles.periodButtonTextActive]}>
              {period === "7days" ? "7 dias" : period === "30days" ? "30 dias" : "Tudo"}
            </Text>
          </View>
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <HeartIcon color={colors.primary} size={24} />
            <Text style={styles.cardTitle}>Recuperação (ESR)</Text>
          </View>

          <View style={styles.chart}>
            {esrData.length > 0 ? (
              esrData.map((item, index) => {
                const maxHeight = 180
                const height = (item.valor / 10) * maxHeight
                const date = new Date(item.data)
                const dayLabel = date.toLocaleDateString("pt-BR", { weekday: "short" }).slice(0, 3)

                return (
                  <View key={index} style={styles.chartBar}>
                    <View
                      style={[
                        styles.bar,
                        {
                          height,
                          backgroundColor:
                            item.valor >= 7 ? colors.success : item.valor >= 5 ? colors.primary : colors.warning,
                        },
                      ]}
                    />
                    <Text style={styles.barLabel}>{dayLabel}</Text>
                    <Text style={styles.barValue}>{item.valor}</Text>
                  </View>
                )
              })
            ) : (
              <Text style={styles.emptyText}>Sem dados de ESR</Text>
            )}
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Média</Text>
              <Text style={styles.statValue}>{esrStats.media}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Máximo</Text>
              <Text style={styles.statValue}>{esrStats.max}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Mínimo</Text>
              <Text style={styles.statValue}>{esrStats.min}</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <ZoneIcon color={colors.primary} size={24} />
            <Text style={styles.cardTitle}>Zonas de Treinamento</Text>
          </View>

          <View style={styles.zonesList}>
            {sessionsData.length > 0 ? (
              sessionsData.slice(0, 5).map((session, index) => {
                const zoneColor = getZoneColor(session.zona_alvo)
                const zoneName = getZoneName(session.zona_alvo)
                const date = new Date(session.data)
                const dateStr = date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })

                return (
                  <View key={index} style={styles.zoneItem}>
                    <View style={styles.zoneItemLeft}>
                      <View style={[styles.zoneIndicator, { backgroundColor: zoneColor }]} />
                      <View>
                        <Text style={styles.sessionName}>{session.nome}</Text>
                        <Text style={styles.sessionDate}>{dateStr}</Text>
                      </View>
                    </View>
                    <View style={styles.zoneItemRight}>
                      <Text style={styles.zoneName}>{zoneName}</Text>
                      <Text style={styles.zoneDuration}>{session.duracao}min</Text>
                    </View>
                  </View>
                )
              })
            ) : (
              <Text style={styles.emptyText}>Sem sessões completadas</Text>
            )}
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <TrendingUpIcon color={colors.primary} size={24} />
            <Text style={styles.cardTitle}>Análise de Desempenho</Text>
          </View>

          {statsData ? (
            <View style={styles.metricsGrid}>
              <View style={styles.metricBox}>
                <Text style={styles.metricLabel}>ESR Média</Text>
                <Text style={styles.metricValue}>{statsData.averageESR?.toFixed(1) || "-"}</Text>
                <Text style={styles.metricSubtext}>últimos 7 dias</Text>
              </View>
              <View style={styles.metricBox}>
                <Text style={styles.metricLabel}>Adesão</Text>
                <Text style={styles.metricValue}>{statsData.adherence || "-"}%</Text>
                <Text style={styles.metricSubtext}>semana atual</Text>
              </View>
              <View style={styles.metricBox}>
                <Text style={styles.metricLabel}>Status</Text>
                <Text style={styles.metricValue}>{statsData.lastESR >= 6 ? "✓" : "!"}</Text>
                <Text style={styles.metricSubtext}>hoje</Text>
              </View>
            </View>
          ) : (
            <Text style={styles.emptyText}>Sem dados de desempenho</Text>
          )}
        </View>

        {assessmentData && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Última Avaliação Física</Text>
            <View style={styles.assessmentContent}>
              <View style={styles.assessmentItem}>
                <Text style={styles.assessmentLabel}>Data</Text>
                <Text style={styles.assessmentValue}>{new Date(assessmentData.data).toLocaleDateString("pt-BR")}</Text>
              </View>
              <View style={styles.assessmentItem}>
                <Text style={styles.assessmentLabel}>FC de Repouso</Text>
                <Text style={styles.assessmentValue}>{assessmentData.frequencia_cardiaca} bpm</Text>
              </View>
              <View style={styles.assessmentItem}>
                <Text style={styles.assessmentLabel}>Zona Recomendada</Text>
                <Text style={styles.assessmentValue}>{assessmentData.zona_treinamento}</Text>
              </View>
              {assessmentData.observacoes && (
                <View style={styles.assessmentObservations}>
                  <Text style={styles.assessmentLabel}>Observações</Text>
                  <Text style={styles.assessmentObsText}>{assessmentData.observacoes}</Text>
                </View>
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    padding: spacing.lg,
    paddingTop: 60,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  periodSelector: {
    flexDirection: "row",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  periodButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.neutralBg,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  periodButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  periodButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  periodButtonTextActive: {
    color: colors.white,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  chart: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 200,
    paddingTop: spacing.lg,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  chartBar: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  bar: {
    width: "100%",
    borderRadius: borderRadius.sm,
    minHeight: 10,
  },
  barLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    fontWeight: "500",
  },
  barValue: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.text,
    marginTop: spacing.xs,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    paddingVertical: spacing.lg,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: "center",
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.mediumSeaGreen, // anteriormente era colors.primary
  },
  zonesList: {
    gap: spacing.md,
  },
  zoneItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.neutralBg,
    borderRadius: borderRadius.md,
  },
  zoneItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: spacing.md,
  },
  zoneIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  sessionName: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  sessionDate: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  zoneItemRight: {
    alignItems: "flex-end",
  },
  zoneName: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.primary,
  },
  zoneDuration: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  metricsGrid: {
    flexDirection: "row",
    gap: spacing.md,
  },
  metricBox: {
    flex: 1,
    backgroundColor: colors.neutralBg,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  metricLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  metricSubtext: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  metricBar: {
    width: "100%",
    height: 6,
    backgroundColor: colors.border,
    borderRadius: borderRadius.sm,
    marginTop: spacing.sm,
    overflow: "hidden",
  },
  metricBarFill: {
    height: "100%",
    backgroundColor: colors.success,
  },
  assessmentContent: {
    gap: spacing.md,
  },
  assessmentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  assessmentLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  assessmentValue: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  assessmentObservations: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  assessmentObsText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginTop: spacing.sm,
  },
})
