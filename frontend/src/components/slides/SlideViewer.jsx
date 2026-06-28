import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import BlurText from "./BlurText";
import SplitText from "./SplitText";
import Shuffle from "./Shuffle";
import slidesData from "./slidesData";

function SlideContent({ slide, index, animKey }) {
  const sectionNum = String(index + 1).padStart(2, "0");

  const renderContent = () => {
    switch (slide.type) {
      case "cover":
        return (
          <div className="text-center mt-8">
            {slide.subtitle && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="text-sm sm:text-base text-zinc-500 tracking-[0.2em] uppercase"
              >
                {slide.subtitle}
              </motion.p>
            )}
          </div>
        );

      case "team":
        return (
          <div className="max-w-2xl mx-auto mt-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {slide.members.map((m, i) => (
                <motion.div
                  key={m.number}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.08, duration: 0.5 }}
                  className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 sm:p-5 text-center"
                >
                  <span className="text-2xl sm:text-3xl font-bold text-zinc-600">{m.number}</span>
                  <p className="mt-2 text-sm sm:text-base text-zinc-200 font-medium">{m.name}</p>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case "bullets":
        return (
          <div className="max-w-2xl mx-auto mt-8">
            <ul className="space-y-3 sm:space-y-4">
              {slide.bullets.map((b, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.08, duration: 0.5 }}
                  className="flex items-start gap-3 text-zinc-300 text-sm sm:text-base leading-relaxed"
                >
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0" />
                  {b}
                </motion.li>
              ))}
            </ul>
          </div>
        );

      case "numbered-cards":
        return (
          <div className="max-w-3xl mx-auto mt-8">
            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
              {slide.items.map((item, i) => (
                <motion.div
                  key={item.number}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.08, duration: 0.5 }}
                  className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 sm:p-5 flex items-start gap-3"
                >
                  <span className="text-lg sm:text-xl font-bold text-zinc-600 shrink-0">{item.number}</span>
                  <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case "scope":
        return (
          <div className="max-w-4xl mx-auto mt-8">
            <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
              {slide.sections.map((section, i) => (
                <motion.div
                  key={section.label}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                  className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 sm:p-5"
                >
                  <h3 className="text-xs font-semibold text-zinc-500 tracking-wider mb-3 uppercase">
                    {section.label}
                  </h3>
                  <ul className="space-y-1.5">
                    {section.items.map((item) => (
                      <li key={item} className="text-zinc-300 text-sm leading-relaxed flex items-start gap-2">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-zinc-600 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case "numbered-list":
        return (
          <div className="max-w-2xl mx-auto mt-8">
            <div className="space-y-3 sm:space-y-4">
              {slide.steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.08, duration: 0.5 }}
                  className="flex items-center gap-4"
                >
                  <span className="text-lg sm:text-xl font-bold text-zinc-600 w-8 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">{step}</p>
                </motion.div>
              ))}
            </div>
            {slide.footer && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-8 text-xs sm:text-sm text-zinc-500 italic border-t border-zinc-800 pt-4"
              >
                {slide.footer}
              </motion.p>
            )}
          </div>
        );

      case "image":
        return (
          <div className="max-w-5xl mx-auto mt-6 flex items-center justify-center">
            <motion.img
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              src={slide.image}
              alt={slide.title}
              className="w-full max-h-[68vh] object-contain rounded-xl border border-zinc-800 bg-white"
            />
          </div>
        );

      case "database":
        return (
          <div className="max-w-3xl mx-auto mt-8">
            <div className="space-y-2 sm:space-y-3">
              {slide.tables.map((t, i) => (
                <motion.div
                  key={t.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.08, duration: 0.5 }}
                  className="bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 sm:px-5 py-3 flex items-center gap-4"
                >
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-950/50 px-2 py-1 rounded shrink-0">
                    {t.name}
                  </span>
                  <span className="text-zinc-400 text-sm">{t.desc}</span>
                </motion.div>
              ))}
            </div>
            {slide.note && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-6 text-xs sm:text-sm text-zinc-500 text-center"
              >
                {slide.note}
              </motion.p>
            )}
          </div>
        );

      case "conclusion":
        return (
          <div className="max-w-3xl mx-auto mt-8">
            <ul className="space-y-3 sm:space-y-4">
              {slide.points.map((p, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.08, duration: 0.5 }}
                  className="flex items-start gap-3 text-zinc-300 text-sm sm:text-base leading-relaxed"
                >
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  {p}
                </motion.li>
              ))}
            </ul>
            <div className="mt-10 text-center">
              <Shuffle
                text={slide.closing}
                className="text-4xl sm:text-5xl font-bold text-zinc-50 tracking-wider !uppercase"
                shuffleDirection="right"
                duration={0.3}
                loop={true}
                loopDelay={3000}
                shuffleTimes={3}
                stagger={0.02}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div key={animKey} className="w-full max-w-4xl mx-auto">
      <div className="mb-2">
        <span className="text-emerald-500 text-sm font-mono tracking-widest">{sectionNum}</span>
      </div>

      {slide.type === "cover" ? (
        <div className="whitespace-pre-line">
          <SplitText
            text={slide.title}
            className="text-5xl sm:text-6xl md:text-7xl font-bold text-zinc-50 leading-[1.1] tracking-tight"
            splitType="lines"
            delay={40}
            duration={0.9}
            from={{ opacity: 0, y: 50 }}
            to={{ opacity: 1, y: 0 }}
          />
        </div>
      ) : (
        <BlurText
          text={slide.title}
          className="text-3xl sm:text-4xl font-bold text-zinc-50"
          delay={50}
          direction="top"
          animateBy="words"
        />
      )}

      <div className="mt-2 h-px bg-zinc-800" />
      {renderContent()}
    </div>
  );
}

