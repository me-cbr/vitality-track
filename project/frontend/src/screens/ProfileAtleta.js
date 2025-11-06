"use client"

import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { colors, spacing, borderRadius } from "../theme/colors"
import { UserIcon, SettingsIcon, HeartIcon } from "../components/Icons"
import { useAuth } from "../contexts/AuthContext"

export default function ProfileAtleta({ navigation }) {
  const { user } = useAuth()

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Perfil</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <UserIcon color={colors.primary} size={48} />
          </View>
          <Text style={styles.name}>{user?.name || "Usuário"}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        {user?.type === "athlete" && (
          <>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Dados Físicos</Text>
              <View style={styles.dataGrid}>
                <View style={styles.dataItem}>
                  <Text style={styles.dataLabel}>Peso</Text>
                  <Text style={styles.dataValue}>{user?.weight || 75} kg</Text>
                </View>
                <View style={styles.dataItem}>
                  <Text style={styles.dataLabel}>Altura</Text>
                  <Text style={styles.dataValue}>{user?.height || 1.78} m</Text>
                </View>
                <View style={styles.dataItem}>
                  <Text style={styles.dataLabel}>Idade</Text>
                  <Text style={styles.dataValue}>{user?.age || 28} anos</Text>
                </View>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Frequência Cardíaca</Text>
              <View style={styles.hrData}>
                <View style={styles.hrItem}>
                  <HeartIcon color={colors.primary} size={20} />
                  <View style={styles.hrInfo}>
                    <Text style={styles.hrLabel}>FC Repouso</Text>
                    <Text style={styles.hrValue}>60 bpm</Text>
                  </View>
                </View>
                <View style={styles.hrItem}>
                  <HeartIcon color={colors.danger} size={20} />
                  <View style={styles.hrInfo}>
                    <Text style={styles.hrLabel}>FC Máxima</Text>
                    <Text style={styles.hrValue}>192 bpm</Text>
                  </View>
                </View>
              </View>
            </View>
          </>
        )}

        {user?.type === "coach" && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Informações Profissionais</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>CREF</Text>
              <Text style={styles.infoValue}>{user?.cref || "123456"}</Text>
            </View>
          </View>
        )}

        <View style={styles.menuCard}>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("Settings")}>
            <SettingsIcon color={colors.text} size={20} />
            <Text style={styles.menuText}>Configurações</Text>
          </TouchableOpacity>
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
    padding: spacing.lg,
    paddingTop: 60,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: "center",
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.md,
  },
  dataGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  dataItem: {
    flex: 1,
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: "center",
  },
  dataLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  dataValue: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },
  hrData: {
    gap: spacing.sm,
  },
  hrItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.sm,
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.md,
  },
  hrInfo: {
    flex: 1,
  },
  hrLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  hrValue: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: spacing.sm,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  menuCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    overflow: "hidden",
    marginBottom: spacing.xxl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    gap: spacing.sm,
  },
  menuText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: "500",
  },
})
