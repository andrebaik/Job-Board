import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { SplitText as GSAPSplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(GSAPSplitText, useGSAP);

const SplitText = ({
  text,
  className = "",
  delay = 50,
  duration = 1.25,
  ease = "power3.out",
  splitType = "chars",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  textAlign = "center",
  tag = "p",
  onLetterAnimationComplete
}) => {
  const ref = useRef(null);
  const animationCompletedRef = useRef(false);
  const onCompleteRef = useRef(onLetterAnimationComplete);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    onCompleteRef.current = onLetterAnimationComplete;
  }, [onLetterAnimationComplete]);

  useEffect(() => {
    const ready = "fonts" in document
      ? document.fonts.ready
      : Promise.resolve();
    ready.then(() => setFontsLoaded(true));
  }, []);

  useGSAP(() => {
    if (!ref.current || !text || !fontsLoaded) return;
    if (animationCompletedRef.current) return;

    const el = ref.current;

    if (el._rbsplitInstance) {
      try { el._rbsplitInstance.revert(); } catch { /* noop */ }
      el._rbsplitInstance = null;
    }

    let targets;
    const assignTargets = (self) => {
      if (splitType.includes("chars") && self.chars.length) targets = self.chars;
      if (!targets && splitType.includes("words") && self.words.length) targets = self.words;
      if (!targets && splitType.includes("lines") && self.lines.length) targets = self.lines;
      if (!targets) targets = self.chars || self.words || self.lines;
    };

    const splitInstance = new GSAPSplitText(el, {
      type: splitType,
      smartWrap: true,
      autoSplit: splitType === "lines",
      linesClass: "split-line",
      wordsClass: "split-word",
      charsClass: "split-char",
      reduceWhiteSpace: false,
      onSplit: (self) => {
        assignTargets(self);
        return gsap.fromTo(targets, { ...from }, {
          ...to,
          duration,
          ease,
          stagger: delay / 1000,
          onComplete: () => {
            animationCompletedRef.current = true;
            onCompleteRef.current?.();
          },
          willChange: "transform, opacity",
          force3D: true
        });
      }
    });
    el._rbsplitInstance = splitInstance;

    return () => {
      try { splitInstance.revert(); } catch { /* noop */ }
      el._rbsplitInstance = null;
    };
  }, {
    dependencies: [
      text, delay, duration, ease, splitType,
      JSON.stringify(from), JSON.stringify(to), fontsLoaded
    ],
    scope: ref
  });

  const Tag = tag || "p";
  return (
    <Tag
      ref={ref}
      style={{ textAlign, wordWrap: "break-word", willChange: "transform, opacity" }}
      className={`split-parent overflow-hidden ${className}`}
    >
      {text}
    </Tag>
  );
};

export default SplitText;
