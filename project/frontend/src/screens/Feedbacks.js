"use client"

import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from "react-native"
import { useEffect, useState } from "react"
import { colors, spacing, borderRadius } from "../theme/colors"
import { FeedbackIcon, CheckCircleIcon } from "../components/Icons"
import { useFeedback } from "../contexts/FeedbackContext"
import { useAuth } from "../contexts/AuthContext"

export default function Feedbacks() {
  const { feedbacks, loading, error, fetchFeedbacks, markAsRead, getFeedbacksByAthlete } = useFeedback()
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

  const displayFeedbacks = user?.type === "coach" ? feedbacks : getFeedbacksByAthlete(user?.email)

  const getESRColor = (value) => {
    if (value <= 3) return colors.danger
    if (value <= 6) return colors.warning
    return colors.success
  }

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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Feedbacks</Text>
        <Text style={styles.subtitle}>
          {user?.type === "coach" ? "Feedbacks dos atletas" : "Seus feedbacks enviados"}
        </Text>
      </View>

      {loading && feedbacks.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Carregando feedbacks...</Text>
        </View>
      ) : (
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

          {!error && displayFeedbacks.length === 0 ? (
            <View style={styles.emptyState}>
              <FeedbackIcon color={colors.textTertiary} size={48} />
              <Text style={styles.emptyText}>Nenhum feedback ainda</Text>
              <Text style={styles.emptySubtext}>
                {user?.type === "coach"
                  ? "Os feedbacks dos atletas aparecerão aqui"
                  : "Envie seu primeiro feedback para o treinador"}
              </Text>
            </View>
          ) : (
            displayFeedbacks.map((feedback) => (
              <TouchableOpacity
                key={feedback.id}
                style={[styles.feedbackCard, !feedback.read && styles.unread]}
                onPress={() => markAsRead(feedback.id)}
              >
                <View style={styles.feedbackHeader}>
                  <View style={styles.feedbackIcon}>
                    <FeedbackIcon color={colors.primary} size={20} />
                  </View>
                  <View style={styles.feedbackInfo}>
                    {user?.type === "coach" && <Text style={styles.athleteName}>{feedback.athleteName}</Text>}
                    <Text style={styles.feedbackType}>
                      {feedback.type === "daily"
                        ? "Diário"
                        : feedback.type === "pre-training"
                          ? "Pré-treino"
                          : "Pós-treino"}
                    </Text>
                  </View>
                  <View style={styles.feedbackMeta}>
                    <Text style={styles.feedbackTime}>{formatDate(feedback.date)}</Text>
                    {!feedback.read && <View style={styles.unreadDot} />}
                  </View>
                </View>

                <Text style={styles.feedbackMessage}>{feedback.message}</Text>

                <View style={styles.feedbackFooter}>
                  <View style={styles.esrBadge}>
                    <View style={[styles.esrIndicator, { backgroundColor: getESRColor(feedback.esrValue) }]} />
                    <Text style={styles.esrText}>ESR: {feedback.esrValue}/10</Text>
                  </View>
                  {feedback.read && <CheckCircleIcon color={colors.success} size={16} />}
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: 14,
    color: colors.textSecondary,
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
  content: {
    flex: 1,
    padding: spacing.md,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xxl * 2,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: spacing.md,
    fontWeight: "600",
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textTertiary,
    marginTop: spacing.xs,
    textAlign: "center",
  },
  feedbackCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.border,
  },
  unread: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  feedbackHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  feedbackIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.sm,
  },
  feedbackInfo: {
    flex: 1,
  },
  athleteName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 2,
  },
  feedbackType: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  feedbackMeta: {
    alignItems: "flex-end",
  },
  feedbackTime: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  feedbackMessage: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  feedbackFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  esrBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.neutralBg,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: borderRadius.sm,
  },
  esrIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  esrText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.text,
  },
})
