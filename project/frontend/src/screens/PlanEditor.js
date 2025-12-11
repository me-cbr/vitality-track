"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert } from "react-native"
import { colors, spacing, borderRadius, shadows } from "../theme/colors"
import { ArrowLeftIcon, SaveIcon } from "../components/Icons"
import { trainingService } from "../services/trainingService"

export default function PlanEditor({ navigation, route }) {
  const { athleteId, sessionId, mode = "createSession" } = route.params || {}
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  // Session form for creating/editing individual SessaoTreinamento
  const [sessionName, setSessionName] = useState("")
  const [sessionZone, setSessionZone] = useState("3")
  const [sessionType, setSessionType] = useState("Força")
  const [sessionIntensity, setSessionIntensity] = useState("Moderada")
  const [sessionDuration, setSessionDuration] = useState("45")
  const [sessionDate, setSessionDate] = useState("")
  const [sessionTime, setSessionTime] = useState("14:00")

  useEffect(() => {
    if (mode === "edit" && sessionId) {
      loadSessionData()
    } else if (mode === "createSession") {
      const today = new Date()
      setSessionDate(today.toISOString().split("T")[0])
    }
  }, [sessionId, mode])

  const loadSessionData = async () => {
    try {
      setLoading(true)
      const session = await trainingService.getSessionById(sessionId)
      if (session) {
        setSessionName(session.name || session.title)
        setSessionType(session.training_type)
        setSessionIntensity(session.intensity)
        setSessionDuration(String(session.duration))
        setSessionDate(session.date?.split("T")[0] || "")
        setSessionTime(session.time || session.date?.split("T")[1]?.slice(0, 5) || "14:00")
        setSessionZone(String(session.target_zone || 3))
      }
    } catch (error) {
      console.error("Error loading session:", error)
      Alert.alert("Erro", "Não foi possível carregar a sessão")
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSession = async () => {
    if (!sessionName.trim()) {
      Alert.alert("Atenção", "Por favor, insira um nome para a sessão")
      return
    }

    try {
      setSaving(true)
      const sessionData = {
        target_zone: `Zona ${sessionZone}`,
        training_type: sessionType,
        intensity: sessionIntensity,
        duration: Number.parseInt(sessionDuration),
        date: sessionDate,
        time: sessionTime,
        athlete_id: athleteId,
      }

      if (mode === "edit" && sessionId) {
        await trainingService.updateSession(sessionId, sessionData)
        Alert.alert("Sucesso", "Sessão atualizada com sucesso!")
      } else {
        await trainingService.createSession(sessionData)
        Alert.alert("Sucesso", "Sessão criada com sucesso!")
      }

      navigation.goBack()
    } catch (error) {
      console.error("Error saving session:", error)
      Alert.alert("Erro", "Não foi possível salvar a sessão")
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

  // Sessions are the core training unit that athletes see
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeftIcon color={colors.text} size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>{mode === "edit" ? "Editar Sessão" : "Nova Sessão de Treino"}</Text>
        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSaveSession}
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
          <Text style={styles.label}>Zona de Treinamento *</Text>
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
          <Text style={styles.helperText}>Selecione a zona de treinamento alvo para este treino</Text>
        </View>

        <View style={[styles.card, shadows.sm]}>
          <Text style={styles.label}>Tipo de Treino *</Text>
          <TextInput
            style={styles.input}
            value={sessionType}
            onChangeText={setSessionType}
            placeholder="Ex: Força, Cardio, HIIT, Mobilidade"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View style={[styles.card, shadows.sm]}>
          <Text style={styles.label}>Intensidade *</Text>
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
          <Text style={styles.label}>Duração (minutos) *</Text>
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
          <Text style={styles.label}>Data *</Text>
          <TextInput
            style={styles.input}
            value={sessionDate}
            onChangeText={setSessionDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View style={[styles.card, shadows.sm]}>
          <Text style={styles.label}>Horário *</Text>
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
  helperText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    fontStyle: "italic",
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
