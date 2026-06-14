import { AnimatePresence, motion } from "motion/react";

function ConfirmModal({ open, onClose, onConfirm, title = "Konfirmasi", message = "Yakin ingin melanjutkan?", confirmText = "Ya, Hapus", cancelText = "Batal", variant = "danger" }) {
  const confirmBg = variant === "danger" ? "bg-red-600 hover:bg-red-700" : "bg-zinc-50 hover:bg-zinc-200 text-zinc-950";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="relative bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl"
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <h3 className="text-zinc-50 font-semibold text-lg">{title}</h3>
            <p className="mt-2 text-zinc-400 text-sm">{message}</p>
            <div className="mt-6 flex gap-3 justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-sm font-medium text-zinc-300 hover:text-zinc-50 hover:bg-zinc-800 transition-all"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                className={`px-4 py-2 rounded-xl text-sm font-medium text-white transition-all active:scale-[0.97] ${confirmBg}`}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ConfirmModal;
