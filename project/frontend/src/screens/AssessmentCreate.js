"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from "react-native"
import { colors } from "../theme/colors"
import { ArrowLeftIcon, HeartIcon } from "../components/Icons"

export default function AssessmentCreate({ navigation, route }) {
  const { athleteId } = route.params || {}
  const [fcRepouso, setFcRepouso] = useState("")
  const [observations, setObservations] = useState("")

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeftIcon color={colors.text} size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Nova Avaliação</Text>
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Salvar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.iconHeader}>
            <HeartIcon color={colors.primary} size={32} />
            <Text style={styles.cardTitle}>Frequência Cardíaca</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>FC Repouso (bpm)</Text>
            <TextInput
              style={styles.input}
              value={fcRepouso}
              onChangeText={setFcRepouso}
              placeholder="Ex: 60"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              A frequência cardíaca de repouso é medida pela manhã, antes de levantar da cama.
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Zonas de Treinamento Calculadas</Text>
          <View style={styles.zonesList}>
            <View style={[styles.zoneItem, { backgroundColor: colors.zone1 }]}>
              <Text style={styles.zoneName}>Zona 1 - Recuperação</Text>
              <Text style={styles.zoneRange}>114-133 bpm</Text>
            </View>
            <View style={[styles.zoneItem, { backgroundColor: colors.zone2 }]}>
              <Text style={styles.zoneName}>Zona 2 - Aeróbica</Text>
              <Text style={styles.zoneRange}>133-152 bpm</Text>
            </View>
            <View style={[styles.zoneItem, { backgroundColor: colors.zone3 }]}>
              <Text style={styles.zoneName}>Zona 3 - Tempo</Text>
              <Text style={styles.zoneRange}>152-171 bpm</Text>
            </View>
            <View style={[styles.zoneItem, { backgroundColor: colors.zone4 }]}>
              <Text style={styles.zoneName}>Zona 4 - Anaeróbica</Text>
              <Text style={styles.zoneRange}>171-190 bpm</Text>
            </View>
            <View style={[styles.zoneItem, { backgroundColor: colors.zone5 }]}>
              <Text style={styles.zoneName}>Zona 5 - Máxima</Text>
              <Text style={styles.zoneRange}>190+ bpm</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Observações</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={observations}
            onChangeText={setObservations}
            placeholder="Adicione observações sobre a avaliação"
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={4}
          />
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
  iconHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  inputGroup: {
    marginBottom: 16,
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
  infoBox: {
    backgroundColor: colors.primaryLight,
    borderRadius: 8,
    padding: 12,
  },
  infoText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  zonesList: {
    gap: 8,
  },
  zoneItem: {
    padding: 16,
    borderRadius: 12,
  },
  zoneName: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.surface,
    marginBottom: 4,
  },
  zoneRange: {
    fontSize: 13,
    color: colors.surface,
    opacity: 0.9,
  },
})
