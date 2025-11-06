"use client"

import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { colors, spacing, borderRadius } from "../theme/colors"
import { ArrowLeftIcon, SaveIcon } from "../components/Icons"
import { useAuth } from "../contexts/AuthContext"
import LoadingButton from "../components/LoadingButton"
import Toast from "../components/Toast"

export default function EditProfile({ navigation }) {
  const { user, updateUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" })

  // Form state
  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [weight, setWeight] = useState(user?.weight?.toString() || "")
  const [height, setHeight] = useState(user?.height?.toString() || "")
  const [age, setAge] = useState(user?.age?.toString() || "")
  const [restingHR, setRestingHR] = useState(user?.restingHeartRate?.toString() || "")
  const [maxHR, setMaxHR] = useState(user?.maxHeartRate?.toString() || "")
  const [cref, setCref] = useState(user?.cref || "")

  const handleSave = async () => {
    if (!name || !email) {
      setToast({ visible: true, message: "Nome e email são obrigatórios", type: "error" })
      return
    }

    setLoading(true)

    const updatedData = {
      name,
      email,
      ...(user?.type === "athlete" && {
        weight: weight ? Number.parseFloat(weight) : null,
        height: height ? Number.parseFloat(height) : null,
        age: age ? Number.parseInt(age) : null,
        restingHeartRate: restingHR ? Number.parseInt(restingHR) : null,
        maxHeartRate: maxHR ? Number.parseInt(maxHR) : null,
      }),
      ...(user?.type === "coach" && {
        cref,
      }),
    }

    try {
      await updateUser(updatedData)
      setToast({ visible: true, message: "Perfil atualizado com sucesso!", type: "success" })
      setTimeout(() => {
        navigation.goBack()
      }, 1500)
    } catch (error) {
      setToast({ visible: true, message: "Erro ao atualizar perfil", type: "error" })
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

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeftIcon color={colors.text} size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Editar Perfil</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações Básicas</Text>
          <View style={styles.card}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nome Completo</Text>
              <TextInput
                style={styles.input}
                placeholder="Seu nome"
                value={name}
                onChangeText={setName}
                placeholderTextColor={colors.textTertiary}
              />
            </View>

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
          </View>
        </View>

        {user?.type === "athlete" && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Dados Físicos</Text>
              <View style={styles.card}>
                <View style={styles.inputRow}>
                  <View style={[styles.inputContainer, { flex: 1 }]}>
                    <Text style={styles.label}>Peso (kg)</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="75"
                      value={weight}
                      onChangeText={setWeight}
                      keyboardType="decimal-pad"
                      placeholderTextColor={colors.textTertiary}
                    />
                  </View>

                  <View style={[styles.inputContainer, { flex: 1 }]}>
                    <Text style={styles.label}>Altura (m)</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="1.78"
                      value={height}
                      onChangeText={setHeight}
                      keyboardType="decimal-pad"
                      placeholderTextColor={colors.textTertiary}
                    />
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Idade (anos)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="28"
                    value={age}
                    onChangeText={setAge}
                    keyboardType="number-pad"
                    placeholderTextColor={colors.textTertiary}
                  />
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Frequência Cardíaca</Text>
              <Text style={styles.sectionDescription}>
                Edite manualmente ou integre com dispositivos externos nas configurações
              </Text>
              <View style={styles.card}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>FC Repouso (bpm)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="60"
                    value={restingHR}
                    onChangeText={setRestingHR}
                    keyboardType="number-pad"
                    placeholderTextColor={colors.textTertiary}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>FC Máxima (bpm)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="192"
                    value={maxHR}
                    onChangeText={setMaxHR}
                    keyboardType="number-pad"
                    placeholderTextColor={colors.textTertiary}
                  />
                </View>
              </View>
            </View>
          </>
        )}

        {user?.type === "coach" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informações Profissionais</Text>
            <View style={styles.card}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>CREF</Text>
                <TextInput
                  style={styles.input}
                  placeholder="123456"
                  value={cref}
                  onChangeText={setCref}
                  placeholderTextColor={colors.textTertiary}
                />
              </View>
            </View>
          </View>
        )}

        <LoadingButton
          title="Salvar Alterações"
          onPress={handleSave}
          loading={loading}
          icon={<SaveIcon color={colors.surface} size={20} />}
          style={{ marginTop: spacing.md, marginBottom: spacing.xxl }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
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
    padding: spacing.lg,
    paddingTop: 60,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    marginRight: spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    marginLeft: spacing.xs,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sectionDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
    fontStyle: "italic",
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  inputContainer: {
    gap: spacing.xs,
  },
  inputRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginLeft: spacing.xs,
  },
  input: {
    height: 48,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.background,
  },
})
