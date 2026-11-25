export type GrainType = 'rice' | 'wheat' | 'corn' | 'barley';

export type SiloStatus = 'optimal' | 'warning' | 'critical';

export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export type VentMode = 'auto' | 'manual';

export type TempUnit = 'C' | 'F';

export type AlertType =
  | 'high_temp'
  | 'high_humidity'
  | 'excess_moisture'
  | 'high_co2'
  | 'high_risk'
  | 'vent_activated';

export type AlertSeverity = 'warning' | 'critical' | 'info';

export type TimeRange = '24h' | '7d' | '30d';

export interface Telemetry {
  temperature: number;
  moisture: number;
  humidity: number;
  co2: number;
}

export interface GrainThresholds {
  maxTemperature: number;
  maxMoisture: number;
  warningTemperature: number;
  warningMoisture: number;
  maxHumidity: number;
  maxCo2: number;
  warningCo2: number;
  warningHumidity: number;
}

export interface VentActivation {
  timestamp: number;
  reason: string;
  binId: number;
}

export interface AlertItem {
  id: string;
  binId: number;
  binName: string;
  type: AlertType;
  severity: AlertSeverity;
  message: string;
  timestamp: number;
}

export interface RiskAssessment {
  score: number;
  level: RiskLevel;
  factors: { label: string; contribution: number }[];
  recommendation: string;
}

export interface HistoryPoint {
  time: number;
  temperature: number;
  humidity: number;
  moisture: number;
  co2: number;
  risk: number;
}

export interface Silo {
  id: number;
  name: string;
  grainType: GrainType;
  grainLabel: string;
  location: string;
  capacityKg: number;
  currentKg: number;
  thresholds: GrainThresholds;
  telemetry: Telemetry;
  ventilation: boolean;
  ventMode: VentMode;
  tempHistory: number[];
  humidityHistory: number[];
  moistureHistory: number[];
  co2History: number[];
  riskHistory: number[];
  unfavorableSeconds: number;
  lastSensorUpdate: number;
  ventHistory: VentActivation[];
}
