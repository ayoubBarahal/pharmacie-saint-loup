import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Menu, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { nav, site } from "../data/site";
import { cn } from "../lib/cn";
import Cross from "./ui/Cross";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <a href="#top" className="flex items-center gap-3" aria-label="Pharmacie Saint-Loup — accueil">
      <span className={cn("grid h-10 w-10 place-items-center rounded-[12px]", light ? "bg-white" : "bg-cross")}>
        <Cross className="h-5 w-5" color={light ? "#0F7C6B" : "#fff"} />
      </span>
      <span className="leading-none">
        <span className="block font-display text-[1.35rem] tracking-tight">Saint-Loup</span>
        <span className={cn("mt-1 block font-mono text-[9.5px] uppercase tracking-[0.2em]", light ? "text-white/60" : "text-muted")}>Pharmacie</span>
      </span>
    </a>
  );
}

export default function Header() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24));

  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    nav.forEach((n) => { const el = document.getElementById(n.id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open]);

  return (
    <>
      <motion.header initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.2, ease: [0.2, 0.7, 0.2, 1] }}
        className="fixed inset-x-0 z-50 px-3 sm:px-5" style={{ top: "calc(env(safe-area-inset-top, 0px) + 12px)" }}>
        <div className={cn("mx-auto flex max-w-[1320px] items-center gap-4 rounded-full border py-2 pl-3 pr-2 transition-all duration-500 sm:pl-4",
          scrolled ? "border-line bg-white/85 shadow-[0_10px_40px_-20px_rgba(19,33,28,.35)] backdrop-blur-xl" : "border-transparent bg-white/0")}>
          <Logo />
          <nav aria-label="Navigation principale" className="ml-auto hidden items-center gap-1 lg:flex">
            {nav.map((n) => (
              <a key={n.id} href={`#${n.id}`} className={cn("relative rounded-full px-3.5 py-2 text-[14px] text-ink/75 transition-colors hover:text-ink", n.large && "hidden xl:block")}>
                {active === n.id && (
                  <motion.span layoutId="navpill" className="absolute inset-0 rounded-full bg-cross-soft" transition={{ type: "spring", bounce: 0.2, duration: 0.5 }} />
                )}
                <span className="relative">{n.label}</span>
              </a>
            ))}
          </nav>
          <a href="#contact" className="btn-main ml-auto hidden py-2.5 text-[14px] sm:inline-flex lg:ml-2">Nous contacter</a>
          <button onClick={() => setOpen(true)} aria-label="Ouvrir le menu" aria-expanded={open}
            className="ml-auto grid h-11 w-11 place-items-center rounded-full bg-ink text-white sm:ml-0 lg:hidden"><Menu size={19} /></button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div role="dialog" aria-modal="true" aria-label="Menu"
            initial={{ clipPath: "circle(0% at 92% 4%)" }} animate={{ clipPath: "circle(150% at 92% 4%)" }} exit={{ clipPath: "circle(0% at 92% 4%)" }}
            transition={{ duration: 0.7, ease: [0.7, 0, 0.2, 1] }}
            className="fixed inset-0 z-[60] flex flex-col bg-cross-mist px-5 pb-8" style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 20px)" }}>
            <div className="flex items-center justify-between">
              <Logo />
              <button onClick={() => setOpen(false)} aria-label="Fermer le menu" className="grid h-11 w-11 place-items-center rounded-full bg-ink text-white"><X size={19} /></button>
            </div>
            <nav className="mt-10 flex flex-col">
              {[{ id: "top", label: "Accueil" }, ...nav, { id: "contact", label: "Contact" }].map((n, i) => (
                <motion.a key={n.id} href={`#${n.id}`} onClick={() => setOpen(false)}
                  initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 + i * 0.05, duration: 0.5 }}
                  className="flex items-baseline justify-between border-b border-ink/10 py-3 font-display text-[2.3rem] leading-tight">
                  {n.label}<span className="font-mono text-[11px] text-muted">→</span>
                </motion.a>
              ))}
            </nav>
            <a href={site.telephone.lien} className="btn-green mt-auto"><Phone size={17} /> {site.telephone.affichage}</a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
