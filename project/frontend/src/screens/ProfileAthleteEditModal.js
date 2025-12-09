"use client"

import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, ActivityIndicator, Alert } from "react-native"
import { useState } from "react"
import { colors, spacing, borderRadius, shadows } from "../theme/colors"
import { XIcon } from "../components/Icons"

// Mock image storage - simulated local storage
const mockProfileImages = {}

export default function ProfileAthleteEditModal({ visible, onClose, athlete, onSave }) {
  const [selectedImage, setSelectedImage] = useState(athlete?.profile_image || null)
  const [loading, setLoading] = useState(false)

  const handleImageSelect = async (imageType) => {
    // Simulate image selection with different colored avatars
    const colors_avatars = {
      avatar1: "🧑‍💼",
      avatar2: "👨‍🦱",
      avatar3: "👨‍🦳",
      avatar4: "🧑‍🦱",
      avatar5: "👩",
      avatar6: "👩‍🦱",
      avatar7: "👩‍🦳",
      avatar8: "🧑",
    }

    const selectedAvatar = colors_avatars[imageType]
    setSelectedImage(selectedAvatar)
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      // Simulate saving - in real app, this would call an API
      mockProfileImages[athlete.id] = selectedImage

      await new Promise((resolve) => setTimeout(resolve, 500))

      onSave({
        ...athlete,
        profile_image: selectedImage,
      })

      Alert.alert("Sucesso", "Foto de perfil atualizada com sucesso!")
      onClose()
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar a foto de perfil")
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveImage = () => {
    setSelectedImage(null)
  }

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Editar Foto de Perfil</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <XIcon color={colors.text} size={24} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          {/* Current/Preview */}
          <View style={styles.previewSection}>
            <Text style={styles.sectionLabel}>Pré-visualização</Text>
            <View style={[styles.previewCard, shadows.md]}>
              <View style={styles.largeAvatar}>
                <Text style={styles.largeAvatarText}>{selectedImage || athlete?.nome?.split(" ")[0][0]}</Text>
              </View>
              <Text style={styles.previewName}>{athlete?.nome}</Text>
              {selectedImage && selectedImage !== athlete?.profile_image && (
                <Text style={styles.previewSubtext}>Novo avatar selecionado</Text>
              )}
            </View>
          </View>

          {/* Avatar Selection */}
          <View style={styles.selectSection}>
            <Text style={styles.sectionLabel}>Selecione um Avatar</Text>
            <View style={styles.avatarGrid}>
              {[
                { id: "avatar1", emoji: "🧑‍💼" },
                { id: "avatar2", emoji: "👨‍🦱" },
                { id: "avatar3", emoji: "👨‍🦳" },
                { id: "avatar4", emoji: "🧑‍🦱" },
                { id: "avatar5", emoji: "👩" },
                { id: "avatar6", emoji: "👩‍🦱" },
                { id: "avatar7", emoji: "👩‍🦳" },
                { id: "avatar8", emoji: "🧑" },
              ].map((avatar) => (
                <TouchableOpacity
                  key={avatar.id}
                  style={[
                    styles.avatarOption,
                    selectedImage === avatar.emoji && styles.avatarOptionSelected,
                    shadows.sm,
                  ]}
                  onPress={() => handleImageSelect(avatar.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.avatarEmoji}>{avatar.emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Initials Option */}
          <View style={styles.selectSection}>
            <Text style={styles.sectionLabel}>Usar Iniciais</Text>
            <TouchableOpacity
              style={[styles.initialsCard, !selectedImage && styles.initialsCardSelected, shadows.sm]}
              onPress={handleRemoveImage}
              activeOpacity={0.7}
            >
              <View style={[styles.initialsPreview, !selectedImage && styles.initialsPreviewSelected]}>
                <Text style={styles.initialsText}>
                  {athlete?.nome
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")}
                </Text>
              </View>
              <Text style={styles.initialsLabel}>
                {athlete?.nome
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Info Card */}
          <View style={[styles.infoCard, { backgroundColor: colors.primary + "10" }]}>
            <Text style={styles.infoText}>
              💡 Escolha um avatar ou use as iniciais do nome como foto de perfil. Sua escolha será salva e exibida em todo o aplicativo.
            </Text>
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.footer}>
          <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose} disabled={loading}>
            <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.saveButton, loading && styles.buttonDisabled]}
            onPress={handleSave}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color={colors.white} size="small" />
            ) : (
              <Text style={styles.buttonText}>Salvar</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutralBg,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.text,
  },
  closeButton: {
    padding: spacing.sm,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl + 100,
  },
  previewSection: {
    marginBottom: spacing.xl,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.md,
  },
  previewCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: "center",
  },
  largeAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  largeAvatarText: {
    fontSize: 48,
  },
  previewName: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  previewSubtext: {
    fontSize: 13,
    color: colors.success,
    fontWeight: "600",
    marginTop: spacing.sm,
  },
  selectSection: {
    marginBottom: spacing.xl,
  },
  avatarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    justifyContent: "space-between",
  },
  avatarOption: {
    width: "30%",
    aspectRatio: 1,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.divider,
  },
  avatarOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + "10",
  },
  avatarEmoji: {
    fontSize: 40,
  },
  initialsCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.divider,
  },
  initialsCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + "10",
  },
  initialsPreview: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  initialsPreviewSelected: {
    backgroundColor: colors.primary,
  },
  initialsText: {
    fontSize: 32,
    fontWeight: "800",
    color: colors.white,
  },
  initialsLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
  },
  infoCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  infoText: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 20,
    fontWeight: "500",
  },
  footer: {
    flexDirection: "row",
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    paddingBottom: spacing.xxl,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  button: {
    flex: 1,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.white,
  },
  cancelButton: {
    backgroundColor: colors.neutralBg,
    borderWidth: 2,
    borderColor: colors.divider,
  },
  cancelButtonText: {
    color: colors.text,
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
})
