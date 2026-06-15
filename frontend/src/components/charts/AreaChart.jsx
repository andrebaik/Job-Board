import { useCallback, useState } from "react";
import { motion } from "motion/react";
import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function toGradientId(label) {
  return `gradient-${label.replace(/\s+/g, "-").toLowerCase()}`;
}

function AreaChart({ data, lines, xKey = "date", height = 300 }) {
  const [tooltip, setTooltip] = useState({
    active: false,
    x: 0,
    y: 0,
    label: "",
    payload: null,
  });

  const handleMouseMove = useCallback((nextState, event) => {
    const { activePayload, activeLabel, isTooltipActive } = nextState;
    setTooltip({
      active: isTooltipActive && activePayload?.length > 0,
      x: event.clientX,
      y: event.clientY,
      label: activeLabel,
      payload: activePayload,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTooltip((prev) => ({ ...prev, active: false }));
  }, []);

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={height}>
        <RechartsAreaChart
          data={data}
          margin={{ top: 8, right: 12, left: -16, bottom: 0 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <defs>
            {lines.map((line) => (
              <linearGradient key={line.key} id={toGradientId(line.key)} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={line.color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={line.color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis
            dataKey={xKey}
            tick={{ fill: "#a1a1aa", fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: "#27272a" }}
          />
          <YAxis
            tick={{ fill: "#a1a1aa", fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: "#27272a" }}
            allowDecimals={false}
          />
          {lines.map((line) => (
            <Area
              key={line.key}
              type="monotone"
              dataKey={line.key}
              stroke={line.color}
              strokeWidth={2}
              fill={`url(#${toGradientId(line.key)})`}
              dot={false}
              activeDot={{ r: 4, fill: line.color, strokeWidth: 0 }}
            />
          ))}
        </RechartsAreaChart>
      </ResponsiveContainer>
      <motion.div
        className="fixed pointer-events-none z-50 bg-zinc-900/90 border border-zinc-700 rounded-xl px-4 py-3 shadow-xl backdrop-blur-sm origin-top-left"
        style={{ left: tooltip.x + 14, top: tooltip.y - 14 }}
        animate={{ opacity: tooltip.active ? 1 : 0, scale: tooltip.active ? 1 : 0.95 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
      >
        {tooltip.active && (
          <>
            <p className="text-zinc-400 text-xs mb-2">{tooltip.label}</p>
            {tooltip.payload?.map((entry, idx) => (
              <p key={idx} className="text-sm font-medium" style={{ color: entry.color }}>
                {entry.name}: {entry.value}
              </p>
            ))}
          </>
        )}
      </motion.div>
    </div>
  );
}

export default AreaChart;
