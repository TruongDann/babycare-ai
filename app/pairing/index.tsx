import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { colors, typography } from "../../src/theme";

export default function PairingScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Log in button - Top Right */}
      <TouchableOpacity style={styles.loginButton}>
        <Text style={styles.loginText}>Log in</Text>
      </TouchableOpacity>

      {/* Stars background */}
      <Image
        source={require("../../assets/Onboarding Stars.png")}
        style={styles.starsBackground}
        resizeMode="cover"
      />

      {/* Radar/Locator background - full screen */}
      <Image
        source={require("../../assets/Onboarding Locator.png")}
        style={styles.locatorBackground}
        resizeMode="cover"
      />

      {/* Center content */}
      <View style={styles.centerContent}>
        {/* Search icon */}
        <View style={styles.searchIconContainer}>
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path
              d="M1.50488 10.2246C1.50488 14.9512 5.35059 18.7969 10.0771 18.7969C11.9463 18.7969 13.6543 18.1953 15.0615 17.1855L20.3467 22.4814C20.5938 22.7285 20.916 22.8467 21.2598 22.8467C21.9902 22.8467 22.4951 22.2988 22.4951 21.5791C22.4951 21.2354 22.3662 20.9238 22.1406 20.6982L16.8877 15.4131C17.9941 13.9736 18.6494 12.1797 18.6494 10.2246C18.6494 5.49805 14.8037 1.65234 10.0771 1.65234C5.35059 1.65234 1.50488 5.49805 1.50488 10.2246ZM3.3418 10.2246C3.3418 6.50781 6.36035 3.48926 10.0771 3.48926C13.7939 3.48926 16.8125 6.50781 16.8125 10.2246C16.8125 13.9414 13.7939 16.96 10.0771 16.96C6.36035 16.96 3.3418 13.9414 3.3418 10.2246ZM10.0879 14.7363C10.2598 14.7363 10.3994 14.5967 10.4424 14.4248C10.9795 11.5137 11.248 10.9766 14.2666 10.5684C14.46 10.5469 14.5889 10.4072 14.5889 10.2246C14.5889 10.042 14.46 9.90234 14.2666 9.85938C11.2588 9.45117 10.8721 8.89258 10.4424 6.03516C10.4102 5.8418 10.2598 5.71289 10.0879 5.71289C9.90527 5.71289 9.76562 5.83105 9.72266 6.02441C9.1748 8.94629 8.91699 9.45117 5.89844 9.85938C5.70508 9.90234 5.57617 10.042 5.57617 10.2246C5.57617 10.4072 5.70508 10.5361 5.89844 10.5684C8.91699 10.8691 9.30371 11.5137 9.72266 14.4141C9.75488 14.5967 9.89453 14.7363 10.0879 14.7363Z"
              fill={colors.label.secondary}
              fillOpacity={0.6}
            />
          </Svg>
        </View>

        {/* Text content */}
        <Text style={styles.title}>Looking for camera</Text>
        <Text style={styles.description}>
          Make sure it connected to the power outlet,{"\n"}
          blinking and your iPhone is close to it.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  loginButton: {
    position: "absolute",
    top: 10,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  loginText: {
    fontSize: 17,
    fontFamily: typography.fontFamily.regular,
    lineHeight: 22,
    color: colors.label.primary,
  },
  starsBackground: {
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: 0.8,
  },
  locatorBackground: {
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: 0.6,
  },
  centerContent: {
    position: "absolute",
    bottom: 95,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 40,
  },
  searchIconContainer: {
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontFamily: typography.fontFamily.semibold,
    lineHeight: 28,
    color: colors.label.primary,
    marginBottom: 12,
    textAlign: "center",
  },
  description: {
    fontSize: 13,
    fontFamily: typography.fontFamily.regular,
    lineHeight: 18,
    color: colors.label.secondary,
    textAlign: "center",
  },
});
