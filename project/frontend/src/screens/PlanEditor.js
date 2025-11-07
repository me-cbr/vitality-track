"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert } from "react-native"
import { colors, spacing, borderRadius, shadows } from "../theme/colors"
import { ArrowLeftIcon, SaveIcon } from "../components/Icons"
import { trainingService } from "../services/trainingService"

export default function PlanEditor({ navigation, route }) {
  const { athleteId, planId, mode = "edit" } = route.params || {}
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  // Plan data
  const [planName, setPlanName] = useState("")
  const [description, setDescription] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [sessions, setSessions] = useState([])

  // Session form (for createSession mode)
  const [sessionName, setSessionName] = useState("")
  const [sessionZone, setSessionZone] = useState("3")
  const [sessionType, setSessionType] = useState("Força")
  const [sessionIntensity, setSessionIntensity] = useState("Moderada")
  const [sessionDuration, setSessionDuration] = useState("45")
  const [sessionDate, setSessionDate] = useState("")
  const [sessionTime, setSessionTime] = useState("14:00")

  useEffect(() => {
    if (mode === "edit" && planId) {
      loadPlanData()
    } else if (mode === "create") {
      // Initialize with default values for new plan
      const today = new Date()
      const nextMonth = new Date(today)
      nextMonth.setMonth(nextMonth.getMonth() + 1)

      setStartDate(today.toISOString().split("T")[0])
      setEndDate(nextMonth.toISOString().split("T")[0])
    } else if (mode === "createSession") {
      // Initialize with default values for new session
      const today = new Date()
      setSessionDate(today.toISOString().split("T")[0])
    }
  }, [planId, mode])

  const loadPlanData = async () => {
    try {
      setLoading(true)
      const plan = await trainingService.getTrainingPlanById(planId)
      if (plan) {
        setPlanName(plan.nome)
        setDescription(plan.descricao || "")
        setStartDate(plan.data_inicio)
        setEndDate(plan.data_fim)
        setSessions(plan.sessoes || [])
      }
    } catch (error) {
      console.error(" Error loading plan:", error)
      Alert.alert("Erro", "Não foi possível carregar o plano")
    } finally {
      setLoading(false)
    }
  }

  const handleSavePlan = async () => {
    if (!planName.trim()) {
      Alert.alert("Atenção", "Por favor, insira um nome para o plano")
      return
    }

    try {
      setSaving(true)
      const planData = {
        nome: planName,
        descricao: description,
        data_inicio: startDate,
        data_fim: endDate,
        atleta_id: athleteId,
        sessoes: sessions,
      }

      if (mode === "edit" && planId) {
        await trainingService.updateTrainingPlan(planId, planData)
        Alert.alert("Sucesso", "Plano atualizado com sucesso!")
      } else {
        await trainingService.createTrainingPlan(planData)
        Alert.alert("Sucesso", "Plano criado com sucesso!")
      }

      navigation.goBack()
    } catch (error) {
      console.error(" Error saving plan:", error)
      Alert.alert("Erro", "Não foi possível salvar o plano")
    } finally {
      setSaving(false)
    }
  }

  const handleCreateSession = async () => {
    if (!sessionName.trim()) {
      Alert.alert("Atenção", "Por favor, insira um nome para a sessão")
      return
    }

    try {
      setSaving(true)
      const sessionData = {
        nome: sessionName,
        zona_alvo: `Zona ${sessionZone}`,
        tipo: sessionType,
        intensidade: sessionIntensity,
        duracao: Number.parseInt(sessionDuration),
        data: sessionDate,
        hora: sessionTime,
        atleta_id: athleteId,
        status: "agendado",
      }

      await trainingService.createSession(sessionData)
      Alert.alert("Sucesso", "Sessão criada com sucesso!")
      navigation.goBack()
    } catch (error) {
      console.error(" Error creating session:", error)
      Alert.alert("Erro", "Não foi possível criar a sessão")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    )
  }

  // Render session creation form
  if (mode === "createSession") {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ArrowLeftIcon color={colors.text} size={24} />
          </TouchableOpacity>
          <Text style={styles.title}>Nova Sessão de Treino</Text>
          <TouchableOpacity
            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
            onPress={handleCreateSession}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <SaveIcon color={colors.white} size={20} />
            )}
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={[styles.card, shadows.sm]}>
            <Text style={styles.label}>Nome da Sessão *</Text>
            <TextInput
              style={styles.input}
              value={sessionName}
              onChangeText={setSessionName}
              placeholder="Ex: Treino de Força Superior"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={[styles.card, shadows.sm]}>
            <Text style={styles.label}>Zona de Treinamento</Text>
            <View style={styles.zoneSelector}>
              {["1", "2", "3", "4", "5"].map((zone) => (
                <TouchableOpacity
                  key={zone}
                  style={[styles.zoneButton, sessionZone === zone && styles.zoneButtonActive]}
                  onPress={() => setSessionZone(zone)}
                >
                  <Text style={[styles.zoneButtonText, sessionZone === zone && styles.zoneButtonTextActive]}>
                    Z{zone}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={[styles.card, shadows.sm]}>
            <Text style={styles.label}>Tipo de Treino</Text>
            <TextInput
              style={styles.input}
              value={sessionType}
              onChangeText={setSessionType}
              placeholder="Ex: Força, Cardio, HIIT"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={[styles.card, shadows.sm]}>
            <Text style={styles.label}>Intensidade</Text>
            <View style={styles.intensitySelector}>
              {["Leve", "Moderada", "Alta", "Muito Alta"].map((intensity) => (
                <TouchableOpacity
                  key={intensity}
                  style={[styles.intensityButton, sessionIntensity === intensity && styles.intensityButtonActive]}
                  onPress={() => setSessionIntensity(intensity)}
                >
                  <Text
                    style={[
                      styles.intensityButtonText,
                      sessionIntensity === intensity && styles.intensityButtonTextActive,
                    ]}
                  >
                    {intensity}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={[styles.card, shadows.sm]}>
            <Text style={styles.label}>Duração (minutos)</Text>
            <TextInput
              style={styles.input}
              value={sessionDuration}
              onChangeText={setSessionDuration}
              placeholder="45"
              keyboardType="numeric"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={[styles.card, shadows.sm]}>
            <Text style={styles.label}>Data</Text>
            <TextInput
              style={styles.input}
              value={sessionDate}
              onChangeText={setSessionDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={[styles.card, shadows.sm]}>
            <Text style={styles.label}>Horário</Text>
            <TextInput
              style={styles.input}
              value={sessionTime}
              onChangeText={setSessionTime}
              placeholder="14:00"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
        </ScrollView>
      </View>
    )
  }

  // Render plan editor form
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeftIcon color={colors.text} size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>{mode === "edit" ? "Editar Plano" : "Novo Plano"}</Text>
        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSavePlan}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <SaveIcon color={colors.white} size={20} />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, shadows.sm]}>
          <Text style={styles.label}>Nome do Plano *</Text>
          <TextInput
            style={styles.input}
            value={planName}
            onChangeText={setPlanName}
            placeholder="Ex: Plano de Força - Janeiro"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View style={[styles.card, shadows.sm]}>
          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Descreva os objetivos do plano"
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={[styles.card, shadows.sm]}>
          <Text style={styles.label}>Data de Início</Text>
          <TextInput
            style={styles.input}
            value={startDate}
            onChangeText={setStartDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View style={[styles.card, shadows.sm]}>
          <Text style={styles.label}>Data de Término</Text>
          <TextInput
            style={styles.input}
            value={endDate}
            onChangeText={setEndDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View style={[styles.card, shadows.sm]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Sessões de Treino</Text>
            <Text style={styles.sessionCount}>{sessions.length} sessões</Text>
          </View>

          {sessions.length === 0 ? (
            <View style={styles.emptySessions}>
              <Text style={styles.emptySessionsText}>Nenhuma sessão adicionada</Text>
              <Text style={styles.emptySessionsSubtext}>As sessões do plano aparecerão aqui</Text>
            </View>
          ) : (
            <View style={styles.sessionsList}>
              {sessions.map((session, index) => (
                <View key={session.id || index} style={styles.sessionItem}>
                  <View style={styles.sessionInfo}>
                    <Text style={styles.sessionName}>{session.nome || session.title}</Text>
                    <Text style={styles.sessionZone}>{session.zona_alvo || `Zona ${session.zone}`}</Text>
                    <Text style={styles.sessionMeta}>
                      {session.tipo} • {session.duracao}min
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.sessionZoneBadge,
                      { backgroundColor: colors[`zone${session.zone || 3}`] || colors.primary },
                    ]}
                  >
                    <Text style={styles.sessionZoneBadgeText}>Z{session.zone || 3}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
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
  saveButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    minWidth: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.neutralBg,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: 15,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  sessionCount: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  emptySessions: {
    alignItems: "center",
    paddingVertical: spacing.xl,
  },
  emptySessionsText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  emptySessionsSubtext: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  sessionsList: {
    gap: spacing.sm,
  },
  sessionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.md,
    backgroundColor: colors.neutralBg,
    borderRadius: borderRadius.md,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionName: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  sessionZone: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    fontWeight: "500",
  },
  sessionMeta: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  sessionZoneBadge: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  sessionZoneBadgeText: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.white,
  },
  zoneSelector: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  zoneButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.neutralBg,
    borderWidth: 2,
    borderColor: colors.divider,
    alignItems: "center",
  },
  zoneButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  zoneButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textSecondary,
  },
  zoneButtonTextActive: {
    color: colors.white,
  },
  intensitySelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  intensityButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.neutralBg,
    borderWidth: 2,
    borderColor: colors.divider,
  },
  intensityButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  intensityButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  intensityButtonTextActive: {
    color: colors.white,
  },
})
