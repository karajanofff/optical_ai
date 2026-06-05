import { useEffect, useState } from "react";

import { getWebSocketUrl, metricsApi } from "../services/api";
import type { MetricSnapshot } from "../types";

export function useLiveMetrics() {
  const [metrics, setMetrics] = useState<MetricSnapshot[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    metricsApi.live().then(setMetrics).catch(() => undefined);
    const socket = new WebSocket(getWebSocketUrl());
    socket.onopen = () => setConnected(true);
    socket.onclose = () => setConnected(false);
    socket.onerror = () => setConnected(false);
    socket.onmessage = (event) => {
      try {
        setMetrics(JSON.parse(event.data) as MetricSnapshot[]);
      } catch {
        setConnected(false);
      }
    };
    return () => socket.close();
  }, []);

  return { metrics, connected };
}
