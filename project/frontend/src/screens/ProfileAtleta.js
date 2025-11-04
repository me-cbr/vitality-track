import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { colors } from "../theme/colors"
import { UserIcon, SettingsIcon, LogOutIcon, HeartIcon } from "../components/Icons"

export default function ProfileAtleta({ navigation }) {
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
          <Text style={styles.name}>João Silva</Text>
          <Text style={styles.email}>joao.silva@email.com</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Dados Físicos</Text>
          <View style={styles.dataGrid}>
            <View style={styles.dataItem}>
              <Text style={styles.dataLabel}>Peso</Text>
              <Text style={styles.dataValue}>75 kg</Text>
            </View>
            <View style={styles.dataItem}>
              <Text style={styles.dataLabel}>Altura</Text>
              <Text style={styles.dataValue}>1.78 m</Text>
            </View>
            <View style={styles.dataItem}>
              <Text style={styles.dataLabel}>Idade</Text>
              <Text style={styles.dataValue}>28 anos</Text>
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

        <View style={styles.menuCard}>
          <TouchableOpacity style={styles.menuItem}>
            <SettingsIcon color={colors.text} size={20} />
            <Text style={styles.menuText}>Configurações</Text>
          </TouchableOpacity>
          <View style={styles.menuDivider} />
          <TouchableOpacity style={styles.menuItem}>
            <LogOutIcon color={colors.danger} size={20} />
            <Text style={[styles.menuText, { color: colors.danger }]}>Sair</Text>
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
    padding: 24,
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
    padding: 16,
  },
  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 16,
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
    marginBottom: 16,
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
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 16,
  },
  dataGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  dataItem: {
    flex: 1,
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    padding: 16,
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
    gap: 12,
  },
  hrItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
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
  menuCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 32,
    borderWidth: 1,
    borderColor: colors.border,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  menuText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: "500",
  },
  menuDivider: {
    height: 1,
    backgroundColor: colors.border,
  },
})
