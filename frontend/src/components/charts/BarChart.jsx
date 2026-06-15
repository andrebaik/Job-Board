import { motion } from "motion/react";
import {
  BarChart as RechartsBarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#a78bfa", "#22d3ee", "#4ade80", "#fbbf24",
  "#f472b6", "#fb923c", "#a1a1aa", "#34d399",
  "#60a5fa", "#c084fc",
];

function CustomTooltip({ active, payload, label }) {
  const entry = payload?.[0];
  return (
    <motion.div
      className="bg-zinc-900/90 border border-zinc-700 rounded-xl px-4 py-3 shadow-xl backdrop-blur-sm pointer-events-none origin-top-left"
      animate={{
        opacity: active && payload ? 1 : 0,
        scale: active && payload ? 1 : 0.95,
      }}
      transition={{ duration: 0.15, ease: "easeOut" }}
    >
      {active && entry && (
        <p className="text-sm font-medium" style={{ color: entry.color }}>
          {label}: {entry.value}
        </p>
      )}
    </motion.div>
  );
}

function BarChart({ data, dataKey = "value", nameKey = "label", colors = COLORS, height = 300 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart
        data={data}
        layout="vertical"
        margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
        <XAxis type="number" tick={{ fill: "#a1a1aa", fontSize: 11 }} tickLine={false} axisLine={{ stroke: "#27272a" }} />
        <YAxis type="category" dataKey={nameKey} tick={{ fill: "#a1a1aa", fontSize: 12 }} tickLine={false} axisLine={false} width={120} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey={dataKey} radius={[0, 6, 6, 0]} barSize={20}>
          {data?.filter(Boolean).map((_, index) => (
            <Cell key={index} fill={colors[index % colors.length]} />
          ))}
        </Bar>
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}

export default BarChart;
