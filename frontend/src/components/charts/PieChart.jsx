import { useMemo } from "react";
import { motion } from "motion/react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#a78bfa", "#22d3ee", "#4ade80", "#fbbf24",
  "#f472b6", "#fb923c", "#a1a1aa", "#34d399",
  "#60a5fa", "#c084fc",
];

function CustomTooltip({ active, payload, total }) {
  if (!active || !payload?.length) return null;
  const entry = payload[0];
  const pct = total > 0 ? ((entry.value / total) * 100).toFixed(1) : 0;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="bg-zinc-900/90 border border-zinc-700 rounded-xl px-4 py-3 shadow-xl backdrop-blur-sm pointer-events-none"
    >
      <p className="text-sm font-medium" style={{ color: entry.color }}>
        {entry.name}: {entry.value} ({pct}%)
      </p>
    </motion.div>
  );
}

function PieChart({
  data,
  dataKey = "value",
  nameKey = "label",
  colors = COLORS,
  height = 260,
  showLegend = true,
  innerRadius = 0,
  outerRadius = 90,
}) {
  const dataTotal = useMemo(
    () => data?.reduce((sum, d) => sum + (d[dataKey] || 0), 0) || 0,
    [data, dataKey]
  );

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsPieChart>
        <Pie
          data={data}
          dataKey={dataKey}
          nameKey={nameKey}
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          paddingAngle={2}
          strokeWidth={0}
        >
          {data?.filter(Boolean).map((_, index) => (
            <Cell key={index} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip total={dataTotal} />} />
        {showLegend && (
          <Legend
            verticalAlign="bottom"
            wrapperStyle={{ fontSize: 12, color: "#a1a1aa" }}
          />
        )}
      </RechartsPieChart>
    </ResponsiveContainer>
  );
}

export default PieChart;
