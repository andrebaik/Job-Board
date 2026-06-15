import { motion } from "motion/react";

const stageLabels = {
  "Total Pelamar": { label: "Total Pelamar", color: "#a78bfa" },
  "Total Lamaran": { label: "Total Lamaran", color: "#60a5fa" },
  menunggu: { label: "Menunggu", color: "#fbbf24" },
  dilihat: { label: "Dilihat", color: "#22d3ee" },
  interview: { label: "Interview", color: "#c084fc" },
  diterima: { label: "Diterima", color: "#4ade80" },
  ditolak: { label: "Ditolak", color: "#f87171" },
};

function FunnelChart({ data }) {
  if (!data || data.length === 0) return null;
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="space-y-3">
      {data.map((stage, idx) => {
        const cfg = stageLabels[stage.name] || { label: stage.name, color: "#a1a1aa" };
        const pct = maxValue > 0 ? (stage.value / maxValue) * 100 : 0;
        const dropOff =
          idx > 0 && data[idx - 1].value > 0
            ? ((data[idx - 1].value - stage.value) / data[idx - 1].value) * 100
            : null;

        return (
          <motion.div
            key={stage.name}
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.05 * idx }}
          >
            <div className="w-32 text-right shrink-0">
              <p className="text-zinc-50 text-sm font-medium">{cfg.label}</p>
              {dropOff !== null && (
                <p className="text-zinc-500 text-[11px]">-{dropOff.toFixed(0)}%</p>
              )}
            </div>
            <div className="flex-1 h-8 bg-zinc-800/50 rounded-lg overflow-hidden">
              <motion.div
                className="h-full rounded-lg flex items-center justify-end px-3"
                style={{
                  width: `${Math.max(pct, 4)}%`,
                  backgroundColor: cfg.color,
                  opacity: 0.8,
                }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(pct, 4)}%` }}
                transition={{ duration: 0.5, delay: 0.05 * idx, ease: "easeOut" }}
              >
                <span className="text-xs font-bold text-zinc-950">{stage.value}</span>
              </motion.div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default FunnelChart;
