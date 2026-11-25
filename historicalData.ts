import type { HistoryPoint, TimeRange, Silo } from '@/types';

const POINT_COUNT = 48;

function generateSeed(base: number, variance: number, points: number, seed: number): number[] {
  const result: number[] = [];
  let val = base;
  let s = seed;
  for (let i = 0; i < points; i++) {
    s = (s * 9301 + 49297) % 233280;
    const rand = s / 233280;
    val = val + (rand - 0.5) * variance;
    val = Math.max(base - variance, Math.min(base + variance, val));
    result.push(val);
  }
  return result;
}

export function generateHistory(silo: Silo, range: TimeRange): HistoryPoint[] {
  const now = Date.now();
  const rangeMs =
    range === '24h' ? 24 * 3600 * 1000 : range === '7d' ? 7 * 24 * 3600 * 1000 : 30 * 24 * 3600 * 1000;

  const temps = generateSeed(silo.telemetry.temperature, 3, POINT_COUNT, silo.id * 100 + 7);
  const humids = generateSeed(silo.telemetry.humidity, 8, POINT_COUNT, silo.id * 200 + 13);
  const moist = generateSeed(silo.telemetry.moisture, 1.5, POINT_COUNT, silo.id * 300 + 29);
  const co2s = generateSeed(silo.telemetry.co2, 80, POINT_COUNT, silo.id * 400 + 41);

  return temps.map((temp, i) => {
    const tempScore = Math.min((temp / silo.thresholds.maxTemperature) * 28, 40);
    const humidScore = Math.min((humids[i] / silo.thresholds.maxHumidity) * 22, 32);
    const moistScore = Math.min((moist[i] / silo.thresholds.maxMoisture) * 25, 35);
    const co2Score = Math.min((co2s[i] / silo.thresholds.maxCo2) * 15, 25);
    const risk = Math.round(Math.min(tempScore + humidScore + moistScore + co2Score, 100));

    return {
      time: now - rangeMs + (i / (POINT_COUNT - 1)) * rangeMs,
      temperature: Number(temp.toFixed(1)),
      humidity: Math.round(humids[i]),
      moisture: Number(moist[i].toFixed(1)),
      co2: Math.round(co2s[i]),
      risk,
    };
  });
}

export function formatTimeLabel(timestamp: number, range: TimeRange): string {
  const d = new Date(timestamp);
  if (range === '24h') {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}
