import { useFonts as useExpoFonts } from "expo-font";

export const useFonts = () => {
  const [fontsLoaded] = useExpoFonts({
    "SF-Pro-Display-Regular": require("../../assets/fonts/SF-PRO-DISPLAY/sfprodisplayregular.otf"),
    "SF-Pro-Display-Medium": require("../../assets/fonts/SF-PRO-DISPLAY/sfprodisplaymedium.otf"),
    "SF-Pro-Display-Semibold": require("../../assets/fonts/SF-PRO-DISPLAY/sfprodisplaymedium.otf"),
    "SF-Pro-Display-Bold": require("../../assets/fonts/SF-PRO-DISPLAY/sfprodisplaybold.otf"),
  });

  return fontsLoaded;
};
