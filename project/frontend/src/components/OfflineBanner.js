import { View, Text, StyleSheet } from "react-native"
import { colors, spacing } from "../theme/colors"

export default function OfflineBanner({ visible }) {
  if (!visible) return null

  return (
    <View style={styles.banner}>
      <Text style={styles.emoji}>📡</Text>
      <Text style={styles.text}>Modo offline — dados serão sincronizados quando possível</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.warning,
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    gap: spacing.sm,
  },
  emoji: {
    fontSize: 16,
  },
  text: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: colors.white,
  },
})
