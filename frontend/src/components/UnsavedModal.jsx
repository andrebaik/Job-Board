import { AnimatePresence, motion } from "motion/react";

function UnsavedModal({ open, onClose, onSave, onDiscard }) {
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
            <h3 className="text-zinc-50 font-semibold text-lg">Pembaruan Belum Disimpan</h3>
            <p className="mt-2 text-zinc-400 text-sm">Ada perubahan yang belum disimpan. Simpan atau buang perubahan?</p>
            <div className="mt-6 flex flex-col gap-2">
              <button
                onClick={onSave}
                className="w-full py-2.5 rounded-xl bg-zinc-50 text-zinc-950 text-sm font-semibold hover:bg-zinc-200 transition-all active:scale-[0.97]"
              >
                Simpan Pembaruan
              </button>
              <button
                onClick={onDiscard}
                className="w-full py-2.5 rounded-xl bg-zinc-800 text-zinc-300 text-sm font-medium hover:bg-zinc-700 border border-zinc-700 transition-all active:scale-[0.97]"
              >
                Buang Pembaruan
              </button>
              <button
                onClick={onClose}
                className="w-full py-2 rounded-xl text-xs text-zinc-500 hover:text-zinc-400 transition-colors"
              >
                Batal
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default UnsavedModal;
