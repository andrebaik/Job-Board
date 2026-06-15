import { useEffect, useState, useMemo, useRef } from "react";
import { motion } from "motion/react";
import { toPng } from "html-to-image";
import { saveAs } from "file-saver";
import { Download } from "lucide-react";
import { api, adminApi } from "../../api/client";
import Chart from "./LineChart";
import PieChart from "./PieChart";
import AreaChart from "./AreaChart";
import BarChart from "./BarChart";
import FunnelChart from "./FunnelChart";

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

function ExportableChart({ title, children }) {
  const ref = useRef(null);
  const handleExport = async () => {
    if (!ref.current) return;
    try {
      const dataUrl = await toPng(ref.current, { backgroundColor: "#09090b" });
      saveAs(dataUrl, `${title.replace(/\s+/g, "-").toLowerCase()}.png`);
    } catch {
      // silent
    }
  };

  return (
    <div className="relative group">
      <div ref={ref}>{children}</div>
      <button
        onClick={handleExport}
        className="absolute top-2 right-2 p-1.5 rounded-lg bg-zinc-800/80 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-zinc-700"
        title="Download PNG"
      >
        <Download className="w-3.5 h-3.5 text-zinc-400" />
      </button>
    </div>
  );
}

function AdminCharts() {
  const [period, setPeriod] = useState("30d");
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [datasets, setDatasets] = useState([]);

  const [distribution, setDistribution] = useState(null);
  const [distLoading, setDistLoading] = useState(true);
  const [distPeriod, setDistPeriod] = useState("all");
  const [funnel, setFunnel] = useState([]);
  const [funnelLoading, setFunnelLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        setDistLoading(true);
        const res = await adminApi.getDistributionStats(distPeriod);
        setDistribution(res.data.data);
      } catch {
        // silent
      } finally {
        setDistLoading(false);
      }
    };
    fetch();
  }, [distPeriod]);

  useEffect(() => {
    const fetch = async () => {
      try {
        setFunnelLoading(true);
        const res = await api.get("/admin/stats/funnel");
        setFunnel(res.data.data);
      } catch {
        // silent
      } finally {
        setFunnelLoading(false);
      }
    };
    fetch();
  }, []);

  const cumulativeData = useMemo(() => {
    if (chartData.length === 0) return [];
    return chartData.map((row, i) => {
      const cum = { date: row.date };
      Object.keys(row).forEach((key) => {
        if (key === "date") return;
        cum[key] = i === 0 ? row[key] : chartData.slice(0, i + 1).reduce((sum, r) => sum + (r[key] || 0), 0);
      });
      return cum;
    });
  }, [chartData]);

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

  function calcSummary(dataArray) {
    if (!dataArray || dataArray.length === 0) return null;
    const total = dataArray.reduce((a, b) => a + b, 0);
    const avg = (total / dataArray.length).toFixed(1);
    const mid = Math.floor(dataArray.length / 2);
    const first = dataArray.slice(0, mid).reduce((a, b) => a + b, 0);
    const second = dataArray.slice(mid).reduce((a, b) => a + b, 0);
    const growth = first > 0 ? ((second - first) / first * 100).toFixed(1) : 0;
    return { total, avg, growth };
  }

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
              <ExportableChart key={cfg.key} title={cfg.title}>
                <motion.div
                  className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.08 * idx }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-zinc-50 font-semibold text-sm">{cfg.title}</h3>
                      <p className="text-zinc-500 text-xs mt-0.5">{cfg.desc}</p>
                      {(() => {
                        const s = calcSummary(ds.data);
                        if (!s) return null;
                        return (
                          <div className="flex gap-3 text-xs text-zinc-500 mt-1">
                            <span>Total: <strong className="text-zinc-200">{s.total}</strong></span>
                            <span>Rata²: <strong className="text-zinc-200">{s.avg}/hr</strong></span>
                            <span className={s.growth >= 0 ? "text-emerald-400" : "text-red-400"}>
                              {s.growth >= 0 ? "↑" : "↓"} {Math.abs(s.growth)}%
                            </span>
                          </div>
                        );
                      })()}
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cfg.color }} />
                  </div>
                  <Chart
                    data={chartData}
                    lines={[{ key: cfg.key, color: cfg.color }]}
                    height={220}
                  />
                </motion.div>
              </ExportableChart>
            );
          })}
        </div>
      )}

      {!loading && datasets.length > 0 && (
        <>
          <div className="mt-10 mb-4">
            <h2 className="text-zinc-50 font-semibold text-base">Perbandingan</h2>
            <p className="text-zinc-500 text-xs mt-0.5">Overlay pertumbuhan antar kategori.</p>
          </div>
          <div className="space-y-6">
            <ExportableChart title="Perbandingan Pertumbuhan">
              <motion.div
                className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-zinc-50 font-semibold text-sm">Perbandingan Pertumbuhan</h3>
                    <p className="text-zinc-500 text-xs mt-0.5">Pelamar vs Perusahaan per hari</p>
                  </div>
                </div>
                <Chart
                  data={chartData}
                  lines={[
                    { key: "Pelamar Terdaftar", color: "#a78bfa" },
                    { key: "Perusahaan Terdaftar", color: "#22d3ee" },
                  ]}
                  height={220}
                />
              </motion.div>
            </ExportableChart>
            <ExportableChart title="Aktivitas Lowongan">
              <motion.div
                className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-zinc-50 font-semibold text-sm">Aktivitas Lowongan</h3>
                    <p className="text-zinc-500 text-xs mt-0.5">Lowongan dibuat vs Lamaran diterima per hari</p>
                  </div>
                </div>
                <Chart
                  data={chartData}
                  lines={[
                    { key: "Lowongan Dibuat", color: "#fbbf24" },
                    { key: "Pelamar Diterima", color: "#4ade80" },
                  ]}
                  height={220}
                />
              </motion.div>
            </ExportableChart>
          </div>

          <div className="mt-10 mb-4">
            <h2 className="text-zinc-50 font-semibold text-base">Akumulasi</h2>
            <p className="text-zinc-500 text-xs mt-0.5">Total kumulatif dari waktu ke waktu.</p>
          </div>
          <div className="space-y-6">
            {chartConfigs.map((cfg, idx) => {
              const ds = datasets.find((d) => d.label === cfg.key);
              if (!ds) return null;
              return (
                <ExportableChart key={`cum-${cfg.key}`} title={`Akumulasi-${cfg.title}`}>
                  <motion.div
                    className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.08 * idx }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-zinc-50 font-semibold text-sm">Akumulasi {cfg.title}</h3>
                        <p className="text-zinc-500 text-xs mt-0.5">Total {cfg.desc.toLowerCase()}</p>
                      </div>
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cfg.color }} />
                    </div>
                    <AreaChart
                      data={cumulativeData}
                      lines={[{ key: cfg.key, color: cfg.color }]}
                      height={180}
                    />
                  </motion.div>
                </ExportableChart>
              );
            })}
          </div>
        </>
      )}

      <div className="mt-10 mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-zinc-50 font-semibold text-base">Distribusi Data</h2>
          <p className="text-zinc-500 text-xs mt-0.5">Ringkasan proporsi data dalam bentuk pie chart.</p>
        </div>
        <div className="flex gap-1 bg-zinc-800/50 rounded-xl p-1">
          {[
            { label: "Semua", value: "all" },
            { label: "30H", value: "30d" },
            { label: "90H", value: "90d" },
            { label: "1T", value: "1y" },
          ].map((p) => (
            <button
              key={p.value}
              onClick={() => setDistPeriod(p.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                distPeriod === p.value
                  ? "bg-zinc-700 text-zinc-50"
                  : "text-zinc-400 hover:text-zinc-50"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {distLoading && (
        <div className="grid grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5 animate-pulse">
              <div className="h-4 w-24 bg-zinc-800 rounded mb-4" />
              <div className="h-[200px] bg-zinc-800/50 rounded-xl" />
            </div>
          ))}
        </div>
      )}

      {!distLoading && distribution && (
        <div className="grid grid-cols-2 gap-6">
          <ExportableChart title="Role-User">
            <motion.div
              className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-zinc-50 font-semibold text-sm">Role User</h3>
                  <p className="text-zinc-500 text-xs mt-0.5">Distribusi user berdasarkan role</p>
                </div>
              </div>
              <PieChart data={distribution.userRoles} innerRadius={50} height={260} />
            </motion.div>
          </ExportableChart>

          <ExportableChart title="Status-Lamaran">
            <motion.div
              className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-zinc-50 font-semibold text-sm">Status Lamaran</h3>
                  <p className="text-zinc-500 text-xs mt-0.5">Distribusi lamaran berdasarkan status</p>
                </div>
              </div>
              <PieChart data={distribution.applicationStatus} height={260} />
            </motion.div>
          </ExportableChart>

          <ExportableChart title="Verifikasi-Perusahaan">
            <motion.div
              className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-zinc-50 font-semibold text-sm">Verifikasi Perusahaan</h3>
                  <p className="text-zinc-500 text-xs mt-0.5">Status verifikasi perusahaan</p>
                </div>
              </div>
              <PieChart data={distribution.companyVerification} height={260} />
            </motion.div>
          </ExportableChart>

          <ExportableChart title="Tipe-Pekerjaan">
            <motion.div
              className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-zinc-50 font-semibold text-sm">Tipe Pekerjaan</h3>
                  <p className="text-zinc-500 text-xs mt-0.5">Distribusi lowongan berdasarkan tipe</p>
                </div>
              </div>
              <PieChart data={distribution.jobTypes} height={260} />
            </motion.div>
          </ExportableChart>

          {distribution.jobCategories.length > 0 && (
            <ExportableChart title="Kategori-Lowongan">
              <motion.div
                className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5 col-span-2"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.25 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-zinc-50 font-semibold text-sm">Kategori Lowongan</h3>
                    <p className="text-zinc-500 text-xs mt-0.5">Top 10 kategori lowongan</p>
                  </div>
                </div>
                <BarChart data={distribution.jobCategories} height={280} />
              </motion.div>
            </ExportableChart>
          )}
        </div>
      )}

      {funnelLoading && (
        <div className="mt-10 bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6 animate-pulse">
          <div className="mb-2">
            <div className="h-5 w-32 bg-zinc-800 rounded mb-1" />
            <div className="h-3 w-48 bg-zinc-800 rounded" />
          </div>
          <div className="space-y-3 mt-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-32 h-4 bg-zinc-800 rounded" />
                <div className="flex-1 h-8 bg-zinc-800/50 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      )}

      {!funnelLoading && funnel.length > 0 && (
        <>
          <div className="mt-10 mb-4">
            <h2 className="text-zinc-50 font-semibold text-base">Pipeline Lamaran</h2>
            <p className="text-zinc-500 text-xs mt-0.5">Alur lamaran dari masuk hingga diterima/ditolak.</p>
          </div>
          <ExportableChart title="Pipeline-Lamaran">
            <motion.div
              className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FunnelChart data={funnel} />
            </motion.div>
          </ExportableChart>
        </>
      )}
    </div>
  );
}

export default AdminCharts;
