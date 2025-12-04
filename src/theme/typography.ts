export const typography = {
  // Font Families
  fontFamily: {
    regular: "SF-Pro-Display-Regular",
    medium: "SF-Pro-Display-Medium",
    semibold: "SF-Pro-Display-Semibold",
    bold: "SF-Pro-Display-Bold",
  },

  // Font Sizes (accessibility-friendly)
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 30,
    "4xl": 36,
  },

  // Font Weights
  fontWeight: {
    regular: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
  },

  // Line Heights
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
};
