export type UserRole = "admin" | "operator";

export interface AuthResponse {
  access_token: string;
  token_type: string;
  role: UserRole;
  username: string;
}

export interface Device {
  id: number;
  name: string;
  device_type: string;
  location: string;
  ip_address: string;
  status: string;
  signal_strength: number;
  latency: number;
  packet_loss: number;
  traffic_load: number;
  uptime: number;
  temperature: number;
}

export interface AlertItem {
  id: number;
  device_id: number;
  device_name: string;
  title: string;
  message: string;
  severity: string;
  is_read: boolean;
  created_at: string;
  recommendations: string[];
}

export interface MetricSnapshot {
  device_id: number;
  device_name: string;
  status: string;
  signal_strength: number;
  latency: number;
  packet_loss: number;
  traffic_load: number;
  uptime: number;
  temperature: number;
  ai_state: string;
  timestamp: string;
}

export interface DeviceMetric {
  id: number;
  device_id: number;
  signal_strength: number;
  latency: number;
  packet_loss: number;
  traffic_load: number;
  uptime: number;
  temperature: number;
  created_at: string;
}

export interface SummaryReport {
  total_devices: number;
  online_devices: number;
  offline_devices: number;
  warning_devices: number;
  anomaly_count: number;
  average_signal: number;
  average_latency: number;
  average_packet_loss: number;
  health_score: number;
  alerts_today: number;
  alerts_this_week: number;
}

export interface PredictionResult {
  prediction: string;
  confidence: number;
}

export interface OpticalLine {
  id: number;
  name: string;
  source_device_id: number;
  target_device_id: number;
  source_device_name: string;
  target_device_name: string;
  fiber_type: string;
  length_km: number;
  attenuation_db: number;
  signal_loss_db: number;
  utilization_percent: number;
  status: string;
  last_update_time: string;
}
