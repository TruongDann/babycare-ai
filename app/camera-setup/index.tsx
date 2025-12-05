import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Svg, { Path } from "react-native-svg";
import { colors, typography } from "../../src/theme";
import { Input, Button } from "../../src/components/ui";

export default function CameraSetupScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [cameraName, setCameraName] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [isConnecting, setIsConnecting] = React.useState(false);

  // Get device info from params
  const deviceIP = params.ip as string;
  const devicePort = params.port as string;

  const handleFinishSetup = async () => {
    if (!cameraName.trim()) {
      Alert.alert("Thiếu thông tin", "Vui lòng đặt tên cho camera");
      return;
    }

    setIsConnecting(true);

    try {
      // TODO: Implement actual camera setup logic
      // - Save camera info to storage
      // - Test connection
      // - Configure camera settings

      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate setup

      Alert.alert("Thiết lập thành công!", "Camera đã sẵn sàng sử dụng", [
        {
          text: "OK",
          onPress: () => {
            // Navigate to home/camera view
            router.replace("/(tabs)");
          },
        },
      ]);
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Không thể thiết lập camera");
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path
              d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z"
              fill={colors.label.primary}
            />
          </Svg>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thiết lập camera</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Camera Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Image
              source={require("../../assets/icons/camera.png")}
              style={styles.cameraIcon}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Device Info */}
        <View style={styles.deviceInfoCard}>
          <Text style={styles.deviceInfoLabel}>Thiết bị được chọn</Text>
          <Text style={styles.deviceInfoValue}>
            {deviceIP}:{devicePort}
          </Text>
        </View>

        {/* Setup Form */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Thông tin camera</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              Tên camera <Text style={styles.required}>*</Text>
            </Text>
            <Input
              value={cameraName}
              onChangeText={setCameraName}
              placeholder="Ví dụ: Phòng ngủ bé"
              placeholderTextColor={colors.label.tertiary}
              style={styles.input}
            />
            <Text style={styles.inputHint}>
              Đặt tên dễ nhớ để nhận biết camera
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Vị trí (tùy chọn)</Text>
            <Input
              value={location}
              onChangeText={setLocation}
              placeholder="Ví dụ: Tầng 2, góc phải"
              placeholderTextColor={colors.label.tertiary}
              style={styles.input}
            />
          </View>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomContainer}>
        <Button
          title={isConnecting ? "Đang thiết lập..." : "Hoàn tất"}
          onPress={handleFinishSetup}
          disabled={isConnecting}
          style={styles.finishButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary.default,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontFamily: typography.fontFamily.semibold,
    color: colors.label.primary,
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  iconContainer: {
    alignItems: "center",
    marginVertical: 32,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.systemBackground.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraIcon: {
    width: 80,
    height: 80,
  },
  deviceInfoCard: {
    backgroundColor: colors.systemBackground.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
  },
  deviceInfoLabel: {
    fontSize: 13,
    fontFamily: typography.fontFamily.regular,
    color: colors.label.secondary,
    marginBottom: 4,
  },
  deviceInfoValue: {
    fontSize: 17,
    fontFamily: typography.fontFamily.semibold,
    color: colors.label.primary,
  },
  formSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: typography.fontFamily.bold,
    color: colors.label.primary,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 15,
    fontFamily: typography.fontFamily.semibold,
    color: colors.label.primary,
    marginBottom: 8,
  },
  required: {
    color: colors.systemRed,
  },
  input: {
    marginBottom: 8,
  },
  inputHint: {
    fontSize: 13,
    fontFamily: typography.fontFamily.regular,
    color: colors.label.tertiary,
  },
  featuresSection: {
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  featureIcon: {
    marginRight: 12,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 15,
    fontFamily: typography.fontFamily.semibold,
    color: colors.label.primary,
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: 13,
    fontFamily: typography.fontFamily.regular,
    color: colors.label.secondary,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.primary.default,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: colors.fill.tertiary,
  },
  finishButton: {
    width: "100%",
  },
});
