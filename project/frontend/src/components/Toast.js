"use client"

import { useEffect } from "react"
import { Text, StyleSheet, Animated } from "react-native"
import { colors, spacing, borderRadius, shadows } from "../theme/colors"

export default function Toast({ message, type = "success", visible, onHide }) {
  const opacity = new Animated.Value(0)
  const translateY = new Animated.Value(-20)

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start()

      const timeout = setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: -20,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          if (onHide) onHide()
        })
      }, 3500)

      return () => clearTimeout(timeout)
    }
  }, [visible])

  if (!visible) return null

  const backgroundColor = type === "error" ? colors.danger : type === "warning" ? colors.warning : colors.success

  return (
    <Animated.View style={[styles.container, { opacity, transform: [{ translateY }] }, shadows.lg]}>
      <Text style={styles.emoji}>{type === "error" ? "❌" : type === "warning" ? "⚠️" : "✅"}</Text>
      <Text style={[styles.message, { backgroundColor }]}>{message}</Text>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 60,
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.xl,
    gap: spacing.md,
    zIndex: 1000,
  },
  emoji: {
    fontSize: 24,
  },
  message: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: colors.white,
    lineHeight: 20,
  },
})
