import { View, Text, StyleSheet, ScrollView } from "react-native"
import { colors } from "../theme/colors"
import { ChartIcon } from "../components/Icons"

export default function History() {
  const weekData = [
    { day: "Seg", esr: 7, zone: "Zona 3" },
    { day: "Ter", esr: 5, zone: "Zona 4" },
    { day: "Qua", esr: 8, zone: "Zona 2" },
    { day: "Qui", esr: 6, zone: "Zona 3" },
    { day: "Sex", esr: 4, zone: "Zona 4" },
    { day: "Sáb", esr: 9, zone: "Zona 1" },
    { day: "Dom", esr: 10, zone: "Descanso" },
  ]

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Histórico</Text>
        <Text style={styles.subtitle}>Acompanhe sua evolução semanal</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <ChartIcon color={colors.primary} size={24} />
            <Text style={styles.cardTitle}>ESR Semanal</Text>
          </View>

          <View style={styles.chart}>
            {weekData.map((item, index) => (
              <View key={index} style={styles.chartBar}>
                <View style={[styles.bar, { height: `${item.esr * 10}%`, backgroundColor: colors.primary }]} />
                <Text style={styles.barLabel}>{item.day}</Text>
                <Text style={styles.barValue}>{item.esr}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Zonas de Treinamento</Text>
          <View style={styles.zonesList}>
            {weekData
              .filter((d) => d.zone !== "Descanso")
              .map((item, index) => (
                <View key={index} style={styles.zoneItem}>
                  <Text style={styles.zoneDay}>{item.day}</Text>
                  <View style={[styles.zoneBadge, { backgroundColor: colors.primary }]}>
                    <Text style={styles.zoneText}>{item.zone}</Text>
                  </View>
                </View>
              ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Estatísticas</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>6.7</Text>
              <Text style={styles.statLabel}>ESR Médio</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>5</Text>
              <Text style={styles.statLabel}>Treinos</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>3.5h</Text>
              <Text style={styles.statLabel}>Tempo Total</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 16,
  },
  chart: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 200,
    paddingTop: 20,
  },
  chartBar: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  bar: {
    width: "70%",
    borderRadius: 4,
    minHeight: 20,
  },
  barLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 8,
  },
  barValue: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginTop: 4,
  },
  zonesList: {
    gap: 12,
  },
  zoneItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  zoneDay: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
  },
  zoneBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  zoneText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.surface,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  statItem: {
    flex: 1,
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: "center",
  },
})
