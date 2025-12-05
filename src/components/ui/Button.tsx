import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from "react-native";
import { colors, typography, spacing, borderRadius } from "../../theme";

interface ButtonProps {
  children?: React.ReactNode;
  title?: string;
  onPress: () => void;
  variant?:
    | "primary"
    | "secondary"
    | "ghost"
    | "danger"
    | "transparent"
    | "close";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  title,
  onPress,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  // Close button variant
  if (variant === "close") {
    return (
      <TouchableOpacity style={[styles.closeButton, style]} onPress={onPress}>
        <View style={styles.closeIcon}>
          <Text style={styles.closeIconText}>×</Text>
        </View>
      </TouchableOpacity>
    );
  }

  const buttonStyles = [
    styles.button,
    variant === "primary" && styles.primary,
    variant === "secondary" && styles.secondary,
    variant === "ghost" && styles.ghost,
    variant === "danger" && styles.danger,
    variant === "transparent" && styles.transparent,
    size === "sm" && styles.size_sm,
    size === "md" && styles.size_md,
    size === "lg" && styles.size_lg,
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    variant === "primary" && styles.text_primary,
    variant === "secondary" && styles.text_secondary,
    variant === "ghost" && styles.text_ghost,
    variant === "danger" && styles.text_danger,
    variant === "transparent" && styles.text_transparent,
    size === "sm" && styles.textSize_sm,
    size === "md" && styles.textSize_md,
    size === "lg" && styles.textSize_lg,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={
            variant === "primary" ? colors.text.inverse : colors.primary[500]
          }
        />
      ) : (
        <Text style={textStyles}>{title || children}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },

  // Variants
  primary: {
    backgroundColor: colors.primary[500],
  },
  secondary: {
    backgroundColor: colors.secondary[500],
  },
  ghost: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.primary[500],
  },
  danger: {
    backgroundColor: colors.error,
  },
  transparent: {
    backgroundColor: "rgba(120, 120, 128, 0.2)",
  },

  // Close button styles
  closeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 1,
  },
  closeIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(120, 120, 128, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  closeIconText: {
    fontSize: 24,
    color: colors.label.secondary,
    fontWeight: "300",
  },

  // Sizes
  size_sm: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 32,
  },
  size_md: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: 44,
  },
  size_lg: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    minHeight: 56,
  },

  // Disabled
  disabled: {
    opacity: 0.5,
  },

  // Text styles
  text: {
    fontWeight: typography.fontWeight.semibold,
  },
  text_primary: {
    color: colors.text.inverse,
  },
  text_secondary: {
    color: colors.text.inverse,
  },
  text_ghost: {
    color: colors.primary[500],
  },
  text_danger: {
    color: colors.text.inverse,
  },
  text_transparent: {
    color: colors.label.primary,
  },

  // Text sizes
  textSize_sm: {
    fontSize: typography.fontSize.sm,
  },
  textSize_md: {
    fontSize: typography.fontSize.base,
  },
  textSize_lg: {
    fontSize: typography.fontSize.lg,
  },
});
