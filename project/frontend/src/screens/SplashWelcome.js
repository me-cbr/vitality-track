"use client"

import { useEffect, useRef } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native"
import * as Haptics from "expo-haptics"
import { colors, spacing, borderRadius } from "../theme/colors"

export default function SplashWelcome({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(40)).current
  const scaleAnim = useRef(new Animated.Value(0.8)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  const handlePress = (role) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    navigation.navigate("Auth", { role })
  }

  return (
    <View style={styles.container}>
      {/* Background gradient effect */}
      <View style={styles.bgGradient} />

      <View style={styles.content}>
        {/* Logo with scale animation */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }, { translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.logoInner}>
            <Text style={styles.logo}>❤️</Text>
          </View>
        </Animated.View>

        {/* Title and subtitle */}
        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.title}>VitalityTrack</Text>
          <Text style={styles.subtitle}>Seu Companheiro em Saúde e Performance</Text>
        </Animated.View>

        {/* Buttons */}
        <Animated.View
          style={[
            styles.buttonContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={() => handlePress("athlete")}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryButtonText}>Sou Atleta</Text>
            <Text style={styles.buttonSubtext}>Acompanhe seu desempenho</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => handlePress("coach")}
            activeOpacity={0.85}
          >
            <Text style={styles.secondaryButtonText}>Sou Treinador</Text>
            <Text style={styles.secondaryButtonSubtext}>Gerencie seus atletas</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Auth")} style={styles.linkButton}>
            <Text style={styles.linkText}>Já tenho conta? Entrar</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  bgGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: colors.primary,
    opacity: 0.06,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  logoContainer: {
    marginBottom: spacing.xxl,
  },
  logoInner: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  logo: {
    fontSize: 60,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: spacing.xxl,
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    color: colors.text,
    marginBottom: spacing.sm,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
  },
  buttonContainer: {
    width: "100%",
    gap: spacing.md,
  },
  button: {
    height: 64,
    borderRadius: borderRadius.xl,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: spacing.md,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  secondaryButton: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.white,
    marginBottom: 2,
  },
  buttonSubtext: {
    fontSize: 12,
    color: "rgba(255,255,255,0.85)",
    fontWeight: "500",
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: 2,
  },
  secondaryButtonSubtext: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  linkButton: {
    paddingVertical: spacing.md,
  },
  linkText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
    textAlign: "center",
  },
})
