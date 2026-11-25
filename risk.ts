import type { Silo, RiskAssessment, RiskLevel } from '@/types';

function levelFromScore(score: number): RiskLevel {
  if (score <= 25) return 'LOW';
  if (score <= 50) return 'MODERATE';
  if (score <= 75) return 'HIGH';
  return 'CRITICAL';
}

function recommendationFor(level: RiskLevel, topFactor: string): string {
  switch (level) {
    case 'LOW':
      return 'Conditions are stable. Continue routine monitoring.';
    case 'MODERATE':
      return `Monitor closely — ${topFactor} is approaching unsafe levels. Consider preventive ventilation.`;
    case 'HIGH':
      return `Activate ventilation immediately. ${topFactor} has exceeded safe thresholds. Inspect grain for early spoilage signs.`;
    case 'CRITICAL':
      return `Urgent action required. ${topFactor} is critically high. Ventilate, inspect, and consider transferring grain to a dry bin.`;
  }
}

export function computeRisk(silo: Silo): RiskAssessment {
  const { telemetry: t, thresholds: th, unfavorableSeconds } = silo;

  const tempRatio = Math.min(t.temperature / th.maxTemperature, 1.5);
  const humidRatio = Math.min(t.humidity / th.maxHumidity, 1.5);
  const moistRatio = Math.min(t.moisture / th.maxMoisture, 1.5);
  const co2Ratio = Math.min(t.co2 / th.maxCo2, 1.5);

  const tempScore = Math.min(tempRatio * 28, 40);
  const humidScore = Math.min(humidRatio * 22, 32);
  const moistScore = Math.min(moistRatio * 25, 35);
  const co2Score = Math.min(co2Ratio * 15, 25);

  const durationMinutes = unfavorableSeconds / 60;
  const durationScore = Math.min(durationMinutes * 0.4, 18);

  const raw = tempScore + humidScore + moistScore + co2Score + durationScore;
  const score = Math.round(Math.min(raw, 100));

  const factors = [
    { label: 'Temperature', contribution: Math.round(tempScore) },
    { label: 'Humidity', contribution: Math.round(humidScore) },
    { label: 'Grain Moisture', contribution: Math.round(moistScore) },
    { label: 'CO₂ Level', contribution: Math.round(co2Score) },
    { label: 'Duration', contribution: Math.round(durationScore) },
  ]
    .filter((f) => f.contribution > 0)
    .sort((a, b) => b.contribution - a.contribution);

  const level = levelFromScore(score);
  const topFactor = factors.length > 0 ? factors[0].label.toLowerCase() : 'no factor';
  const recommendation = recommendationFor(level, topFactor);

  return { score, level, factors, recommendation };
}

export function riskColor(level: RiskLevel): string {
  switch (level) {
    case 'LOW':
      return 'text-emerald-400';
    case 'MODERATE':
      return 'text-amber-400';
    case 'HIGH':
      return 'text-orange-400';
    case 'CRITICAL':
      return 'text-red-400';
  }
}

export function riskBgColor(level: RiskLevel): string {
  switch (level) {
    case 'LOW':
      return 'bg-emerald-500';
    case 'MODERATE':
      return 'bg-amber-500';
    case 'HIGH':
      return 'bg-orange-500';
    case 'CRITICAL':
      return 'bg-red-500';
  }
}

export function riskBorderColor(level: RiskLevel): string {
  switch (level) {
    case 'LOW':
      return 'border-emerald-500/30';
    case 'MODERATE':
      return 'border-amber-500/30';
    case 'HIGH':
      return 'border-orange-500/30';
    case 'CRITICAL':
      return 'border-red-500/30';
  }
}
