import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { api } from "../../api/client";
import Chart from "./LineChart";

const periods = [
  { label: "7H", value: "7d" },
  { label: "30H", value: "30d" },
  { label: "90H", value: "90d" },
  { label: "1T", value: "1y" },
];

const chartConfigs = [
  { title: "Pelamar Terdaftar", key: "Pelamar Terdaftar", color: "#a78bfa", desc: "Pelamar baru per hari" },
  { title: "Perusahaan Terdaftar", key: "Perusahaan Terdaftar", color: "#22d3ee", desc: "Perusahaan baru per hari" },
  { title: "Pelamar Diterima", key: "Pelamar Diterima", color: "#4ade80", desc: "Lamaran diterima per hari" },
  { title: "Lowongan Dibuat", key: "Lowongan Dibuat", color: "#fbbf24", desc: "Lowongan baru per hari" },
];

function AdminCharts() {
  const [period, setPeriod] = useState("30d");
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [datasets, setDatasets] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/admin/stats/chart?period=${period}`);
        const { labels, datasets: ds } = res.data.data;
        const mapped = labels.map((label, i) => {
          const obj = { date: label };
          ds.forEach((d) => { obj[d.label] = d.data[i]; });
          return obj;
        });
        setChartData(mapped);
        setDatasets(ds);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [period]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-1 bg-zinc-800/50 rounded-xl p-1">
          {periods.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                period === p.value
                  ? "bg-zinc-700 text-zinc-50"
                  : "text-zinc-400 hover:text-zinc-50"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="space-y-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5 animate-pulse">
              <div className="h-4 w-24 bg-zinc-800 rounded mb-4" />
              <div className="h-[160px] bg-zinc-800/50 rounded-xl" />
            </div>
          ))}
        </div>
      )}

      {!loading && datasets.length > 0 && (
        <div className="space-y-6">
          {chartConfigs.map((cfg, idx) => {
            const ds = datasets.find((d) => d.label === cfg.key);
            if (!ds) return null;
            return (
              <motion.div
                key={cfg.key}
                className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.08 * idx }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-zinc-50 font-semibold text-sm">{cfg.title}</h3>
                    <p className="text-zinc-500 text-xs mt-0.5">{cfg.desc}</p>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cfg.color }} />
                </div>
                <Chart
                  data={chartData}
                  lines={[{ key: cfg.key, color: cfg.color }]}
                  height={220}
                />
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AdminCharts;
