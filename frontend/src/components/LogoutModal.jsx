import { motion, AnimatePresence } from "motion/react";
import { LogOut, X } from "lucide-react";

function LogoutModal({ open, onClose, onConfirm, userName }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-zinc-950/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal Card */}
          <motion.div
            className="relative w-full max-w-sm bg-zinc-900/90 border border-zinc-800 rounded-3xl p-8 shadow-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
          >
            {/* Subtle glow top */}
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[200px] h-[200px] rounded-full opacity-[0.06] pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(255,255,255,0.6), transparent 60%)" }}
            />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="relative z-10 text-center">
              {/* Icon */}
              <div className="mx-auto w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <LogOut className="w-6 h-6 text-red-400" />
              </div>

              {/* Title */}
              <h2 className="mt-4 text-lg font-semibold text-zinc-50">
                Konfirmasi Logout
              </h2>

              {/* Description */}
              <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                {userName ? (
                  <>Yakin ingin keluar, <span className="text-zinc-300 font-medium">{userName}</span>?</>
                ) : (
                  "Yakin ingin keluar?"
                )}
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                Kamu perlu login lagi untuk mengakses dashboard.
              </p>
            </div>

            {/* Buttons */}
            <div className="relative z-10 mt-6 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 text-sm font-medium hover:bg-zinc-700 border border-zinc-700 transition-all active:scale-[0.97] cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-500 transition-all active:scale-[0.97] cursor-pointer"
              >
                Logout
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default LogoutModal;
