import axios from "axios";

import type {
  AlertItem,
  AuthResponse,
  Device,
  DeviceMetric,
  MetricSnapshot,
  OpticalLine,
  PredictionResult,
  SummaryReport
} from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("optical-ai-token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: async (username: string, password: string) => {
    const { data } = await api.post<AuthResponse>("/auth/login", { username, password });
    return data;
  }
};

export const devicesApi = {
  list: async () => (await api.get<Device[]>("/devices")).data,
  get: async (id: number) => (await api.get<Device>(`/devices/${id}`)).data,
  create: async (payload: Omit<Device, "id">) => (await api.post<Device>("/devices", payload)).data,
  update: async (id: number, payload: Omit<Device, "id">) => (await api.put<Device>(`/devices/${id}`, payload)).data,
  remove: async (id: number) => api.delete(`/devices/${id}`),
  metrics: async (id: number) => (await api.get<DeviceMetric[]>(`/devices/${id}/metrics`)).data
};

export const alertsApi = {
  list: async () => (await api.get<AlertItem[]>("/alerts")).data,
  markRead: async (id: number, isRead: boolean) => (await api.patch<AlertItem>(`/alerts/${id}`, { is_read: isRead })).data
};

export const reportsApi = {
  summary: async () => (await api.get<SummaryReport>("/reports/summary")).data
};

export const metricsApi = {
  live: async () => (await api.get<MetricSnapshot[]>("/metrics/live")).data
};

export const aiApi = {
  predict: async (payload: Omit<MetricSnapshot, "device_id" | "device_name" | "status" | "ai_state" | "timestamp">) =>
    (await api.post<PredictionResult>("/ai/predict", payload)).data
};

export const topologyApi = {
  lines: async () => (await api.get<OpticalLine[]>("/topology/lines")).data
};

export const getWebSocketUrl = () => {
  const rawBase = import.meta.env.VITE_WS_URL ?? "ws://localhost:8000/api";
  return `${rawBase}/metrics/ws/live`;
};
