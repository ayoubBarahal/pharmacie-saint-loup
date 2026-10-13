// Adapté de « Hover Expand » — SmoothUI par Eduardo Calvo (MIT), publié sur 21st.dev.
// Modifs : style de la marque, numérotation, panneau texte au lieu du dégradé noir, orientation responsive.
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { cn } from "../../lib/cn";

export interface HoverExpandItem { id: string; title: string; tag: string; description: string; image: string; }

export default function HoverExpand({ items, className }: { items: HoverExpandItem[]; className?: string }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [hoverDevice, setHoverDevice] = useState(false);
  const [vertical, setVertical] = useState(false);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const h = window.matchMedia("(hover: hover) and (pointer: fine)");
    const v = window.matchMedia("(max-width: 900px)");
    const sync = () => { setHoverDevice(h.matches); setVertical(v.matches); };
    sync(); h.addEventListener("change", sync); v.addEventListener("change", sync);
    return () => { h.removeEventListener("change", sync); v.removeEventListener("change", sync); };
  }, []);

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const next = vertical ? "ArrowDown" : "ArrowRight";
    const prev = vertical ? "ArrowUp" : "ArrowLeft";
    if (e.key === next || e.key === prev) {
      e.preventDefault();
      const j = e.key === next ? Math.min(i + 1, items.length - 1) : Math.max(i - 1, 0);
      setActive(j); refs.current[j]?.focus();
    }
  };
  const spring = reduce ? { duration: 0 } : { type: "spring" as const, bounce: 0.12, duration: 0.6 };

  return (
    <div role="group" aria-label="Rayons de la parapharmacie"
      className={cn("flex w-full gap-2.5", vertical ? "h-[920px] flex-col" : "h-[600px] flex-row", className)}>
      {items.map((it, i) => {
        const on = i === active;
        return (
          <motion.button key={it.id} type="button" ref={(el) => { refs.current[i] = el; }}
            initial={false} animate={{ flexGrow: on ? 5 : 1 }} transition={spring}
            style={{ flexBasis: 0 }} aria-pressed={on} aria-label={it.title}
            onMouseEnter={() => hoverDevice && setActive(i)} onFocus={() => setActive(i)}
            onClick={() => !hoverDevice && setActive(i)} onKeyDown={(e) => onKey(e, i)}
            className="group relative min-h-0 min-w-0 overflow-hidden rounded-[22px] text-left">
            <motion.img src={it.image} alt="" draggable={false} loading="lazy"
              animate={{ scale: on ? 1 : 1.18 }} transition={reduce ? { duration: 0 } : { duration: 1.1, ease: [0.2, 0.7, 0.2, 1] }}
              className="absolute inset-0 h-full w-full object-cover" />
            <div className={cn("absolute inset-0 transition-colors duration-500", on ? "bg-transparent" : "bg-ink/25")} />
            {/* libellé replié */}
            <motion.span animate={{ opacity: on ? 0 : 1 }} transition={{ duration: 0.25 }}
              className={cn("pointer-events-none absolute font-mono text-[11px] uppercase tracking-[0.16em] text-white",
                vertical ? "left-5 top-1/2 -translate-y-1/2" : "bottom-6 left-1/2 origin-center -translate-x-1/2 -rotate-90 whitespace-nowrap [transform-origin:center]")}>
              {String(i + 1).padStart(2, "0")} · {it.tag}
            </motion.span>
            {/* panneau déplié */}
            <motion.div initial={false} animate={{ opacity: on ? 1 : 0, y: on ? 0 : 16 }}
              transition={reduce ? { duration: 0 } : { duration: 0.45, delay: on ? 0.18 : 0 }}
              className="absolute inset-x-3 bottom-3 rounded-2xl bg-white/90 p-5 backdrop-blur-md sm:inset-x-4 sm:bottom-4 sm:max-w-[420px] sm:p-6">
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-cross-deep">{it.tag}</span>
              <h3 className="mt-1 text-[1.9rem] leading-none">{it.title}</h3>
              <p className="mt-2.5 text-[14.5px] leading-relaxed text-muted">{it.description}</p>
            </motion.div>
          </motion.button>
        );
      })}
    </div>
  );
}
