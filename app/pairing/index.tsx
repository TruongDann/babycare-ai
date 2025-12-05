import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  Animated,
  Linking,
  Alert,
  FlatList,
  Modal,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import NetInfo from "@react-native-community/netinfo";
import { useRouter } from "expo-router";
import { colors, typography } from "../../src/theme";
import { lanDeviceScanner, DeviceInfo } from "../../src/services/lanScanner";
import { Button, Dialog } from "@/components/ui";

export default function PairingScreen() {
  const router = useRouter();
  const [showDialog, setShowDialog] = React.useState(false);
  const [showWifiOff, setShowWifiOff] = React.useState(false);
  const [foundDevices, setFoundDevices] = React.useState<DeviceInfo[]>([]);
  const [isScanning, setIsScanning] = React.useState(false);
  const [showDeviceList, setShowDeviceList] = React.useState(false);
  const centerContentPosition = React.useRef(new Animated.Value(95)).current;

  const dot1Opacity = React.useRef(new Animated.Value(0)).current;
  const dot2Opacity = React.useRef(new Animated.Value(0)).current;
  const dot3Opacity = React.useRef(new Animated.Value(0)).current;

  // Debug: Log state changes
  React.useEffect(() => {
    console.log(
      "State changed - showDeviceList:",
      showDeviceList,
      "foundDevices:",
      foundDevices.length
    );
  }, [showDeviceList, foundDevices]);

  // Mock devices for testing (when no real camera available)
  const addMockDevices = () => {
    const mockDevices: DeviceInfo[] = [
      { ip: "192.168.1.100", port: 80, name: "Demo Camera 1", type: "camera" },
      {
        ip: "192.168.1.101",
        port: 8080,
        name: "Demo Camera 2",
        type: "camera",
      },
      { ip: "192.168.1.102", port: 554, name: "Demo Camera 3", type: "camera" },
    ];

    setFoundDevices(mockDevices);
    setShowDeviceList(true);
    setIsScanning(false);
  };

  // Kiểm tra kết nối WiFi và bắt đầu quét
  React.useEffect(() => {
    checkWiFiAndStartScan();
  }, []);

  const checkWiFiAndStartScan = async () => {
    try {
      const networkState = await NetInfo.fetch();

      if (!networkState.isConnected || networkState.type !== "wifi") {
        setShowWifiOff(true);
        return;
      }

      // Bắt đầu quét thiết bị
      startDeviceScan();
    } catch (error) {
      console.error("Error checking WiFi:", error);
      Alert.alert("Lỗi", "Không thể kiểm tra kết nối WiFi");
    }
  };

  const startDeviceScan = async () => {
    if (isScanning) return;

    setIsScanning(true);
    setFoundDevices([]);
    setShowDeviceList(false);

    try {
      const devices = await lanDeviceScanner.startScan((device) => {
        console.log("Found device:", device);
        setFoundDevices((prev) => {
          // Kiểm tra duplicate
          const isDuplicate = prev.some((d) => d.ip === device.ip);
          if (isDuplicate) {
            console.log("Duplicate device ignored:", device.ip);
            return prev;
          }
          const newDevices = [...prev, device];
          console.log("Updated devices list, total:", newDevices.length);
          return newDevices;
        });
        // Hiển thị modal ngay khi tìm thấy thiết bị đầu tiên
        console.log("Setting showDeviceList to true");
        setShowDeviceList(true);
      });

      console.log("Scan completed. Found devices:", devices);

      // Cập nhật danh sách thiết bị từ kết quả cuối cùng
      if (devices.length > 0) {
        setFoundDevices(devices);
        setShowDeviceList(true);
        console.log("Modal should be visible now, devices:", devices.length);
      } else {
        // Không tìm thấy thiết bị
        setShowDialog(true);
      }
    } catch (error: any) {
      console.error("Error scanning devices:", error);
      Alert.alert(
        "Lỗi quét mạng",
        error.message || "Không thể quét thiết bị trên mạng"
      );
    } finally {
      setIsScanning(false);
    }
  };

  const handleSelectDevice = (device: DeviceInfo) => {
    Alert.alert(
      "Kết nối thiết bị",
      `Bạn muốn kết nối với ${device.name}?\nIP: ${device.ip}${
        device.port ? `:${device.port}` : ""
      }`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Tiếp tục",
          onPress: () => {
            setShowDeviceList(false);
            // Navigate to camera setup screen
            router.push({
              pathname: "/camera-setup",
              params: {
                ip: device.ip,
                port: device.port || "80",
                name: device.name,
              },
            });
          },
        },
      ]
    );
  };

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (foundDevices.length === 0 && !showWifiOff) {
        setShowDialog(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [foundDevices, showWifiOff]);

  React.useEffect(() => {
    Animated.timing(centerContentPosition, {
      toValue: showDialog ? 280 : 95,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [showDialog]);

  React.useEffect(() => {
    if (showDialog && !showWifiOff) {
      const animateDots = () => {
        Animated.sequence([
          Animated.timing(dot1Opacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dot2Opacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dot3Opacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.parallel([
            Animated.timing(dot1Opacity, {
              toValue: 0,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(dot2Opacity, {
              toValue: 0,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(dot3Opacity, {
              toValue: 0,
              duration: 400,
              useNativeDriver: true,
            }),
          ]),
        ]).start(() => animateDots());
      };

      animateDots();
    } else {
      dot1Opacity.setValue(0);
      dot2Opacity.setValue(0);
      dot3Opacity.setValue(0);
    }
  }, [showDialog, showWifiOff]);

  const handleOpenSettings = () => {
    Linking.openSettings();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Log in button - Top Right */}
      <TouchableOpacity style={styles.loginButton}>
        <Text style={styles.loginText}>Đăng nhập</Text>
      </TouchableOpacity>

      {/* Demo Mode Button - Top Left for testing */}
      <TouchableOpacity style={styles.demoButton} onPress={addMockDevices}>
        <Text style={styles.demoText}>Demo</Text>
      </TouchableOpacity>

      {/* Stars background */}
      <Image
        source={require("../../assets/Onboarding Stars.png")}
        style={styles.starsBackground}
        resizeMode="cover"
      />

      {/* Radar/Locator background - full screen */}
      {!showWifiOff ? (
        <Image
          source={require("../../assets/Onboarding Locator.png")}
          style={styles.locatorBackground}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.wifiIconContainer}>
          <Svg width={120} height={120} viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 21C11.45 21 10.9793 20.8043 10.588 20.413C10.196 20.021 10 19.55 10 19C10 18.45 10.196 17.979 10.588 17.587C10.9793 17.1957 11.45 17 12 17C12.55 17 13.021 17.1957 13.413 17.587C13.8043 17.979 14 18.45 14 19C14 19.55 13.8043 20.021 13.413 20.413C13.021 20.8043 12.55 21 12 21ZM7.1 15.075L5.675 13.65C6.49167 12.8333 7.44167 12.1877 8.525 11.713C9.60833 11.2377 10.7667 11 12 11C13.2333 11 14.3917 11.2377 15.475 11.713C16.5583 12.1877 17.5083 12.8333 18.325 13.65L16.9 15.075C16.3 14.475 15.6083 14.0207 14.825 13.712C14.0417 13.404 13.2167 13.25 12.35 13.25H11.65C10.7833 13.25 9.95833 13.404 9.175 13.712C8.39167 14.0207 7.7 14.475 7.1 15.075ZM2.1 10.075L0.675 8.65C1.89167 7.43333 3.31667 6.479 4.95 5.787C6.58333 5.09567 8.275 4.75 10.025 4.75H13.975C15.725 4.75 17.4167 5.09567 19.05 5.787C20.6833 6.479 22.1083 7.43333 23.325 8.65L21.9 10.075C20.9 9.075 19.7333 8.29167 18.4 7.725C17.0667 7.15833 15.6333 6.875 14.1 6.875H9.9C8.36667 6.875 6.93333 7.15833 5.6 7.725C4.26667 8.29167 3.1 9.075 2.1 10.075Z"
              fill={colors.label.secondary}
              fillOpacity={0.6}
            />
          </Svg>
        </View>
      )}

      {/* Center content */}
      <Animated.View
        style={[styles.centerContent, { bottom: centerContentPosition }]}
      >
        {!showWifiOff ? (
          <>
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
            <View style={styles.titleContainer}>
              <Text style={styles.title}>
                {showDialog ? "Vẫn đang tìm kiếm" : "Đang tìm camera"}
              </Text>
              {showDialog && (
                <View style={styles.dotsContainer}>
                  <Animated.Text style={[styles.dot, { opacity: dot1Opacity }]}>
                    .
                  </Animated.Text>
                  <Animated.Text style={[styles.dot, { opacity: dot2Opacity }]}>
                    .
                  </Animated.Text>
                  <Animated.Text style={[styles.dot, { opacity: dot3Opacity }]}>
                    .
                  </Animated.Text>
                </View>
              )}
            </View>
            <Text style={styles.description}>
              Hãy đảm bảo camera của bạn đã được bật và kết nối chung với mạng
              điện thoại của bạn để tiếp tục
            </Text>
          </>
        ) : (
          <>
            {/* WiFi Off Content */}
            <Text style={styles.wifiTitle}>WiFi chưa kết nối</Text>
            <Text style={styles.wifiDescription}>
              Camera cần kết nối cùng mạng WiFi với điện thoại để thiết lập.
              {"\n"}
              Vui lòng kiểm tra kết nối WiFi trong cài đặt.
            </Text>
            <Button
              title="Mở cài đặt WiFi"
              onPress={handleOpenSettings}
              style={styles.settingsButton}
              variant="transparent"
            />
          </>
        )}
      </Animated.View>

      {/* Dialog */}
      <Dialog
        visible={showDialog && !showWifiOff}
        onClose={() => setShowDialog(false)}
        title="Vấn đề cần được giải quyết"
        message="Camera đã kết nối cùng mạng WiFi chưa?"
        buttons={[
          {
            title: "Chưa",
            onPress: () => {
              setShowDialog(false);
              setShowWifiOff(true);
            },
          },
          {
            title: "Tiếp tục",
            onPress: () => {
              setShowDialog(false);
              startDeviceScan(); // Quét lại
            },
          },
        ]}
      />

      {/* Device List Modal */}
      <Modal
        visible={showDeviceList}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDeviceList(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Tìm thấy thiết bị ({foundDevices.length})
              </Text>
              <TouchableOpacity
                onPress={() => setShowDeviceList(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.modalDescription}>Chọn camera để kết nối</Text>

            <FlatList
              data={foundDevices}
              keyExtractor={(item, index) => `${item.ip}-${index}`}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.deviceItem}
                  onPress={() => handleSelectDevice(item)}
                >
                  <View style={styles.deviceIconContainer}>
                    <Svg width={32} height={32} viewBox="0 0 24 24" fill="none">
                      <Path
                        d="M17 10.5V7C17 6.45 16.55 6 16 6H4C3.45 6 3 6.45 3 7V17C3 17.55 3.45 18 4 18H16C16.55 18 17 17.55 17 17V13.5L21 17.5V6.5L17 10.5Z"
                        fill={colors.white}
                      />
                    </Svg>
                  </View>
                  <View style={styles.deviceInfo}>
                    <Text style={styles.deviceName}>{item.name}</Text>
                    <Text style={styles.deviceIP}>
                      {item.ip}
                      {item.port ? `:${item.port}` : ""}
                    </Text>
                  </View>
                  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z"
                      fill={colors.label.tertiary}
                    />
                  </Svg>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View style={styles.emptyList}>
                  <Text style={styles.emptyListText}>
                    {isScanning
                      ? "Đang tìm kiếm..."
                      : "Chưa tìm thấy thiết bị nào"}
                  </Text>
                </View>
              }
              style={styles.deviceList}
              contentContainerStyle={styles.deviceListContent}
            />

            {isScanning && (
              <View style={styles.scanningIndicator}>
                <Text style={styles.scanningText}>Đang tìm kiếm...</Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1c1c1e",
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
  demoButton: {
    position: "absolute",
    top: 10,
    left: 0,
    zIndex: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.systemBlue,
    borderRadius: 8,
    marginLeft: 10,
  },
  demoText: {
    fontSize: 15,
    fontFamily: typography.fontFamily.semibold,
    color: colors.white,
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
  wifiIconContainer: {
    position: "absolute",
    width: 200,
    height: 200,
    top: "35%",
    alignSelf: "center",
    opacity: 0.8,
    justifyContent: "center",
    alignItems: "center",
  },
  centerContent: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 40,
  },
  searchIconContainer: {
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontFamily: typography.fontFamily.semibold,
    lineHeight: 28,
    color: colors.label.primary,
    textAlign: "center",
  },
  dotsContainer: {
    flexDirection: "row",
    marginLeft: 4,
    width: 30,
  },
  dot: {
    fontSize: 22,
    fontFamily: typography.fontFamily.semibold,
    lineHeight: 28,
    color: colors.label.primary,
  },
  description: {
    fontSize: 13,
    fontFamily: typography.fontFamily.regular,
    lineHeight: 18,
    color: colors.label.secondary,
    textAlign: "center",
  },
  wifiTitle: {
    fontSize: 28,
    fontFamily: typography.fontFamily.bold,
    lineHeight: 34,
    color: colors.label.primary,
    marginBottom: 16,
    textAlign: "center",
  },
  wifiDescription: {
    fontSize: 15,
    fontFamily: typography.fontFamily.regular,
    lineHeight: 20,
    color: colors.label.secondary,
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  settingsButton: {
    paddingVertical: 16,
    paddingHorizontal: 40,
    minWidth: 200,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.systemBackground.primary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
    minHeight: 300,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontFamily: typography.fontFamily.bold,
    color: colors.label.primary,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.fill.tertiary,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 20,
    color: colors.label.secondary,
  },
  modalDescription: {
    fontSize: 15,
    fontFamily: typography.fontFamily.regular,
    color: colors.label.secondary,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  deviceList: {
    minHeight: 200,
  },
  deviceListContent: {
    paddingHorizontal: 20,
    flexGrow: 1,
  },
  deviceItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.systemBackground.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  deviceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.fill.tertiary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 17,
    fontFamily: typography.fontFamily.semibold,
    color: colors.label.primary,
    marginBottom: 4,
  },
  deviceIP: {
    fontSize: 13,
    fontFamily: typography.fontFamily.regular,
    color: colors.label.secondary,
  },
  scanningIndicator: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  scanningText: {
    fontSize: 13,
    fontFamily: typography.fontFamily.regular,
    color: colors.label.tertiary,
  },
  emptyList: {
    paddingVertical: 40,
    alignItems: "center",
  },
  emptyListText: {
    fontSize: 15,
    fontFamily: typography.fontFamily.regular,
    color: colors.label.secondary,
  },
});
