import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { colors } from "../theme/colors"
import { UserIcon } from "../components/Icons"

export default function MessagesInbox() {
  const messages = [
    { id: 1, from: "Treinador Carlos", message: "Ótimo treino hoje! Continue assim.", time: "10:30", unread: true },
    { id: 2, from: "Sistema", message: "Lembre-se de registrar seu ESR após o treino.", time: "Ontem", unread: false },
    {
      id: 3,
      from: "Treinador Carlos",
      message: "Vamos ajustar a carga na próxima sessão.",
      time: "2 dias",
      unread: false,
    },
  ]

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mensagens</Text>
        <Text style={styles.subtitle}>Comunicação com seu treinador</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {messages.map((msg) => (
          <TouchableOpacity key={msg.id} style={[styles.messageCard, msg.unread && styles.unread]}>
            <View style={styles.messageIcon}>
              <UserIcon color={colors.primary} size={24} />
            </View>
            <View style={styles.messageContent}>
              <View style={styles.messageHeader}>
                <Text style={styles.messageSender}>{msg.from}</Text>
                <Text style={styles.messageTime}>{msg.time}</Text>
              </View>
              <Text style={styles.messageText} numberOfLines={2}>
                {msg.message}
              </Text>
            </View>
            {msg.unread && <View style={styles.unreadDot} />}
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
  content: {
    flex: 1,
    padding: 16,
  },
  messageCard: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
  },
  unread: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  messageIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  messageSender: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  messageTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  messageText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    marginLeft: 8,
  },
})
