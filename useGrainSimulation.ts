import { useCallback, useEffect, useRef, useState } from 'react';
import type { Silo, Telemetry, SiloStatus, AlertItem, VentMode } from '@/types';
import { computeRisk } from '@/lib/risk';

const HISTORY_LEN = 20;
const TICK_MS = 3000;

const INITIAL_SILOS: Silo[] = [
  {
    id: 1,
    name: 'Bin A-01',
    grainType: 'rice',
    grainLabel: 'Rice',
    location: 'Warehouse 1 · North',
    capacityKg: 50000,
    currentKg: 38200,
    thresholds: {
      maxTemperature: 22,
      warningTemperature: 19,
      maxMoisture: 13.0,
      warningMoisture: 11.5,
      maxHumidity: 70,
      warningHumidity: 60,
      maxCo2: 800,
      warningCo2: 600,
    },
    telemetry: { temperature: 18.4, moisture: 11.8, humidity: 58, co2: 420 },
    ventilation: true,
    ventMode: 'auto',
    tempHistory: [17.9, 18.1, 18.0, 18.3, 18.2, 18.4, 18.4],
    humidityHistory: [55, 56, 57, 56, 58, 58, 58],
    moistureHistory: [11.5, 11.6, 11.7, 11.7, 11.8, 11.8, 11.8],
    co2History: [400, 410, 415, 418, 420, 420, 420],
    riskHistory: [18, 20, 19, 22, 21, 23, 23],
    unfavorableSeconds: 0,
    lastSensorUpdate: Date.now(),
    ventHistory: [],
  },
];

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

function computeNext(prev: Telemetry, ventilation: boolean): Telemetry {
  const tempBase = ventilation ? -0.35 : 0.18;
  const humidityBase = ventilation ? -0.6 : 0.35;
  const co2Base = ventilation ? -12 : 8;

  return {
    temperature: clamp(
      prev.temperature + tempBase + (Math.random() - 0.5) * 0.7,
      10,
      38
    ),
    moisture: clamp(
      prev.moisture + (ventilation ? -0.05 : 0.03) + (Math.random() - 0.5) * 0.3,
      8,
      22
    ),
    humidity: clamp(
      prev.humidity + humidityBase + (Math.random() - 0.5) * 2.5,
      30,
      98
    ),
    co2: clamp(
      prev.co2 + co2Base + (Math.random() - 0.5) * 25,
      350,
      1600
    ),
  };
}

export function computeStatus(silo: Silo): SiloStatus {
  const { telemetry: t, thresholds: th } = silo;
  const overMax =
    t.temperature > th.maxTemperature ||
    t.moisture > th.maxMoisture ||
    t.co2 > th.maxCo2 ||
    t.humidity > th.maxHumidity;
  if (overMax) return 'critical';
  const overWarning =
    t.temperature > th.warningTemperature ||
    t.moisture > th.warningMoisture ||
    t.co2 > th.warningCo2 ||
    t.humidity > th.warningHumidity;
  if (overWarning) return 'warning';
  return 'optimal';
}

function checkUnfavorable(silo: Silo): boolean {
  const { telemetry: t, thresholds: th } = silo;
  return (
    t.temperature > th.warningTemperature ||
    t.moisture > th.warningMoisture ||
    t.humidity > th.warningHumidity ||
    t.co2 > th.warningCo2
  );
}

function shouldAutoVent(silo: Silo): { on: boolean; reason: string } {
  const { telemetry: t, thresholds: th } = silo;
  const reasons: string[] = [];
  if (t.temperature > th.maxTemperature) reasons.push(`Temperature ${t.temperature.toFixed(1)}°C exceeds max ${th.maxTemperature}°C`);
  if (t.humidity > th.maxHumidity) reasons.push(`Humidity ${t.humidity.toFixed(0)}% exceeds max ${th.maxHumidity}%`);
  if (t.moisture > th.maxMoisture) reasons.push(`Moisture ${t.moisture.toFixed(1)}% exceeds max ${th.maxMoisture}%`);
  if (t.co2 > th.maxCo2) reasons.push(`CO₂ ${t.co2.toFixed(0)} ppm exceeds max ${th.maxCo2} ppm`);
  const risk = computeRisk(silo);
  if (risk.level === 'HIGH' || risk.level === 'CRITICAL') reasons.push(`Spoilage risk is ${risk.level}`);

  if (reasons.length > 0) return { on: true, reason: reasons.join(', ') };

  const allSafe =
    t.temperature < th.warningTemperature &&
    t.humidity < th.warningHumidity &&
    t.moisture < th.warningMoisture &&
    t.co2 < th.warningCo2;
  if (allSafe) return { on: false, reason: '' };

  return { on: false, reason: '' };
}

let alertIdCounter = 0;

