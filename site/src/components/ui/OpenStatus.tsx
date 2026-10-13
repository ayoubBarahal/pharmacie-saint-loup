import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "../../lib/cn";
import { openState } from "../../lib/hours";

/** Badge « Ouvert / Fermé » calculé en direct depuis les horaires (heure de Paris). */
export default function OpenStatus({ className }: { className?: string }) {
  const [s, setS] = useState(openState);
  useEffect(() => { const t = setInterval(() => setS(openState()), 30_000); return () => clearInterval(t); }, []);
  if (!s) return null;
  return (
    <span role="status" className={cn("inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[13px] font-medium",
      s.open ? "border-cross/20 bg-cross-mist text-cross-deep" : "border-peach bg-peach/40 text-[#7A4B22]", className)}>
      <span className="relative flex h-2 w-2">
        {s.open && <motion.span className="absolute inset-0 rounded-full bg-cross" animate={{ scale: [1, 2.4], opacity: [0.6, 0] }} transition={{ duration: 1.6, repeat: Infinity }} />}
        <span className={cn("relative h-2 w-2 rounded-full", s.open ? "bg-cross" : "bg-[#C47A3D]")} />
      </span>
      {s.label}
    </span>
  );
}
