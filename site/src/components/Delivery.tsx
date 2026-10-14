import { Check, Copy, Home, MapPin, Phone, Truck } from "lucide-react";
import { useRef, useState } from "react";
import { site } from "../data/site";
import { gsap, prefersReduced, SplitText, useGSAP } from "../lib/gsap";
import Cross from "./ui/Cross";

function CopyNumber() {
  const [ok, setOk] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(site.telephone.affichage); setOk(true); setTimeout(() => setOk(false), 1800); } catch { /* sélection manuelle */ }
  };
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white py-1.5 pl-4 pr-1.5 font-mono text-[15px]">
      {site.telephone.affichage}
      <button type="button" onClick={copy} className="inline-flex items-center gap-1.5 rounded-full bg-cross-mist px-3 py-1.5 font-sans text-[12.5px] text-cross-deep">
        {ok ? <Check size={13} /> : <Copy size={13} />}{ok ? "Copié" : "Copier"}
      </button>
    </span>
  );
}

export default function Delivery() {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (prefersReduced()) return;
    const s = SplitText.create(".del-title", { type: "lines,words", mask: "lines" });
    gsap.from(s.words, { yPercent: 110, stagger: 0.06, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: ".del-title", start: "top 85%" } });
    gsap.fromTo(".route", { drawSVG: "0%" }, { drawSVG: "100%", ease: "none", scrollTrigger: { trigger: ".route-wrap", start: "top 85%", end: "top 35%", scrub: 0.6 } });
    gsap.from(".del-media", { clipPath: "inset(100% 0% 0% 0% round 28px)", duration: 1.4, ease: "expo.inOut", scrollTrigger: { trigger: ".del-media", start: "top 80%" } });
    gsap.fromTo(".del-img", { scale: 1.25 }, { scale: 1, ease: "none", scrollTrigger: { trigger: ".del-media", start: "top bottom", end: "bottom top", scrub: true } });
    return () => s.revert();
  }, { scope: root });

  return (
    <section id="livraison" ref={root} className="relative overflow-hidden bg-cross-mist py-[clamp(90px,12vw,170px)]">
      <div className="wrap grid grid-cols-1 gap-14 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-6">
          <span className="eyebrow">Livraison gratuite à domicile</span>
          <h2 className="del-title mt-6 text-[clamp(3rem,7.4vw,7rem)] leading-[0.92] tracking-[-0.04em]">
            La pharmacie <em className="italic text-cross">vient à vous.</em>
          </h2>
          <p className="mt-7 max-w-[46ch] text-[1.08rem] text-muted">
            Vous habitez à proximité de la pharmacie ? Profitez de notre service de livraison gratuite à domicile pour plus de simplicité au quotidien. Contactez notre équipe pour connaître les modalités et organiser votre livraison.
          </p>

          {/* trajet officine → domicile, tracé au défilement */}
          <div className="route-wrap mt-10 flex items-center gap-3" aria-hidden>
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-cross"><Cross className="h-5 w-5" color="#fff" /></span>
            <svg viewBox="0 0 400 60" className="h-12 min-w-0 flex-1" preserveAspectRatio="none" fill="none">
              <path d="M2 30 C 70 -6, 120 66, 200 30 S 330 -6, 398 30" stroke="#C9E5DD" strokeWidth="2" strokeDasharray="2 7" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
              <path className="route" d="M2 30 C 70 -6, 120 66, 200 30 S 330 -6, 398 30" stroke="#0F7C6B" strokeWidth="2.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            </svg>
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-peach text-ink"><Home size={20} /></span>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a href={site.telephone.lien} className="btn-green"><Phone size={17} /> Organiser ma livraison</a>
            <CopyNumber />
          </div>
          <p className="mt-5 max-w-[60ch] text-[13px] text-muted">
            La livraison de médicaments est soumise à la réglementation en vigueur et aux conditions de délivrance de la pharmacie. Pour un médicament sur ordonnance, l'original de l'ordonnance reste nécessaire.
          </p>
        </div>

        <div className="lg:col-span-5 lg:col-start-8">
          <div className="del-media relative aspect-square overflow-hidden rounded-[28px] sm:aspect-[3/4]">
            <div className="del-img grain absolute inset-0 bg-cross" aria-hidden>
              <Cross className="absolute -right-[18%] -top-[12%] h-[75%] w-[75%] text-white/10" />
              <Cross className="absolute -bottom-[10%] -left-[14%] h-[45%] w-[45%] text-white/[0.07]" />
            </div>
            <div className="absolute inset-0 flex flex-col justify-between p-7 text-white sm:p-9">
              <span className="grid h-16 w-16 place-items-center rounded-2xl bg-white/15 backdrop-blur"><Truck size={30} /></span>
              <div>
                <p className="font-display text-[clamp(2.4rem,4vw,3.6rem)] leading-[0.95] tracking-[-0.03em]">Livraison<br />gratuite<br />à domicile</p>
                <p className="mt-5 flex items-start gap-2 text-[14.5px] text-white/80"><MapPin size={16} className="mt-0.5 shrink-0" />Pour les patients habitant à proximité de la pharmacie</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