function generateAlerts(silos: Silo[]): AlertItem[] {
  const alerts: AlertItem[] = [];
  for (const silo of silos) {
    const { telemetry: t, thresholds: th } = silo;
    const risk = computeRisk(silo);
    const now = Date.now();

    if (t.temperature > th.maxTemperature) {
      alerts.push({ id: `a${++alertIdCounter}`, binId: silo.id, binName: silo.name, type: 'high_temp', severity: 'critical', message: `Temperature ${t.temperature.toFixed(1)}°C exceeds safe max ${th.maxTemperature}°C`, timestamp: now });
    }
    if (t.humidity > th.maxHumidity) {
      alerts.push({ id: `a${++alertIdCounter}`, binId: silo.id, binName: silo.name, type: 'high_humidity', severity: 'critical', message: `Humidity ${t.humidity.toFixed(0)}% exceeds safe max ${th.maxHumidity}%`, timestamp: now });
    }
    if (t.moisture > th.maxMoisture) {
      alerts.push({ id: `a${++alertIdCounter}`, binId: silo.id, binName: silo.name, type: 'excess_moisture', severity: 'critical', message: `Grain moisture ${t.moisture.toFixed(1)}% exceeds safe max ${th.maxMoisture}%`, timestamp: now });
    }
    if (t.co2 > th.maxCo2) {
      alerts.push({ id: `a${++alertIdCounter}`, binId: silo.id, binName: silo.name, type: 'high_co2', severity: 'critical', message: `CO₂ ${t.co2.toFixed(0)} ppm exceeds safe max ${th.maxCo2} ppm`, timestamp: now });
    }
    if (risk.level === 'HIGH' || risk.level === 'CRITICAL') {
      alerts.push({ id: `a${++alertIdCounter}`, binId: silo.id, binName: silo.name, type: 'high_risk', severity: risk.level === 'CRITICAL' ? 'critical' : 'warning', message: `Spoilage risk is ${risk.level} (score ${risk.score})`, timestamp: now });
    }
    if (silo.ventilation && silo.ventHistory.length > 0) {
      const last = silo.ventHistory[silo.ventHistory.length - 1];
      if (now - last.timestamp < TICK_MS * 2) {
        alerts.push({ id: `a${++alertIdCounter}`, binId: silo.id, binName: silo.name, type: 'vent_activated', severity: 'info', message: `Ventilation activated: ${last.reason}`, timestamp: last.timestamp });
      }
    }
  }
  return alerts.sort((a, b) => b.timestamp - a.timestamp);
}

export function useGrainSimulation() {
  const [silos, setSilos] = useState<Silo[]>(INITIAL_SILOS);
  const [simulating, setSimulating] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!simulating) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
      return;
    }

    intervalRef.current = setInterval(() => {
      setSilos((prev) =>
        prev.map((silo) => {
          const nextTelemetry = computeNext(silo.telemetry, silo.ventilation);
          const tempSilo = { ...silo, telemetry: nextTelemetry };
          const unfavorable = checkUnfavorable(tempSilo);
          const unfavorableSeconds = unfavorable
            ? silo.unfavorableSeconds + TICK_MS / 1000
            : Math.max(0, silo.unfavorableSeconds - 5);

          const risk = computeRisk({ ...tempSilo, unfavorableSeconds });

          let ventilation = silo.ventilation;
          let ventHistory = silo.ventHistory;
          let ventMode = silo.ventMode;

          if (silo.ventMode === 'auto') {
            const decision = shouldAutoVent({ ...tempSilo, unfavorableSeconds });
            if (decision.on && !silo.ventilation) {
              ventilation = true;
              ventHistory = [
                ...ventHistory.slice(-9),
                { timestamp: Date.now(), reason: decision.reason, binId: silo.id },
              ];
            } else if (!decision.on && silo.ventilation) {
              ventilation = false;
            }
          }

          return {
            ...silo,
            telemetry: nextTelemetry,
            ventilation,
            ventMode,
            unfavorableSeconds,
            lastSensorUpdate: Date.now(),
            tempHistory: [...silo.tempHistory.slice(1), nextTelemetry.temperature].slice(-HISTORY_LEN),
            humidityHistory: [...silo.humidityHistory.slice(1), nextTelemetry.humidity].slice(-HISTORY_LEN),
            moistureHistory: [...silo.moistureHistory.slice(1), nextTelemetry.moisture].slice(-HISTORY_LEN),
            co2History: [...silo.co2History.slice(1), nextTelemetry.co2].slice(-HISTORY_LEN),
            riskHistory: [...silo.riskHistory.slice(1), risk.score].slice(-HISTORY_LEN),
            ventHistory,
          };
        })
      );
      setLastUpdate(new Date());
    }, TICK_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [simulating]);

  useEffect(() => {
    setAlerts(generateAlerts(silos));
  }, [silos]);

  const toggleVentilation = useCallback((id: number) => {
    setSilos((prev) =>
      prev.map((s) =>
        s.id === id && s.ventMode === 'manual'
          ? { ...s, ventilation: !s.ventilation }
          : s
      )
    );
  }, []);

  const setVentMode = useCallback((id: number, mode: VentMode) => {
    setSilos((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ventMode: mode } : s))
    );
  }, []);

  const toggleSimulation = useCallback(() => setSimulating((s) => !s), []);

  return {
    silos,
    simulating,
    lastUpdate,
    alerts,
    toggleVentilation,
    setVentMode,
    toggleSimulation,
  };
}
