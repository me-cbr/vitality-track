"use client"

import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from "react-native"
import { useEffect, useState } from "react"
import { colors, spacing, borderRadius, shadows } from "../theme/colors"
import { FeedbackIcon, CheckCircleIcon, SendIcon } from "../components/Icons"
import { useFeedback } from "../contexts/FeedbackContext"
import { useAuth } from "../contexts/AuthContext"

export default function Feedbacks({ navigation }) {
  const { feedbacks, loading, error, fetchFeedbacks, markAsRead } = useFeedback()
  const { user } = useAuth()
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchFeedbacks()
  }, [])

  const onRefresh = async () => {
    setRefreshing(true)
    await fetchFeedbacks()
    setRefreshing(false)
  }

  const displayFeedbacks =
    user?.tipo_usuario === "treinador" ? feedbacks : feedbacks.filter((f) => f.atleta_id === user?.atleta_id)

  const readFeedbacks = displayFeedbacks.filter((f) => f.lido)
  const unreadFeedbacks = displayFeedbacks.filter((f) => !f.lido)

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

    if (diffHours < 1) return "Agora"
    if (diffHours < 24) return `${diffHours}h atrás`
    if (diffHours < 48) return "Ontem"
    return `${Math.floor(diffHours / 24)} dias atrás`
  }

  if (loading && feedbacks.length === 0) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Carregando feedbacks...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Feedbacks</Text>
        <Text style={styles.subtitle}>
          {user?.tipo_usuario === "treinador" ? "Comunicação com atletas" : "Mensagens do treinador"}
        </Text>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
      >
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Erro ao carregar feedbacks</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchFeedbacks}>
              <Text style={styles.retryButtonText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        )}

        {unreadFeedbacks.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Novos ({unreadFeedbacks.length})</Text>
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>●</Text>
              </View>
            </View>
            {unreadFeedbacks.map((feedback) => (
              <TouchableOpacity
                key={feedback.id}
                style={[styles.feedbackCard, styles.unreadCard, shadows.sm]}
                onPress={() => markAsRead(feedback.id)}
                activeOpacity={0.85}
              >
                <View style={styles.feedbackHeader}>
                  <View style={[styles.feedbackIcon, { backgroundColor: colors.primary + "20" }]}>
                    <SendIcon color={colors.primary} size={18} />
                  </View>
                  <View style={styles.feedbackInfo}>
                    <Text style={styles.feedbackType}>
                      {feedback.tipo_mensagem === "elogio"
                        ? "Elogio"
                        : feedback.tipo_mensagem === "orientacao"
                          ? "Orientação"
                          : feedback.tipo_mensagem === "alerta"
                            ? "Alerta"
                            : "Planejamento"}
                    </Text>
                  </View>
                  <Text style={styles.feedbackTime}>{formatDate(feedback.data)}</Text>
                </View>

                <Text style={styles.feedbackMessage}>{feedback.mensagem}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {readFeedbacks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Histórico</Text>
            {readFeedbacks.map((feedback) => (
              <TouchableOpacity
                key={feedback.id}
                style={[styles.feedbackCard, styles.readCard, shadows.sm]}
                activeOpacity={0.85}
              >
                <View style={styles.feedbackHeader}>
                  <View style={[styles.feedbackIcon, { backgroundColor: colors.success + "20" }]}>
                    <CheckCircleIcon color={colors.success} size={18} />
                  </View>
                  <View style={styles.feedbackInfo}>
                    <Text style={styles.feedbackType}>
                      {feedback.tipo_mensagem === "elogio"
                        ? "Elogio"
                        : feedback.tipo_mensagem === "orientacao"
                          ? "Orientação"
                          : feedback.tipo_mensagem === "alerta"
                            ? "Alerta"
                            : "Planejamento"}
                    </Text>
                  </View>
                  <Text style={styles.feedbackTime}>{formatDate(feedback.data)}</Text>
                </View>

                <Text style={styles.feedbackMessage}>{feedback.mensagem}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {displayFeedbacks.length === 0 && !error && (
          <View style={styles.emptyState}>
            <FeedbackIcon color={colors.textTertiary} size={56} />
            <Text style={styles.emptyText}>Nenhum feedback ainda</Text>
            <Text style={styles.emptySubtext}>
              {user?.tipo_usuario === "treinador"
                ? "Os feedbacks dos atletas aparecerão aqui"
                : "Você receberá feedbacks do seu treinador aqui"}
            </Text>
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
  content: {
    flex: 1,
  },
  section: {
    padding: spacing.lg,
    paddingBottom: spacing.md,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  unreadBadge: {
    width: 20,
    height: 20,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  unreadBadgeText: {
    fontSize: 12,
    color: colors.white,
    fontWeight: "700",
  },
  feedbackCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  unreadCard: {
    borderColor: colors.primary,
    borderWidth: 2,
    backgroundColor: colors.primary + "08",
  },
  readCard: {
    opacity: 0.75,
  },
  feedbackHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  feedbackIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  feedbackInfo: {
    flex: 1,
  },
  senderName: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  feedbackType: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  feedbackTime: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  feedbackMessage: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 20,
    marginBottom: spacing.md,
    fontWeight: "500",
  },
  feedbackFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  esrBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  esrText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.white,
  },
  errorContainer: {
    padding: spacing.xl,
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: colors.danger,
    marginBottom: spacing.md,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  retryButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xxl * 3,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.xs,
    marginTop: spacing.md,
  },
  emptySubtext: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: "center",
    maxWidth: 280,
  },
})
