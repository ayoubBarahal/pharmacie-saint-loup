import { motion } from "framer-motion";
import { ArrowDownRight, MapPin, Phone, Syringe, Truck, Sparkles } from "lucide-react";
import { useRef } from "react";
import facade from "../assets/facade.webp";
import { site } from "../data/site";
import { gsap, prefersReduced, SplitText, useGSAP } from "../lib/gsap";
import Cross from "./ui/Cross";
import OpenStatus from "./ui/OpenStatus";
import ShimmerButton from "./ui/ShimmerButton";

const ease = [0.2, 0.7, 0.2, 1] as const;

function RotatingBadge() {
  const text = "LIVRAISON GRATUITE · À DOMICILE · ";
  return (
    <a href="#livraison" aria-label="Livraison gratuite à domicile — en savoir plus"
      className="group absolute -top-9 right-3 z-20 grid h-[104px] w-[104px] place-items-center rounded-full bg-peach shadow-[0_20px_50px_-20px_rgba(122,75,34,.45)] sm:right-10 sm:h-[156px] sm:w-[156px] lg:-top-16 lg:right-[14%]">
      <motion.svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full"
        animate={{ rotate: 360 }} transition={{ duration: 22, ease: "linear", repeat: Infinity }}>
        <defs><path id="circ" d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0" /></defs>
        <text className="fill-ink font-mono" fontSize="14.5" letterSpacing="3.2"><textPath href="#circ">{text + text}</textPath></text>
      </motion.svg>
      <span className="grid h-12 w-12 place-items-center rounded-full bg-white transition-transform duration-500 group-hover:rotate-90">
        <Cross className="h-5 w-5" color="#0F7C6B" />
      </span>
    </a>
  );
}

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (prefersReduced()) return;
    const split = SplitText.create(".hero-title", {
      type: "lines,words", mask: "lines", autoSplit: true,
      onSplit: (self) => gsap.from(self.words, { yPercent: 115, duration: 1.25, stagger: 0.07, ease: "expo.out", delay: 0.15 }),
    });

    const mm = gsap.matchMedia();
    mm.add("(min-width: 900px)", () => {
      gsap.fromTo(".hero-frame",
        { clipPath: "inset(0% 24% 0% 24% round 600px 600px 28px 28px)" },
        { clipPath: "inset(0% 0% 0% 0% round 28px 28px 28px 28px)", ease: "none",
          scrollTrigger: { trigger: ".hero-stage", start: "top 92%", end: "top 12%", scrub: 0.8 } });
      gsap.fromTo(".hero-img", { scale: 1.3, yPercent: -6 }, { scale: 1, yPercent: 6, ease: "none",
        scrollTrigger: { trigger: ".hero-stage", start: "top bottom", end: "bottom top", scrub: true } });
    });
    return () => split.revert();
  }, { scope: root });

  return (
    <section id="top" ref={root} className="relative overflow-x-clip pt-[120px] sm:pt-[150px]">
      {/* halo discret */}
      <div aria-hidden className="pointer-events-none absolute -top-40 left-1/2 h-[620px] w-[1100px] -translate-x-1/2 rounded-full bg-cross-soft/70 blur-[110px]" />
      <div className="wrap relative">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease }}
          className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 pb-5">
          <span className="flex flex-wrap items-center gap-3"><h1 className="eyebrow !font-mono !tracking-[0.18em]">Pharmacie Saint-Loup · {site.adresse.ville}, près d'Orléans</h1><OpenStatus /></span>
          <a href="#acces" className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted hover:text-ink">
            <MapPin size={13} /> {site.adresse.rue}
          </a>
        </motion.div>

        <p className="hero-title mt-8 font-display text-[clamp(3.3rem,11.2vw,11.5rem)] leading-[0.9] tracking-[-0.045em] sm:mt-10">
          Votre santé,<br />notre <em className="font-display italic text-cross">priorité.</em>
        </p>

        <div className="mt-10 grid gap-10 pb-24 lg:grid-cols-12 lg:items-end lg:pb-32">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.7, ease }} className="lg:col-span-5">
            <p className="max-w-[44ch] text-[1.13rem] leading-relaxed text-muted">
              Une équipe à votre écoute, des conseils personnalisés et des services de santé adaptés à votre quotidien.
            </p>
            <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap">
              <a href="#services" className="btn-main group">Découvrir nos services <ArrowDownRight size={17} className="transition-transform duration-300 group-hover:rotate-[-45deg]" /></a>
              <ShimmerButton href={site.telephone.lien}><Phone size={16} /> {site.telephone.affichage}</ShimmerButton>
            </div>
          </motion.div>
          <motion.ul initial="h" animate="s" variants={{ s: { transition: { staggerChildren: 0.1, delayChildren: 0.9 } } }}
            className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3 lg:col-span-6 lg:col-start-7">
            {[
              { href: "#livraison", Icon: Truck, t: "Livraison gratuite", s: "à proximité" },
              { href: "#parapharmacie", Icon: Sparkles, t: "Pharmacie", s: "& parapharmacie" },
              { href: "#vaccination", Icon: Syringe, t: "Espace", s: "vaccination" },
            ].map(({ href, Icon, t, s }) => (
              <motion.li key={href} variants={{ h: { opacity: 0, y: 18 }, s: { opacity: 1, y: 0, transition: { duration: 0.7, ease } } }}>
                <a href={href} className="group flex h-full items-center gap-4 bg-white/80 p-5 backdrop-blur transition-colors hover:bg-cross-mist sm:flex-col sm:items-start">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-cross-soft text-cross-deep transition-transform duration-500 group-hover:-rotate-12"><Icon size={18} /></span>
                  <span className="text-[15px] leading-snug"><b className="font-medium">{t}</b><br /><span className="text-muted">{s}</span></span>
                </a>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>

      <div className="hero-stage wrap relative">
        <RotatingBadge />
        <div className="hero-frame grain relative h-[clamp(380px,72svh,920px)] sm:h-[clamp(440px,86vh,920px)] overflow-hidden rounded-[28px] [clip-path:inset(0_0_0_0_round_28px)]">
          <img src={facade} alt="Façade verte de la Pharmacie Saint-Loup, rue du Faubourg de Bourgogne à Saint-Jean-de-Braye"
            {...{ fetchpriority: "high" }} className="hero-img absolute inset-0 h-full w-full object-cover object-[50%_46%]" />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/35 to-transparent" />
          <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-end justify-between gap-3 text-white sm:bottom-8 sm:left-8 sm:right-8">
            <p className="max-w-[24ch] font-display text-[clamp(1.5rem,2.6vw,2.4rem)] italic leading-tight">Au cœur du quartier Saint-Loup.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
