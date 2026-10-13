// Adapté de « Number Ticker » — Magic UI (MIT), publié sur 21st.dev.
// Modifs : format français, respect de prefers-reduced-motion.
import { useInView, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";
import { cn } from "../../lib/cn";

const fmt = (n: number, decimals: number) =>
  Intl.NumberFormat("fr-FR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(Number(n.toFixed(decimals)));

export default function NumberTicker({ value, delay = 0, decimals = 0, className }: { value: number; delay?: number; decimals?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const mv = useMotionValue(reduce ? value : 0);
  const spring = useSpring(mv, { damping: 60, stiffness: 100 });
  const inView = useInView(ref, { once: true, margin: "0px" });

  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => mv.set(value), delay * 1000);
    return () => clearTimeout(t);
  }, [inView, value, delay, mv]);

  useEffect(() => spring.on("change", (v) => { if (ref.current) ref.current.textContent = fmt(v, decimals); }), [spring, decimals]);

  return <span ref={ref} className={cn("inline-block tabular-nums", className)}>{fmt(reduce ? value : 0, decimals)}</span>;
}
