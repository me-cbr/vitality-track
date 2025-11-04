import { Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native"
import { colors, spacing, borderRadius } from "../theme/colors"

export default function FilterChips({ options, selected, onSelect }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={[styles.chip, selected === option.value && styles.chipSelected]}
          onPress={() => onSelect(option.value)}
          activeOpacity={0.7}
        >
          <Text style={[styles.chipText, selected === option.value && styles.chipTextSelected]}>{option.label}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.neutralBg,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  chipTextSelected: {
    color: colors.white,
  },
})
