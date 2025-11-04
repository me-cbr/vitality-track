"use client"

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from "react-native"
import { colors, spacing, borderRadius } from "../theme/colors"
import LoadingButton from "../components/LoadingButton"
import Toast from "../components/Toast"

export default function AuthLogin({ navigation, route, onLogin }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" })
  const role = route?.params?.role || "athlete"

  const handleSubmit = async () => {
    if (!email || !password) {
      setToast({ visible: true, message: "Preencha todos os campos", type: "error" })
      return
    }

    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setLoading(false)

      // Mock validation
      if (email === "error@test.com") {
        setToast({ visible: true, message: "Credenciais inválidas", type: "error" })
        return
      }

      if (onLogin) onLogin(role)
      navigation.navigate(role === "athlete" ? "AthleteMain" : "CoachMain")
    }, 1500)
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
        <Text style={styles.title}>{isLogin ? "Entrar" : "Criar Conta"}</Text>
        <Text style={styles.subtitle}>{role === "athlete" ? "Atleta" : "Treinador"}</Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor={colors.textSecondary}
          />

          <TextInput
            style={styles.input}
            placeholder="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor={colors.textSecondary}
          />

          {isLogin && (
            <TouchableOpacity style={styles.checkboxContainer} onPress={() => setRememberMe(!rememberMe)}>
              <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                {rememberMe && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.checkboxLabel}>Lembrar de mim</Text>
            </TouchableOpacity>
          )}

          <LoadingButton
            title={isLogin ? "Entrar" : "Criar Conta"}
            onPress={handleSubmit}
            loading={loading}
            style={{ marginTop: spacing.md }}
          />

          <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
            <Text style={styles.linkText}>{isLogin ? "Criar nova conta" : "Já tenho conta"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: colors.text,
    marginBottom: spacing.sm,
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
  input: {
    height: 56,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.white,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginVertical: spacing.sm,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "700",
  },
  checkboxLabel: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "500",
  },
  linkText: {
    fontSize: 14,
    color: colors.primary,
    textAlign: "center",
    marginTop: spacing.lg,
    fontWeight: "600",
  },
})
