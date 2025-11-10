"use client"

import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native"
import { colors, spacing, borderRadius } from "../theme/colors"
import LoadingButton from "../components/LoadingButton"
import Toast from "../components/Toast"
import { useAuth } from "../contexts/AuthContext"

export default function AuthRegister({ navigation }) {
  const [userType, setUserType] = useState(null) // 'athlete' or 'coach'
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    // Athlete specific
    birthDate: "",
    weight: "",
    height: "",
    restingHR: "",
    // Coach specific
    cref: "",
    specialty: "",
  })
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" })
  const { register } = useAuth()

  const handleSubmit = async () => {
    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      setToast({ visible: true, message: "Preencha todos os campos obrigatórios", type: "error" })
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setToast({ visible: true, message: "As senhas não coincidem", type: "error" })
      return
    }

    if (formData.password.length < 6) {
      setToast({ visible: true, message: "A senha deve ter pelo menos 6 caracteres", type: "error" })
      return
    }

    setLoading(true)

    // Simulate API delay
    setTimeout(async () => {
      const result = await register({
        ...formData,
        type: userType,
      })
      setLoading(false)

      if (result.success) {
        setToast({ visible: true, message: "Cadastro realizado com sucesso!", type: "success" })
        setTimeout(() => {
          navigation.replace("Auth")
        }, 1500)
      } else {
        setToast({ visible: true, message: result.error, type: "error" })
      }
    }, 1000)
  }

  if (!userType) {
    return (
      <View style={styles.container}>
        <Toast
          message={toast.message}
          type={toast.type}
          visible={toast.visible}
          onHide={() => setToast({ ...toast, visible: false })}
        />

        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>💪</Text>
            <Text style={styles.appName}>VitalityCheck</Text>
          </View>

          <Text style={styles.title}>Criar Conta</Text>
          <Text style={styles.subtitle}>Escolha o tipo de conta</Text>

          <View style={styles.userTypeContainer}>
            <TouchableOpacity
              style={[styles.userTypeCard, styles.athleteCard]}
              onPress={() => setUserType("athlete")}
              activeOpacity={0.85}
            >
              <Text style={styles.userTypeEmoji}>🏃</Text>
              <Text style={styles.userTypeTitle}>Sou Atleta</Text>
              <Text style={styles.userTypeDescription}>Receba treinos personalizados e acompanhe seu progresso</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.userTypeCard, styles.coachCard]}
              onPress={() => setUserType("coach")}
              activeOpacity={0.85}
            >
              <Text style={styles.userTypeEmoji}>👨‍🏫</Text>
              <Text style={styles.userTypeTitle}>Sou Treinador</Text>
              <Text style={styles.userTypeDescription}>Gerencie atletas e crie planos de treinamento</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>← Voltar para Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onHide={() => setToast({ ...toast, visible: false })}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setUserType(null)} style={styles.backIcon}>
            <Text style={styles.backIconText}>←</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Cadastro de {userType === "athlete" ? "Atleta" : "Treinador"}</Text>
            <Text style={styles.headerSubtitle}>Preencha seus dados</Text>
          </View>
        </View>

        <View style={styles.form}>
          {/* Common Fields */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nome Completo *</Text>
            <TextInput
              style={styles.input}
              placeholder="Seu nome completo"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholderTextColor={colors.textTertiary}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              placeholder="seu@email.com"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={colors.textTertiary}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Senha *</Text>
            <TextInput
              style={styles.input}
              placeholder="Mínimo 6 caracteres"
              value={formData.password}
              onChangeText={(text) => setFormData({ ...formData, password: text })}
              secureTextEntry
              placeholderTextColor={colors.textTertiary}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirmar Senha *</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite a senha novamente"
              value={formData.confirmPassword}
              onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
              secureTextEntry
              placeholderTextColor={colors.textTertiary}
            />
          </View>

          {/* Athlete Specific Fields */}
          {userType === "athlete" && (
            <>
              <Text style={styles.sectionTitle}>Dados Físicos</Text>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Data de Nascimento</Text>
                <TextInput
                  style={styles.input}
                  placeholder="DD/MM/AAAA"
                  value={formData.birthDate}
                  onChangeText={(text) => setFormData({ ...formData, birthDate: text })}
                  placeholderTextColor={colors.textTertiary}
                />
              </View>

              <View style={styles.row}>
                <View style={[styles.inputContainer, { flex: 1 }]}>
                  <Text style={styles.label}>Peso (kg)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="70"
                    value={formData.weight}
                    onChangeText={(text) => setFormData({ ...formData, weight: text })}
                    keyboardType="numeric"
                    placeholderTextColor={colors.textTertiary}
                  />
                </View>

                <View style={[styles.inputContainer, { flex: 1 }]}>
                  <Text style={styles.label}>Altura (cm)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="175"
                    value={formData.height}
                    onChangeText={(text) => setFormData({ ...formData, height: text })}
                    keyboardType="numeric"
                    placeholderTextColor={colors.textTertiary}
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Frequência Cardíaca de Repouso (bpm)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="60"
                  value={formData.restingHR}
                  onChangeText={(text) => setFormData({ ...formData, restingHR: text })}
                  keyboardType="numeric"
                  placeholderTextColor={colors.textTertiary}
                />
              </View>
            </>
          )}

          {/* Coach Specific Fields */}
          {userType === "coach" && (
            <>
              <Text style={styles.sectionTitle}>Dados Profissionais</Text>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>CREF</Text>
                <TextInput
                  style={styles.input}
                  placeholder="000000-G/XX"
                  value={formData.cref}
                  onChangeText={(text) => setFormData({ ...formData, cref: text })}
                  placeholderTextColor={colors.textTertiary}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Especialidade</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Musculação, Corrida, etc."
                  value={formData.specialty}
                  onChangeText={(text) => setFormData({ ...formData, specialty: text })}
                  placeholderTextColor={colors.textTertiary}
                />
              </View>
            </>
          )}

          <LoadingButton
            title="Criar Conta"
            onPress={handleSubmit}
            loading={loading}
            style={{ marginTop: spacing.lg }}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.xl,
    paddingBottom: spacing.xxl * 2,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: spacing.xxl,
  },
  logo: {
    fontSize: 64,
    marginBottom: spacing.sm,
  },
  appName: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.primary,
    letterSpacing: -0.5,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: colors.text,
    marginBottom: spacing.xs,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: spacing.xxl,
    fontWeight: "500",
  },
  userTypeContainer: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  userTypeCard: {
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    borderWidth: 2,
    alignItems: "center",
  },
  athleteCard: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  coachCard: {
    backgroundColor: colors.secondaryLight,
    borderColor: colors.secondary,
  },
  userTypeEmoji: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  userTypeTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  userTypeDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    fontWeight: "500",
  },
  backButton: {
    alignItems: "center",
    paddingVertical: spacing.md,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  backIcon: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  backIconText: {
    fontSize: 24,
    color: colors.text,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.text,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  form: {
    gap: spacing.md,
  },
  inputContainer: {
    gap: spacing.xs,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginLeft: spacing.xs,
  },
  input: {
    height: 56,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: "row",
    gap: spacing.md,
  },
})
