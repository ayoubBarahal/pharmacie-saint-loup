import { motion } from "framer-motion";
import { Clock, MonitorSmartphone, Phone, ShieldCheck, Stethoscope } from "lucide-react";
import { useRef } from "react";
import teleconsultation from "../assets/teleconsultation.webp";
import { site } from "../data/site";
import { gsap, prefersReduced, useGSAP } from "../lib/gsap";

const points = [
  { Icon: Stethoscope, t: "Un médecin en quelques minutes", d: "Consultez un médecin à distance, directement depuis la pharmacie." },
  { Icon: ShieldCheck, t: "Une cabine fermée", d: "Un espace isolé et confidentiel, avec casque audio pour l'échange." },
  { Icon: Clock, t: "Aux horaires de la pharmacie", d: "Sans rendez-vous : l'équipe vous installe et vous accompagne." },
];

export default function Teleconsultation() {
  const root = useRef<HTMLElement>(null);
  useGSAP(() => {
    if (prefersReduced()) return;
    gsap.from(".tc-media", { clipPath: "inset(0% 100% 0% 0% round 28px)", duration: 1.5, ease: "expo.inOut", scrollTrigger: { trigger: ".tc-media", start: "top 80%" } });
    gsap.fromTo(".tc-img", { scale: 1.25 }, { scale: 1, ease: "none", scrollTrigger: { trigger: ".tc-media", start: "top bottom", end: "bottom top", scrub: true } });
  }, { scope: root });

  return (
    <section id="teleconsultation" ref={root} className="bg-white py-[clamp(90px,12vw,170px)]">
      <div className="wrap grid grid-cols-1 gap-14 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-5">
          <div className="tc-media relative aspect-[4/5] overflow-hidden rounded-[28px] sm:aspect-[3/4]">
            <img src={teleconsultation} alt="Cabine de téléconsultation Medadom de la Pharmacie Saint-Loup, avec écran, instruments de mesure et casque" loading="lazy"
              className="tc-img absolute inset-0 h-full w-full object-cover object-[60%_50%]" />
          </div>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <span className="eyebrow">Téléconsultation</span>
          <h2 className="h-sec mt-5">Un médecin, <em className="italic text-cross">sur place.</em></h2>
          <p className="mt-6 max-w-[46ch] text-[1.08rem] text-muted">
            Pas de médecin disponible ? Notre cabine de téléconsultation Medadom vous met en relation avec un médecin par vidéo, équipée d'instruments connectés pour un examen à distance.
          </p>
          <ul className="mt-10">
            {points.map(({ Icon, t, d }, i) => (
              <motion.li key={t} initial={{ x: 30 }} whileInView={{ x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: i * 0.1, ease: [0.2, 0.7, 0.2, 1] }}
                className="flex gap-5 border-t border-line py-6 last:border-b">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-cross-soft text-cross-deep"><Icon size={19} /></span>
                <div><h3 className="font-sans text-[16px] font-medium tracking-normal">{t}</h3><p className="mt-1 text-[14.5px] text-muted">{d}</p></div>
              </motion.li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#contact" data-subject="Téléconsultation" className="btn-main"><MonitorSmartphone size={16} /> Se renseigner</a>
            <a href={site.telephone.lien} className="btn-line"><Phone size={16} /> {site.telephone.affichage}</a>
          </div>
        </div>
      </div>
    </section>
  );
}
