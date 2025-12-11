"use client"

import { useState } from "react"
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, Image } from "react-native"
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
    try {
      const result = await login(email, password)
      if (result.success) {
        // Navigate based on user_type from profile. App main stacks are
        // registered as 'AthleteMain' and 'CoachMain' in App.js.
        const user = result.user || {}
        const destination = user.user_type === "athlete" ? "AthleteMain" : "CoachMain"
        navigation.replace(destination)
      } else {
        setToast({ visible: true, message: result.error || "Erro ao autenticar", type: "error" })
      }
    } catch (err) {
      setToast({ visible: true, message: err.message || "Erro de rede", type: "error" })
    } finally {
      setLoading(false)
    }
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
          <Image source={require("../../assets/icon.png")} style={styles.logoImage} />
          <Text style={styles.appName}>VitalityCheck</Text>
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
  logoImage: {
    width: 90,
    height: 90,
    marginBottom: spacing.sm,
    borderRadius: 12,
  },
  appName: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.gray,
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
