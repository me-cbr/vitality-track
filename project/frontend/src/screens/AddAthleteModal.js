"use client"

import { useState } from "react"
import { View, Text, TextInput, StyleSheet, Modal, TouchableOpacity } from "react-native"
import { colors, spacing, borderRadius, shadows } from "../theme/colors"
import LoadingButton from "../components/LoadingButton"
import Toast from "../components/Toast"
import { athleteService } from "../services/athleteService"

export default function AddAthleteModal({ visible, onClose, onSuccess }) {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" })

  const handleSubmit = async () => {
    if (!email) {
      setToast({ visible: true, message: "Digite o email do atleta", type: "error" })
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setToast({ visible: true, message: "Email inválido", type: "error" })
      return
    }

    setLoading(true)

    try {
      const result = await athleteService.addAthleteByEmail(email)
      setLoading(false)

      if (result.success) {
        setToast({ visible: true, message: "Atleta adicionado com sucesso!", type: "success" })
        setTimeout(() => {
          setEmail("")
          onSuccess?.()
          onClose()
        }, 1500)
      } else {
        setToast({ visible: true, message: result.error || "Erro ao adicionar atleta", type: "error" })
      }
    } catch (error) {
      setLoading(false)
      setToast({ visible: true, message: "Erro ao adicionar atleta", type: "error" })
    }
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Toast
          message={toast.message}
          type={toast.type}
          visible={toast.visible}
          onHide={() => setToast({ ...toast, visible: false })}
        />

        <View style={[styles.modal, shadows.xl]}>
          <View style={styles.header}>
            <Text style={styles.title}>Adicionar Atleta</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.description}>Digite o email do atleta que deseja adicionar ao seu time</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email do Atleta</Text>
            <TextInput
              style={styles.input}
              placeholder="atleta@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={colors.textTertiary}
            />
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <LoadingButton title="Adicionar" onPress={handleSubmit} loading={loading} style={styles.submitButton} />
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  modal: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    width: "100%",
    maxWidth: 400,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.text,
    letterSpacing: -0.5,
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 20,
    color: colors.textSecondary,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    fontWeight: "500",
  },
  inputContainer: {
    gap: spacing.xs,
    marginBottom: spacing.xl,
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
  actions: {
    flexDirection: "row",
    gap: spacing.md,
  },
  cancelButton: {
    flex: 1,
    height: 52,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
  },
  submitButton: {
    flex: 1,
  },
})
