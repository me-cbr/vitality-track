"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from "react-native"
import { colors } from "../theme/colors"
import { ArrowLeftIcon, PlusIcon } from "../components/Icons"

export default function PlanEditor({ navigation, route }) {
  const { athleteId } = route.params || {}
  const [planName, setPlanName] = useState("Plano de Força")
  const [description, setDescription] = useState("Desenvolvimento de força muscular")

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeftIcon color={colors.text} size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Editor de Plano</Text>
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Salvar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.label}>Nome do Plano</Text>
          <TextInput
            style={styles.input}
            value={planName}
            onChangeText={setPlanName}
            placeholder="Ex: Plano de Força"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View style={styles.card}>
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

        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Sessões de Treino</Text>
            <TouchableOpacity style={styles.addButton}>
              <PlusIcon color={colors.primary} size={20} />
            </TouchableOpacity>
          </View>

          <View style={styles.sessionsList}>
            <View style={styles.sessionItem}>
              <Text style={styles.sessionName}>Segunda - Força Superior</Text>
              <Text style={styles.sessionZone}>Zona 4 - Anaeróbica</Text>
            </View>
            <View style={styles.sessionItem}>
              <Text style={styles.sessionName}>Quarta - Força Inferior</Text>
              <Text style={styles.sessionZone}>Zona 4 - Anaeróbica</Text>
            </View>
            <View style={styles.sessionItem}>
              <Text style={styles.sessionName}>Sexta - Condicionamento</Text>
              <Text style={styles.sessionZone}>Zona 3 - Tempo</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.surface,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  sessionsList: {
    gap: 12,
  },
  sessionItem: {
    padding: 16,
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
  },
  sessionName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  sessionZone: {
    fontSize: 14,
    color: colors.textSecondary,
  },
})
