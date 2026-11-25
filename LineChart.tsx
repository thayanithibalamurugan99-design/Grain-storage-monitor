interface LineChartProps {
  data: { time: number; value: number }[];
  color: string;
  height?: number;
  yLabel?: string;
  threshold?: number;
  formatLabel?: (time: number) => string;
}

export default function LineChart({
  data,
  color,
  height = 160,
  threshold,
  formatLabel,
}: LineChartProps) {
  const width = 600;
  const padding = { top: 16, right: 8, bottom: 28, left: 36 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  if (data.length < 2) {
    return <div style={{ height }} className="w-full" />;
  }

  const values = data.map((d) => d.value);
  const allVals = threshold ? [...values, threshold] : values;
  const min = Math.min(...allVals);
  const max = Math.max(...allVals);
  const range = max - min || 1;
  const padRange = range * 0.15;
  const yMin = min - padRange;
  const yMax = max + padRange;
  const yRange = yMax - yMin;

  const points = data.map((d, i) => {
    const x = padding.left + (i / (data.length - 1)) * innerW;
    const y = padding.top + (1 - (d.value - yMin) / yRange) * innerH;
    return { x, y, value: d.value, time: d.time };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(' ');

  const areaPath =
    `M ${points[0].x.toFixed(2)} ${padding.top + innerH} ` +
    points.map((p) => `L ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' ') +
    ` L ${points[points.length - 1].x.toFixed(2)} ${padding.top + innerH} Z`;

  const yTicks = 4;
  const yTickValues = Array.from({ length: yTicks + 1 }, (_, i) => yMin + (yRange / yTicks) * i);

  const labelStep = Math.max(1, Math.floor(data.length / 6));
  const labels = data.filter((_, i) => i % labelStep === 0 || i === data.length - 1);

  let thresholdY = 0;
  if (threshold !== undefined) {
    thresholdY = padding.top + (1 - (threshold - yMin) / yRange) * innerH;
  }

  const gradId = `linechart-grad-${color.replace(/[^a-z0-9]/g, '')}`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full"
      style={{ height }}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Y-axis grid lines + labels */}
      {yTickValues.map((val, i) => {
        const y = padding.top + (1 - (val - yMin) / yRange) * innerH;
        return (
          <g key={i}>
            <line
              x1={padding.left}
              y1={y}
              x2={width - padding.right}
              y2={y}
              stroke="rgba(51,65,85,0.3)"
              strokeWidth="0.5"
            />
            <text
              x={padding.left - 6}
              y={y + 3}
              textAnchor="end"
              className="fill-slate-500"
              fontSize="9"
            >
              {val.toFixed(val < 10 ? 1 : 0)}
            </text>
          </g>
        );
      })}

      {/* Threshold line */}
      {threshold !== undefined && (
        <g>
          <line
            x1={padding.left}
            y1={thresholdY}
            x2={width - padding.right}
            y2={thresholdY}
            stroke="rgba(248,113,113,0.4)"
            strokeWidth="1"
            strokeDasharray="4 3"
          />
          <text
            x={width - padding.right}
            y={thresholdY - 4}
            textAnchor="end"
            className="fill-red-400/60"
            fontSize="8"
          >
            max
          </text>
        </g>
      )}

      {/* Area + line */}
      <path d={areaPath} fill={`url(#${gradId})`} className={color} />
      <path
        d={linePath}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={color}
      />

      {/* Last point dot */}
      <circle
        cx={points[points.length - 1].x}
        cy={points[points.length - 1].y}
        r="3"
        fill="currentColor"
        className={color}
      />

      {/* X-axis labels */}
      {labels.map((d, i) => {
        const idx = data.indexOf(d);
        const x = padding.left + (idx / (data.length - 1)) * innerW;
        return (
          <text
            key={i}
            x={x}
            y={height - 8}
            textAnchor="middle"
            className="fill-slate-500"
            fontSize="9"
          >
            {formatLabel ? formatLabel(d.time) : ''}
          </text>
        );
      })}
    </svg>
  );
}
