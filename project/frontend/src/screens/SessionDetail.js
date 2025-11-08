"use client"

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native"
import { useState, useEffect } from "react"
import { colors, spacing, borderRadius, shadows } from "../theme/colors"
import { ArrowLeftIcon, HeartIcon, ClockIcon, ActivityIcon, CheckCircleIcon, XIcon } from "../components/Icons"
import { trainingService } from "../services/trainingService"
import { useFeedback } from "../contexts/FeedbackContext"
import { useAuth } from "../contexts/AuthContext"
import { getZoneColorByNumber } from "../utils/zoneUtils"

export default function SessionDetail({ navigation, route }) {
  const { sessionId } = route.params || {}
  const { user } = useAuth()
  const { addFeedback } = useFeedback()

  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [feedbackText, setFeedbackText] = useState("")
  const [esrValue, setEsrValue] = useState(5)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadSession()
  }, [sessionId])

  const loadSession = async () => {
    try {
      setLoading(true)
      const data = await trainingService.getSessionById(sessionId)
      setSession(data)
    } catch (error) {
      console.error(" Error loading session:", error)
      Alert.alert("Erro", "Não foi possível carregar os detalhes da sessão")
    } finally {
      setLoading(false)
    }
  }

  const handleFinishSession = () => {
    if (session?.status === "concluido") {
      Alert.alert("Atenção", "Esta sessão já foi concluída")
      return
    }
    setShowFeedbackModal(true)
  }

  const handleSubmitFeedback = async () => {
    if (!feedbackText.trim()) {
      Alert.alert("Atenção", "Por favor, escreva um feedback sobre o treino")
      return
    }

    try {
      setSubmitting(true)

      await trainingService.completeSession(sessionId)

      await addFeedback({
        mensagem: feedbackText,
        atleta_id: user.id,
        atleta_nome: user.name,
        treinador_id: user.treinador_id || 2,
        esr_valor: esrValue,
        sessao_id: sessionId,
      })

      Alert.alert("Sucesso", "Treino finalizado e feedback enviado ao treinador!", [
        {
          text: "OK",
          onPress: () => {
            setShowFeedbackModal(false)
            navigation.goBack()
          },
        },
      ])
    } catch (error) {
      console.error(" Error submitting feedback:", error)
      Alert.alert("Erro", "Não foi possível enviar o feedback. Tente novamente.")
    } finally {
      setSubmitting(false)
    }
  }

  const getZoneColor = (zone) => {
    return getZoneColorByNumber(zone)
  }

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  if (!session) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Sessão não encontrada</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeftIcon color={colors.text} size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Detalhes da Sessão</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          {/* Session Title */}
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.sessionTitle}>{session.nome || "Treino"}</Text>
              <Text style={styles.sessionDate}>
                {session.data} - {session.hora}
              </Text>
            </View>
            {session.status === "concluido" && (
              <View style={styles.completedBadge}>
                <CheckCircleIcon color={colors.success} size={20} />
                <Text style={styles.completedText}>Concluído</Text>
              </View>
            )}
          </View>

          <View style={styles.divider} />

          {/* Metrics */}
          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <HeartIcon color={colors.primary} size={24} />
              <Text style={styles.metricValue}>{session.fc_media || "145"} bpm</Text>
              <Text style={styles.metricLabel}>FC Média</Text>
            </View>
            <View style={styles.metricCard}>
              <ClockIcon color={colors.primary} size={24} />
              <Text style={styles.metricValue}>{session.duracao || "45"} min</Text>
              <Text style={styles.metricLabel}>Duração</Text>
            </View>
            <View style={styles.metricCard}>
              <ActivityIcon color={colors.primary} size={24} />
              <Text style={styles.metricValue}>{session.intensidade || "Alta"}</Text>
              <Text style={styles.metricLabel}>Intensidade</Text>
            </View>
          </View>

          {/* Zone Badge */}
          <View style={[styles.zoneBadge, { backgroundColor: getZoneColor(session.zona_alvo) }]}>
            <Text style={styles.zoneText}>{session.zona_alvo || "Zona 4 - Anaeróbica"}</Text>
          </View>

          <View style={styles.divider} />

          {/* Description */}
          {session.descricao && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Descrição</Text>
              <Text style={styles.sectionText}>{session.descricao}</Text>
            </View>
          )}

          {/* Exercises */}
          {session.exercicios && session.exercicios.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Exercícios</Text>
              {session.exercicios.map((ex, index) => (
                <View key={index} style={styles.exerciseItem}>
                  <Text style={styles.exerciseName}>{ex.nome}</Text>
                  <Text style={styles.exerciseDetails}>
                    {ex.series && `${ex.series}x${ex.repeticoes}`}
                    {ex.carga && ` - ${ex.carga}kg`}
                    {ex.duracao && `${ex.duracao} min`}
                    {ex.ritmo && ` - ${ex.ritmo}`}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Coach Notes */}
          {session.observacoes && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Observações do Treinador</Text>
              <Text style={styles.sectionText}>{session.observacoes}</Text>
            </View>
          )}
        </View>

        {session.status !== "concluido" && (
          <TouchableOpacity
            style={[styles.finishButton, shadows.md]}
            onPress={handleFinishSession}
            activeOpacity={0.85}
          >
            <CheckCircleIcon color={colors.white} size={24} />
            <Text style={styles.finishButtonText}>FINALIZAR TREINO</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <Modal visible={showFeedbackModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Finalizar Treino</Text>
              <TouchableOpacity onPress={() => setShowFeedbackModal(false)} disabled={submitting}>
                <XIcon color={colors.text} size={24} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalLabel}>Como você se sente após o treino? (ESR)</Text>
            <View style={styles.esrSliderContainer}>
              <View style={styles.esrLabels}>
                <Text style={styles.esrLabelText}>Péssimo</Text>
                <Text style={styles.esrLabelText}>Ótimo</Text>
              </View>
              <View style={styles.esrValueDisplay}>
                <Text style={styles.esrValueText}>{esrValue}</Text>
              </View>
              <View style={styles.esrButtons}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => (
                  <TouchableOpacity
                    key={val}
                    style={[styles.esrButton, esrValue === val && styles.esrButtonActive]}
                    onPress={() => setEsrValue(val)}
                  >
                    <Text style={[styles.esrButtonText, esrValue === val && styles.esrButtonTextActive]}>{val}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <Text style={styles.modalLabel}>Feedback para o treinador</Text>
            <TextInput
              style={styles.feedbackInput}
              placeholder="Como foi o treino? Alguma dificuldade ou observação?"
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={4}
              value={feedbackText}
              onChangeText={setFeedbackText}
              editable={!submitting}
            />

            <TouchableOpacity
              style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
              onPress={handleSubmitFeedback}
              disabled={submitting}
              activeOpacity={0.85}
            >
              {submitting ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.submitButtonText}>ENVIAR FEEDBACK</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingTop: 60,
    paddingBottom: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: spacing.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  sessionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  sessionDate: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  completedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: colors.successLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  completedText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.success,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.lg,
  },
  metricsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  metricCard: {
    flex: 1,
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: "center",
  },
  metricValue: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    marginTop: spacing.sm,
  },
  metricLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  zoneBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignSelf: "flex-start",
  },
  zoneText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.white,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.sm,
  },
  sectionText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  exerciseItem: {
    backgroundColor: colors.neutralBg,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  exerciseName: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  exerciseDetails: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  finishButton: {
    backgroundColor: colors.success,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.xl,
  },
  finishButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.white,
    letterSpacing: 0.5,
  },
  errorText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  backBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  backBtnText: {
    color: colors.white,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.xl,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.md,
    marginTop: spacing.md,
  },
  esrSliderContainer: {
    marginBottom: spacing.lg,
  },
  esrLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  esrLabelText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  esrValueDisplay: {
    alignItems: "center",
    marginBottom: spacing.md,
  },
  esrValueText: {
    fontSize: 48,
    fontWeight: "800",
    color: colors.primary,
  },
  esrButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    justifyContent: "center",
  },
  esrButton: {
    width: 50,
    height: 50,
    borderRadius: borderRadius.md,
    backgroundColor: colors.neutralBg,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.border,
  },
  esrButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  esrButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textSecondary,
  },
  esrButtonTextActive: {
    color: colors.white,
  },
  feedbackInput: {
    backgroundColor: colors.neutralBg,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: 15,
    color: colors.text,
    minHeight: 120,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: colors.border,
  },
  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: "center",
    marginTop: spacing.lg,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.white,
    letterSpacing: 0.5,
  },
})
