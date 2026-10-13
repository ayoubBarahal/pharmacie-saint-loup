// Adapté de « Magic Card » — Magic UI (MIT), publié sur 21st.dev.
// Version claire : halo vert qui suit le pointeur + bordure lumineuse.
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import type { ReactNode, PointerEvent } from "react";
import { cn } from "../../lib/cn";

export default function MagicCard({ children, className, size = 320 }: { children: ReactNode; className?: string; size?: number }) {
  const x = useMotionValue(-size);
  const y = useMotionValue(-size);
  const move = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - r.left); y.set(e.clientY - r.top);
  };
  const leave = () => { x.set(-size); y.set(-size); };
  const border = useMotionTemplate`linear-gradient(#fff 0 0) padding-box, radial-gradient(${size}px circle at ${x}px ${y}px, #0F7C6B, #B8E0D6 45%, #E2E7E1 100%) border-box`;
  const glow = useMotionTemplate`radial-gradient(${size}px circle at ${x}px ${y}px, rgba(30,138,90,.10), transparent 70%)`;
  return (
    <motion.div onPointerMove={move} onPointerLeave={leave} style={{ background: border }}
      className={cn("group relative isolate overflow-hidden rounded-[26px] border border-transparent", className)}>
      <motion.div aria-hidden style={{ background: glow }}
        className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
}
