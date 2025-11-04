import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { colors } from "../theme/colors"
import { ArrowLeftIcon, UserIcon, ActivityIcon } from "../components/Icons"

export default function AthleteDetailTreinador({ navigation, route }) {
  const { athleteId } = route.params || {}

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
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <UserIcon color={colors.primary} size={48} />
          </View>
          <Text style={styles.name}>João Silva</Text>
          <Text style={styles.email}>joao.silva@email.com</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Dados Físicos</Text>
          <View style={styles.dataGrid}>
            <View style={styles.dataItem}>
              <Text style={styles.dataLabel}>Peso</Text>
              <Text style={styles.dataValue}>75 kg</Text>
            </View>
            <View style={styles.dataItem}>
              <Text style={styles.dataLabel}>Altura</Text>
              <Text style={styles.dataValue}>1.78 m</Text>
            </View>
            <View style={styles.dataItem}>
              <Text style={styles.dataLabel}>Idade</Text>
              <Text style={styles.dataValue}>28 anos</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Última Avaliação ESR</Text>
          <View style={styles.esrCard}>
            <ActivityIcon color={colors.primary} size={32} />
            <View style={styles.esrInfo}>
              <Text style={styles.esrValue}>7/10</Text>
              <Text style={styles.esrLabel}>Recuperação Boa</Text>
            </View>
          </View>
        </View>

        <View style={styles.actionsCard}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("PlanEditor", { athleteId })}
          >
            <Text style={styles.actionButtonText}>Editar Plano de Treino</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={() => navigation.navigate("Assessment", { athleteId })}
          >
            <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>Nova Avaliação</Text>
          </TouchableOpacity>
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
  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 16,
  },
  dataGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  dataItem: {
    flex: 1,
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  dataLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  dataValue: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },
  esrCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    gap: 16,
  },
  esrInfo: {
    flex: 1,
  },
  esrValue: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.primary,
  },
  esrLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  actionsCard: {
    gap: 12,
    marginBottom: 32,
  },
  actionButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.surface,
  },
  secondaryButton: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  secondaryButtonText: {
    color: colors.primary,
  },
})
