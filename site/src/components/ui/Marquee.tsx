// Adapté de « Marquee » — Magic UI (MIT), publié sur 21st.dev.
import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export default function Marquee({ children, className, reverse, repeat = 4, duration = "48s" }:
  { children: ReactNode; className?: string; reverse?: boolean; repeat?: number; duration?: string }) {
  return (
    <div className={cn("group flex overflow-hidden [--gap:3rem]", className)} style={{ ["--duration" as string]: duration, gap: "var(--gap)" }}>
      {Array.from({ length: repeat }).map((_, i) => (
        <div key={i} aria-hidden={i > 0}
          className={cn("flex shrink-0 items-center justify-around animate-marquee group-hover:[animation-play-state:paused]", reverse && "[animation-direction:reverse]")}
          style={{ gap: "var(--gap)" }}>
          {children}
        </div>
      ))}
    </div>
  );
}
