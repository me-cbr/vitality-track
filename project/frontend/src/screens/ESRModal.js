"use client"

import { useState } from "react"
import { View, Text, TouchableOpacity, TextInput, Modal, StyleSheet, ScrollView } from "react-native"
import { colors, spacing, borderRadius, shadows } from "../theme/colors"
import { XIcon } from "../components/Icons"

export default function ESRModal({ navigation }) {
  const [esrValue, setEsrValue] = useState(5)
  const [comment, setComment] = useState("")

  const getESRColor = (value) => {
    if (value <= 3) return colors.danger
    if (value <= 6) return colors.warning
    return colors.success
  }

  const handleSubmit = () => {
    // Save ESR value
    navigation.goBack()
  }

  return (
    <Modal visible={true} animationType="slide" transparent={true} onRequestClose={() => navigation.goBack()}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Registrar Escala Subjetiva</Text>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
              <XIcon color={colors.text} size={24} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
            {/* ESR Display */}
            <View style={[styles.esrDisplay, { backgroundColor: getESRColor(esrValue) }]}>
              <Text style={styles.esrEmoji}>❤️</Text>
              <Text style={styles.esrValue}>{esrValue}</Text>
              <Text style={styles.esrLabel}>Nível de Esforço Percebido</Text>
            </View>

            {/* Slider */}
            <View style={[styles.sliderCard, shadows.md]}>
              <Text style={styles.sliderTitle}>Selecione seu nível</Text>
              <View style={styles.sliderContainer}>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                  <TouchableOpacity
                    key={value}
                    style={[styles.sliderButton, esrValue === value && styles.sliderButtonActive]}
                    onPress={() => setEsrValue(value)}
                  >
                    <Text style={[styles.sliderButtonText, esrValue === value && styles.sliderButtonTextActive]}>
                      {value}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.sliderLabels}>
                <Text style={styles.sliderLabelText}>Muito fácil</Text>
                <Text style={styles.sliderLabelText}>Médio</Text>
                <Text style={styles.sliderLabelText}>Máximo</Text>
              </View>
            </View>

            {/* Comment */}
            <View style={[styles.commentCard, shadows.md]}>
              <View style={styles.commentHeader}>
                <Text style={styles.commentEmoji}>💬</Text>
                <Text style={styles.commentTitle}>Comentário (opcional)</Text>
              </View>
              <TextInput
                style={styles.commentInput}
                placeholder="Como você se sentiu? (opcional)"
                value={comment}
                onChangeText={setComment}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            {/* Buttons */}
            <View style={styles.buttons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => navigation.goBack()}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={handleSubmit} activeOpacity={0.8}>
                <Text style={styles.submitButtonText}>ENVIAR ESR</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: "90%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.text,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  esrDisplay: {
    borderRadius: borderRadius.xl,
    padding: spacing.xxl,
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  esrEmoji: {
    fontSize: 40,
    marginBottom: spacing.md,
  },
  esrValue: {
    fontSize: 64,
    fontWeight: "800",
    color: colors.white,
    lineHeight: 64,
  },
  esrLabel: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    marginTop: spacing.md,
  },
  sliderCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  sliderTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.md,
  },
  sliderContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  sliderButton: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.neutralBg,
    justifyContent: "center",
    alignItems: "center",
  },
  sliderButtonActive: {
    backgroundColor: colors.primary,
  },
  sliderButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  sliderButtonTextActive: {
    color: colors.white,
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sliderLabelText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  commentCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  commentEmoji: {
    fontSize: 20,
  },
  commentTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textTertiary,
  },
  commentInput: {
    height: 100,
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    fontSize: 14,
    color: colors.text,
  },
  buttons: {
    flexDirection: "row",
    gap: spacing.md,
  },
  button: {
    flex: 1,
    height: 52,
    borderRadius: borderRadius.xl,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
  },
  submitButton: {
    backgroundColor: colors.action,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.white,
  },
})
