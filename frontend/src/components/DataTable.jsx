import { useState } from "react";
import { motion } from "motion/react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

function DataTable({ columns, data, loading, pagination, onSearch, onPageChange, searchPlaceholder = "Cari..." }) {
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    const v = e.target.value;
    setSearch(v);
    const timer = setTimeout(() => {
      onSearch?.(v);
    }, 300);
    return () => clearTimeout(timer);
  };

  return (
    <div>
      {onSearch && (
        <div className="relative mb-4 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder={searchPlaceholder}
            className="w-full bg-zinc-950 border border-zinc-800 text-zinc-50 placeholder:text-zinc-600 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-zinc-600 transition-colors"
          />
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-left text-zinc-500 font-medium py-3 px-3 whitespace-nowrap"
                  style={col.width ? { width: col.width } : undefined}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center text-zinc-500">
                  <div className="animate-pulse space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-8 bg-zinc-800/50 rounded mx-3" />
                    ))}
                  </div>
                </td>
              </tr>
            )}

            {!loading && data.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center text-zinc-500">
                  Tidak ada data.
                </td>
              </tr>
            )}

            {!loading &&
              data.map((row, i) => (
                <motion.tr
                  key={row.id || i}
                  className="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: 0.03 * i }}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="py-3 px-3 text-zinc-300 whitespace-nowrap"
                      style={col.width ? { width: col.width } : undefined}
                    >
                      {col.render ? col.render(row, i) : row[col.key] ?? "-"}
                    </td>
                  ))}
                </motion.tr>
              ))}
          </tbody>
        </table>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-800">
          <p className="text-xs text-zinc-500">
            Total {pagination.total} data — Halaman {pagination.page} dari {pagination.totalPages}
          </p>
          <div className="flex gap-1">
            <button
              disabled={pagination.page <= 1}
              onClick={() => onPageChange?.(pagination.page - 1)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-800 text-zinc-300 hover:bg-zinc-700 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => onPageChange?.(pagination.page + 1)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-800 text-zinc-300 hover:bg-zinc-700 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;
