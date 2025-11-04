import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { colors } from "../theme/colors"
import { ListIcon, ClockIcon } from "../components/Icons"

export default function SessionsList({ navigation }) {
  const sessions = [
    {
      id: 1,
      name: "Treino de Força",
      date: "2025-01-20",
      time: "14:00",
      zone: "Zona 4 - Anaeróbica",
      status: "Concluído",
    },
    {
      id: 2,
      name: "Treino Aeróbico",
      date: "2025-01-22",
      time: "09:00",
      zone: "Zona 2 - Aeróbica",
      status: "Agendado",
    },
    {
      id: 3,
      name: "Recuperação Ativa",
      date: "2025-01-23",
      time: "16:00",
      zone: "Zona 1 - Recuperação",
      status: "Agendado",
    },
  ]

  const getZoneColor = (zone) => {
    if (zone.includes("Zona 1")) return colors.zone1
    if (zone.includes("Zona 2")) return colors.zone2
    if (zone.includes("Zona 3")) return colors.zone3
    if (zone.includes("Zona 4")) return colors.zone4
    if (zone.includes("Zona 5")) return colors.zone5
    return colors.neutral
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Minhas Sessões</Text>
        <Text style={styles.subtitle}>Histórico de treinos e próximas sessões</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {sessions.map((session) => (
          <TouchableOpacity
            key={session.id}
            style={styles.sessionCard}
            onPress={() => navigation.navigate("SessionDetail", { sessionId: session.id })}
          >
            <View style={styles.sessionHeader}>
              <View style={styles.sessionIcon}>
                <ListIcon color={colors.primary} size={24} />
              </View>
              <View style={styles.sessionInfo}>
                <Text style={styles.sessionName}>{session.name}</Text>
                <View style={styles.sessionMeta}>
                  <ClockIcon color={colors.textSecondary} size={14} />
                  <Text style={styles.sessionDate}>
                    {session.date} às {session.time}
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: session.status === "Concluído" ? colors.success : colors.warning },
                ]}
              >
                <Text style={styles.statusText}>{session.status}</Text>
              </View>
            </View>
            <View style={[styles.zoneBadge, { backgroundColor: getZoneColor(session.zone) }]}>
              <Text style={styles.zoneText}>{session.zone}</Text>
            </View>
          </TouchableOpacity>
        ))}
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
  scrollView: {
    flex: 1,
    padding: 16,
  },
  sessionCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sessionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sessionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  sessionMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  sessionDate: {
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.surface,
  },
  zoneBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  zoneText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.surface,
  },
})
