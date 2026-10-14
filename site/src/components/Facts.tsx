import { useRef } from "react";
import { site } from "../data/site";
import { gsap, prefersReduced, ScrollTrigger, useGSAP } from "../lib/gsap";
import { weeklyHours } from "../lib/hours";
import NumberTicker from "./ui/NumberTicker";

const facts = [
  { v: site.horaires.filter((h) => h.plages).length, suffix: " j / 7", t: "Ouverts du lundi au samedi" },
  { v: weeklyHours(), suffix: " h", t: "D'ouverture chaque semaine" },
  { v: site.nbEquipe, suffix: "", t: "Membres de l'équipe à votre écoute" },
  { v: 0, suffix: " €", t: "Frais de livraison à proximité" },
];

export default function Facts() {
  const root = useRef<HTMLElement>(null);
  // gsap-skills : ScrollTrigger.batch pour un groupe d'éléments, autoAlpha, scope + nettoyage via useGSAP
  useGSAP(() => {
    if (prefersReduced()) return;
    gsap.set(".fact", { yPercent: 40, autoAlpha: 0 });
    ScrollTrigger.batch(".fact", {
      start: "top 88%", once: true,
      onEnter: (els) => gsap.to(els, { yPercent: 0, autoAlpha: 1, duration: 1, stagger: 0.12, ease: "expo.out" }),
    });
  }, { scope: root });

  return (
    <section ref={root} aria-label="La pharmacie en chiffres" className="py-[clamp(60px,8vw,110px)]">
      <div className="wrap">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[24px] border border-line bg-line lg:grid-cols-4">
          {facts.map((f, i) => (
            <div key={f.t} className="fact bg-paper p-5 sm:p-9">
              <div className="font-display text-[clamp(2.3rem,5.5vw,4.8rem)] leading-none tracking-[-0.04em]">
                <NumberTicker value={f.v} delay={0.15 * i} /><span className="text-cross">{f.suffix}</span>
              </div>
              <p className="mt-2 max-w-[22ch] text-[13px] leading-snug text-muted sm:mt-3 sm:text-[14.5px]">{f.t}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
