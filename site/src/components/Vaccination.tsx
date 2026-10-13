import { motion } from "framer-motion";
import { ArrowRight, CalendarClock, Lock, Phone, ShieldCheck } from "lucide-react";
import { site } from "../data/site";

export default function Vaccination() {
  const items = [
    { Icon: Lock, t: "Un espace confidentiel", d: <>Une pièce dédiée, au calme, à l'écart du comptoir.</> },
    { Icon: ShieldCheck, t: "Vaccins proposés", d: site.vaccins ? site.vaccins.join(" · ") : <span className="todo whitespace-normal">[À confirmer : grippe saisonnière, Covid-19, autres selon habilitation]</span> },
    { Icon: CalendarClock, t: "Modalités", d: site.vaccinationModalites ?? <span className="todo whitespace-normal">[À compléter : avec ou sans rendez-vous, créneaux, documents à apporter]</span> },
  ];

  return (
    <section id="vaccination" className="py-[clamp(90px,12vw,170px)]">
      <div className="wrap">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <span className="eyebrow">Espace vaccination</span>
            <h2 className="h-sec mt-5">Prenez soin de votre santé, <em className="italic text-cross">simplement.</em></h2>
            <p className="mt-6 max-w-[46ch] text-[1.08rem] text-muted">
              Notre équipe vous accompagne dans votre parcours de prévention et vous renseigne sur les vaccinations proposées au sein de la pharmacie.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#contact" data-subject="Vaccination" className="btn-main group">Se renseigner sur la vaccination <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></a>
              <a href={site.telephone.lien} className="btn-line"><Phone size={16} /> {site.telephone.affichage}</a>
            </div>
          </div>
          <ul className="lg:col-span-5 lg:col-start-8">
            {items.map(({ Icon, t, d }, i) => (
              <motion.li key={t} initial={{ x: 30 }} whileInView={{ x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: i * 0.1, ease: [0.2, 0.7, 0.2, 1] }}
                className="flex gap-5 border-t border-line py-6 last:border-b">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-cross-soft text-cross-deep"><Icon size={19} /></span>
                <div><h3 className="font-sans text-[16px] font-medium tracking-normal">{t}</h3><p className="mt-1 text-[14.5px] text-muted">{d}</p></div>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
