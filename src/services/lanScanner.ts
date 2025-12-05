import NetInfo from "@react-native-community/netinfo";

export interface DeviceInfo {
  name: string;
  ip: string;
  mac?: string;
  type: "camera" | "unknown";
  port?: number;
}

/**
 * Service để tìm kiếm thiết bị trên mạng LAN
 * Sử dụng HTTP requests để phát hiện thiết bị
 */
class LANDeviceScanner {
  private devices: Map<string, DeviceInfo> = new Map();
  private scanning: boolean = false;
  private abortController: AbortController | null = null;

  // Ports phổ biến cho camera IP
  private readonly COMMON_CAMERA_PORTS = [80, 8080, 554, 8888, 5000];
  private readonly SCAN_TIMEOUT = 5000; // 5 giây
  private readonly REQUEST_TIMEOUT = 1000; // 1 giây cho mỗi request

  /**
   * Bắt đầu quét thiết bị trên mạng LAN
   */
  async startScan(
    onDeviceFound?: (device: DeviceInfo) => void
  ): Promise<DeviceInfo[]> {
    if (this.scanning) {
      console.log("Scan is already in progress");
      return Array.from(this.devices.values());
    }

    this.scanning = true;
    this.devices.clear();
    this.abortController = new AbortController();

    try {
      // Kiểm tra kết nối mạng
      const networkState = await NetInfo.fetch();

      if (!networkState.isConnected || networkState.type !== "wifi") {
        throw new Error("Device is not connected to WiFi");
      }

      // Lấy thông tin IP của thiết bị
      const ipAddress = networkState.details?.ipAddress;
      if (!ipAddress) {
        throw new Error("Could not get device IP address");
      }

      console.log("Device IP:", ipAddress);

      // Quét IP range
      const devices = await this.scanIPRange(ipAddress, 1, 254, onDeviceFound);

      return devices;
    } catch (error) {
      throw error;
    } finally {
      this.scanning = false;
      this.abortController = null;
    }
  }

  /**
   * Dừng quét
   */
  stopScan() {
    this.scanning = false;

    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }

  /**
   * Quét IP range cụ thể
   */
  async scanIPRange(
    deviceIP: string,
    startRange: number = 1,
    endRange: number = 254,
    onDeviceFound?: (device: DeviceInfo) => void
  ): Promise<DeviceInfo[]> {
    const ipParts = deviceIP.split(".");
    const baseIPPrefix = `${ipParts[0]}.${ipParts[1]}.${ipParts[2]}`;

    console.log(
      `Scanning IP range: ${baseIPPrefix}.${startRange} - ${baseIPPrefix}.${endRange}`
    );

    // Quét song song nhưng giới hạn số lượng để tránh quá tải
    const batchSize = 10; // Quét 10 IP cùng lúc
    const allDevices: DeviceInfo[] = [];

    for (let i = startRange; i <= endRange; i += batchSize) {
      if (!this.scanning) break;

      const batch = [];
      const end = Math.min(i + batchSize - 1, endRange);

      for (let j = i; j <= end; j++) {
        const targetIP = `${baseIPPrefix}.${j}`;

        // Bỏ qua IP của chính thiết bị
        if (targetIP === deviceIP) continue;

        batch.push(this.checkDevice(targetIP));
      }

      const results = await Promise.allSettled(batch);

      results.forEach((result) => {
        if (result.status === "fulfilled" && result.value) {
          const device = result.value;

          if (!this.devices.has(device.ip)) {
            this.devices.set(device.ip, device);
            allDevices.push(device);
            console.log("Found device:", device);

            if (onDeviceFound) {
              onDeviceFound(device);
            }
          }
        }
      });

      // Delay nhỏ giữa các batch
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    return allDevices;
  }

  /**
   * Kiểm tra thiết bị tại IP cụ thể
   */
  private async checkDevice(ip: string): Promise<DeviceInfo | null> {
    // Thử kết nối đến port 80 trước (phổ biến nhất)
    try {
      const result = await this.checkHTTPEndpoint(ip, 80);
      if (result) {
        return {
          name: `Device ${ip}`,
          ip: ip,
          port: 80,
          type: "camera",
        };
      }
    } catch (error) {
      // Bỏ qua lỗi, tiếp tục
    }

    return null;
  }

  /**
   * Kiểm tra HTTP endpoint có khả dụng không
   */
  private async checkHTTPEndpoint(ip: string, port: number): Promise<boolean> {
    const url = `http://${ip}:${port}`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        this.REQUEST_TIMEOUT
      );

      const response = await fetch(url, {
        method: "HEAD", // Dùng HEAD thay vì GET để nhanh hơn
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Chỉ coi là thiết bị nếu có response code hợp lệ (200-499)
      // 200-299: Success, 300-399: Redirect, 400-499: Client errors (nhưng server tồn tại)
      return response.status >= 200 && response.status < 500;
    } catch (error: any) {
      // Bất kỳ lỗi nào khác đều không coi là có thiết bị
      return false;
    }
  }
}

export const lanDeviceScanner = new LANDeviceScanner();
