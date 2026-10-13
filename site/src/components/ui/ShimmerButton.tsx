// Adapté de « Shimmer Button » — Magic UI (MIT), publié sur 21st.dev.
// Modifs : rendu en lien <a>, couleurs de la marque.
import type { AnchorHTMLAttributes, CSSProperties, ReactNode } from "react";
import { cn } from "../../lib/cn";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { children: ReactNode; shimmerColor?: string };

export default function ShimmerButton({ children, className, shimmerColor = "#ffffff", ...rest }: Props) {
  const vars = { "--spread": "90deg", "--shimmer-color": shimmerColor, "--speed": "3s", "--cut": "0.08em", "--bg": "#0F7C6B" } as CSSProperties;
  return (
    <a {...rest} style={vars}
      className={cn("group relative z-0 flex cursor-pointer sm:inline-flex items-center justify-center gap-2.5 overflow-hidden whitespace-nowrap rounded-full border border-white/10 px-6 py-3.5 text-[15px] font-medium text-white [background:var(--bg)]",
        "transition-transform duration-300 active:translate-y-px", className)}>
      {/* étincelle */}
      <div className="absolute inset-0 -z-30 overflow-visible blur-[2px] [container-type:size]">
        <div className="absolute inset-0 h-[100cqh] animate-shimmer-slide [aspect-ratio:1]">
          <div className="absolute -inset-full w-auto animate-spin-around [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))]" />
        </div>
      </div>
      {children}
      {/* reflet */}
      <div className="absolute inset-0 rounded-full shadow-[inset_0_-8px_10px_#ffffff1f] transition-shadow duration-300 group-hover:shadow-[inset_0_-6px_10px_#ffffff3f]" />
      {/* fond */}
      <div className="absolute -z-20 rounded-full [background:var(--bg)] [inset:var(--cut)]" />
    </a>
  );
}
