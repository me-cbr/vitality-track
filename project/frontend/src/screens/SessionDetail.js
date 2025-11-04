import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { colors } from "../theme/colors"
import { ArrowLeftIcon, HeartIcon, ClockIcon, ActivityIcon } from "../components/Icons"

export default function SessionDetail({ navigation, route }) {
  const { sessionId } = route.params || {}

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeftIcon color={colors.text} size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Detalhes da Sessão</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.sessionTitle}>Treino de Força</Text>
          <Text style={styles.sessionDate}>20 de Janeiro, 2025 - 14:00</Text>

          <View style={styles.divider} />

          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <HeartIcon color={colors.primary} size={24} />
              <Text style={styles.metricValue}>145 bpm</Text>
              <Text style={styles.metricLabel}>FC Média</Text>
            </View>
            <View style={styles.metricCard}>
              <ClockIcon color={colors.primary} size={24} />
              <Text style={styles.metricValue}>45 min</Text>
              <Text style={styles.metricLabel}>Duração</Text>
            </View>
            <View style={styles.metricCard}>
              <ActivityIcon color={colors.primary} size={24} />
              <Text style={styles.metricValue}>Zona 4</Text>
              <Text style={styles.metricLabel}>Intensidade</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Descrição</Text>
            <Text style={styles.sectionText}>
              Treino focado em desenvolvimento de força muscular com exercícios compostos. Inclui agachamento, supino e
              levantamento terra.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Observações do Treinador</Text>
            <Text style={styles.sectionText}>
              Excelente execução dos movimentos. Manter a progressão de carga nas próximas sessões.
            </Text>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sessionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 4,
  },
  sessionDate: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 20,
  },
  metricsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  metricCard: {
    flex: 1,
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  metricValue: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    marginTop: 8,
  },
  metricLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
})
