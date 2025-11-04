import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from "react-native"
import { colors, spacing, borderRadius, shadows } from "../theme/colors"

export default function LoadingButton({ title, onPress, loading = false, disabled = false, style, textStyle }) {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabled, style, !disabled && shadows.md]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator color={colors.white} size="small" />
      ) : (
        <Text style={[styles.buttonText, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    height: 56,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  disabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.white,
    letterSpacing: 0.3,
  },
})
