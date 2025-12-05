import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { colors, typography } from "../../theme";
import { Button } from "./Button";

interface DialogButton {
  title: string;
  onPress: () => void;
}

interface DialogProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  buttons?: DialogButton[];
  style?: ViewStyle;
}

export const Dialog: React.FC<DialogProps> = ({
  visible,
  onClose,
  title,
  message,
  buttons = [],
  style,
}) => {
  if (!visible) return null;

  return (
    <View style={[styles.container, style]}>
      <Button variant="close" onPress={onClose} />

      {title && <Text style={styles.title}>{title}</Text>}
      <Text style={styles.message}>{message}</Text>

      {buttons.length > 0 && (
        <View style={styles.buttonsContainer}>
          {buttons.map((button, index) => (
            <Button
              key={index}
              title={button.title}
              onPress={button.onPress}
              style={styles.button}
              variant="transparent"
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 95,
    left: 16,
    right: 16,
    backgroundColor: "rgba(28, 28, 30, 0.95)",
    borderRadius: 14,
    padding: 20,
    paddingTop: 28,
  },
  title: {
    fontSize: 13,
    fontFamily: typography.fontFamily.regular,
    color: colors.label.secondary,
    textAlign: "center",
    marginBottom: 8,
  },
  message: {
    fontSize: 17,
    fontFamily: typography.fontFamily.semibold,
    color: colors.label.primary,
    textAlign: "center",
    marginBottom: 20,
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
  },
});
