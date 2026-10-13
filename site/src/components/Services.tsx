import { AnimatePresence, motion } from "framer-motion";
import { Accessibility, ArrowUpRight, Droplets, HeartPulse, MessagesSquare, Plus, Syringe, Truck, Leaf } from "lucide-react";
import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "../lib/cn";
import MagicCard from "./ui/MagicCard";

type Svc = { Icon: LucideIcon; t: string; d: string; more: string; ok: boolean; cls: string; big?: boolean; href?: string };

const services: Svc[] = [
  { Icon: MessagesSquare, t: "Conseils pharmaceutiques personnalisés", d: "Explication de votre traitement, interactions, posologie, conseils pour les petits maux du quotidien.", more: "Nos pharmaciens vous reçoivent au comptoir ou à l'écart pour les questions plus personnelles. Pensez à apporter la liste de vos médicaments.", ok: true, cls: "lg:col-span-2 lg:row-span-2", big: true },
  { Icon: Syringe, t: "Vaccination", d: "Un espace dédié pour vous faire vacciner sur place.", more: "Vaccins proposés et modalités : voir la section Espace vaccination.", ok: true, cls: "", href: "#vaccination" },
  { Icon: Truck, t: "Livraison gratuite à domicile", d: "La pharmacie vient à vous.", more: "Contactez l'équipe pour organiser votre livraison.", ok: true, cls: "", href: "#livraison" },
  { Icon: HeartPulse, t: "Prévention et accompagnement", d: "Hygiène de vie, suivi des traitements au long cours.", more: "Bilan de prévention sans rendez-vous, aux horaires d'ouverture de la pharmacie.", ok: true, cls: "" },
  { Icon: Droplets, t: "Conseil en dermocosmétique", d: "Un avis sur votre peau et une routine adaptée.", more: "CeraVe, La Roche-Posay, Avène, Klorane… : demandez conseil à l'équipe pour choisir une routine adaptée.", ok: true, cls: "" },
  { Icon: Leaf, t: "Hygiène et bien-être", d: "Soins du quotidien, sommeil, vitalité, confort.", more: "Retrouvez nos rayons dans la section Parapharmacie.", ok: true, cls: "lg:col-span-2", href: "#parapharmacie" },
  { Icon: Accessibility, t: "Matériel médical", d: "Maintien à domicile et aide à la mobilité.", more: "Chaussures de confort, orthopédie et matériel de maintien à domicile : renseignez-vous au comptoir.", ok: true, cls: "lg:col-span-2" },
];

function Card({ s, i }: { s: Svc; i: number }) {
  const [open, setOpen] = useState(false);
  const isTodo = s.more.startsWith("[");
  return (
    <motion.div initial={{ y: 50 }} whileInView={{ y: 0 }} viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.9, delay: (i % 4) * 0.07, ease: [0.2, 0.7, 0.2, 1] }} className={cn("min-w-0", s.cls)}>
      <MagicCard className="h-full">
        <div className={cn("flex h-full flex-col p-6 sm:p-7", s.big && "lg:p-10")}>
          <div className="flex items-start justify-between gap-3">
            <span className={cn("grid place-items-center rounded-2xl bg-cross-soft text-cross-deep", s.big ? "h-14 w-14" : "h-11 w-11")}>
              <s.Icon size={s.big ? 24 : 19} />
            </span>
            <span className={cn("rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em]",
              s.ok ? "bg-cross-mist text-cross-deep" : "bg-peach/60 text-[#7A4B22]")}>{s.ok ? "Proposé" : "À confirmer"}</span>
          </div>
          <h3 className={cn("mt-6", s.big ? "text-[clamp(2.2rem,3.6vw,3.6rem)] leading-[1]" : "text-[1.55rem] leading-[1.1]")}>{s.t}</h3>
          <p className={cn("mt-3 text-muted", s.big ? "max-w-[42ch] text-[1.05rem]" : "text-[14.5px]")}>{s.d}</p>
          {s.big && (
            <div aria-hidden className="relative mt-10 hidden flex-1 lg:block">
              <div className="absolute bottom-0 right-0 font-display text-[11rem] italic leading-[0.8] text-cross-soft">Rx</div>
            </div>
          )}
          <div className="mt-auto pt-6">
            <div className="flex items-center gap-4 border-t border-line pt-4">
              <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open}
                className="-my-2 inline-flex items-center gap-2 py-2 text-[14px] font-medium text-cross-deep">
                <motion.span animate={{ rotate: open ? 45 : 0 }} className="grid h-6 w-6 place-items-center rounded-full bg-cross-soft"><Plus size={14} /></motion.span>
                En savoir plus
              </button>
              {s.href && <a href={s.href} aria-label={`Aller à la section ${s.t}`} className="ml-auto grid h-10 w-10 place-items-center rounded-full border border-line transition-colors hover:bg-ink hover:text-white"><ArrowUpRight size={15} /></a>}
            </div>
            <AnimatePresence initial={false}>
              {open && (
                <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35 }} className="overflow-hidden text-[14px] text-muted">
                  <span className="block pt-3">{isTodo ? <span className="todo whitespace-normal">{s.more}</span> : s.more}</span>
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </MagicCard>
    </motion.div>
  );
}

export default function Services() {
  return (
    <section id="services" className="py-[clamp(90px,12vw,170px)]">
      <div className="wrap">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <span className="eyebrow">Nos services</span>
            <h2 className="h-sec mt-5">Bien plus qu'une <em className="italic text-cross">délivrance d'ordonnance.</em></h2>
          </div>
          <p className="text-muted lg:col-span-4 lg:col-start-9">Votre pharmacie à Saint-Jean-de-Braye, aux portes d'Orléans : conseil, prévention et services de santé au quotidien.</p>
        </div>
        <div className="mt-14 grid auto-rows-[minmax(230px,auto)] gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => <Card key={s.t} s={s} i={i} />)}
        </div>
      </div>
    </section>
  );
}