function SlideViewer({ onClose }) {
  const [current, setCurrent] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const total = slidesData.length;
  const isLast = current === total - 1;

  const goTo = useCallback((n) => {
    setCurrent((prev) => {
      const next = Math.max(0, Math.min(total - 1, n));
      if (next !== prev) setAnimKey((k) => k + 1);
      return next;
    });
  }, [total]);

  const next = useCallback(() => {
    if (current < total - 1) goTo(current + 1);
  }, [current, total, goTo]);

  const prev = useCallback(() => {
    if (current > 0) goTo(current - 1);
  }, [current, goTo]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        if (isLast) onClose();
        else next();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        prev();
      } else if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev, isLast, onClose]);

  useEffect(() => {
    let ticking = false;
    const handler = (e) => {
      if (ticking) return;
      ticking = true;
      setTimeout(() => { ticking = false; }, 800);
      if (e.deltaY > 0) {
        if (!isLast) next();
      } else {
        prev();
      }
    };
    window.addEventListener("wheel", handler, { passive: true });
    return () => window.removeEventListener("wheel", handler);
  }, [next, prev, isLast]);

  return (
    <div className="h-screen overflow-hidden bg-zinc-950 text-zinc-200 font-sans relative select-none">
      <div
        className="fixed top-0 left-0 h-[3px] bg-emerald-500 z-40 transition-all duration-700 ease-out"
        style={{ width: `${(current / (total - 1)) * 100}%` }}
      />

      <button
        onClick={onClose}
        className="fixed top-6 left-4 sm:left-6 z-30 flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 transition-colors text-sm"
      >
        <ArrowLeft size={16} />
        Kembali
      </button>

      <div
        className="transition-transform duration-700 ease-in-out will-change-transform"
        style={{ transform: `translateY(-${current * 100}vh)` }}
      >
        {slidesData.map((slide, i) => (
          <section key={i} className="h-screen w-full flex items-center justify-center px-4 sm:px-6">
            <SlideContent slide={slide} index={i} animKey={`s${i}-${animKey}`} />
          </section>
        ))}
      </div>

      {!isLast && (
        <>
          <button
            onClick={prev}
            className="fixed left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800 transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={next}
            className="fixed right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800 transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      <div className="fixed bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-3 z-20">
        {slidesData.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-500 ease-out ${
              i === current
                ? "bg-emerald-500 w-6 sm:w-8 h-2"
                : "bg-zinc-700 hover:bg-zinc-500 w-1.5 sm:w-2 h-1.5 sm:h-2"
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      <div className="fixed bottom-6 sm:bottom-8 right-4 sm:right-8 flex items-center gap-2 sm:gap-3 z-20">
        <span className="text-zinc-600 text-xs sm:text-sm font-mono tracking-wider">
          {String(current + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
        </span>
        <button
          onClick={prev}
          disabled={current === 0}
          className="p-1 rounded text-zinc-600 hover:text-zinc-400 transition-colors disabled:opacity-30"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={next}
          disabled={isLast}
          className="p-1 rounded text-zinc-600 hover:text-zinc-400 transition-colors disabled:opacity-30"
        >
          <ChevronRight size={16} />
        </button>
      </div>


    </div>
  );
}

export default SlideViewer;
