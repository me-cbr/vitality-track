"use client"

import { useState } from "react"
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native"
import { colors, spacing, borderRadius } from "../theme/colors"
import LoadingButton from "../components/LoadingButton"
import Toast from "../components/Toast"
import { useAuth } from "../contexts/AuthContext"

export default function AuthLogin({ navigation }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" })
  const { login } = useAuth()

  const handleSubmit = async () => {
    if (!email || !password) {
      setToast({ visible: true, message: "Preencha todos os campos", type: "error" })
      return
    }

    setLoading(true)

    // Simulate API delay
    setTimeout(async () => {
      const result = await login(email, password)
      setLoading(false)

      if (result.success) {
        // Navigate based on user type
        const destination = result.user.type === "athlete" ? "AthleteMain" : "CoachMain"
        navigation.replace(destination)
      } else {
        setToast({ visible: true, message: result.error, type: "error" })
      }
    }, 1000)
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onHide={() => setToast({ ...toast, visible: false })}
      />

      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>💪</Text>
          <Text style={styles.appName}>VitalityTrack</Text>
        </View>

        <Text style={styles.title}>Bem-vindo</Text>
        <Text style={styles.subtitle}>Entre com suas credenciais</Text>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="seu@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={colors.textTertiary}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor={colors.textTertiary}
            />
          </View>

          <View style={styles.helpContainer}>
            <Text style={styles.helpText}>Credenciais de teste:</Text>
            <Text style={styles.helpDetail}>Atleta: atleta@email.com / atleta</Text>
            <Text style={styles.helpDetail}>Treinador: treinador@email.com / treinador</Text>
          </View>

          <LoadingButton title="Entrar" onPress={handleSubmit} loading={loading} style={{ marginTop: spacing.lg }} />

          <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate("Register")}>
            <Text style={styles.registerText}>
              Não tem uma conta? <Text style={styles.registerLink}>Cadastre-se</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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
  helpContainer: {
    backgroundColor: colors.primaryLight,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.sm,
  },
  helpText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  helpDetail: {
    fontSize: 11,
    color: colors.textSecondary,
    fontFamily: "monospace",
  },
  registerButton: {
    alignItems: "center",
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
  },
  registerText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  registerLink: {
    color: colors.primary,
    fontWeight: "700",
  },
})
