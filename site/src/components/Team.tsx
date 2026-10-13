import { motion } from "framer-motion";
import { site } from "../data/site";
import { cn } from "../lib/cn";
import Cross from "./ui/Cross";

export default function Team() {
  return (
    <section id="equipe" className="bg-white py-[clamp(90px,12vw,170px)]">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <span className="eyebrow">Notre équipe</span>
            <h2 className="h-sec mt-5 max-w-[14ch]">Les visages derrière <em className="italic text-cross">le comptoir.</em></h2>
          </div>
          <p className="max-w-[40ch] text-muted">Pharmaciens et préparateurs travaillent ensemble pour vous offrir un conseil fiable et un suivi dans la durée.</p>
        </div>

        <div className={cn("mt-12 mx-auto grid gap-7 sm:mt-14 sm:gap-5", site.equipe.length === 1 ? "max-w-[380px]" : site.equipe.length === 3 ? "sm:grid-cols-2 lg:max-w-[1100px] lg:grid-cols-3" : "sm:grid-cols-2 lg:max-w-[760px]")}>
          {site.equipe.map((m, i) => (
            <motion.article key={i} initial={{ y: 40 }} whileInView={{ y: 0 }} viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.9, delay: i * 0.08, ease: [0.2, 0.7, 0.2, 1] }} className="group flex items-start gap-4 sm:block">
              <div className="relative aspect-[4/5] w-[104px] shrink-0 overflow-hidden rounded-[18px] bg-cross-mist sm:w-auto sm:rounded-[22px]">
                {m.photo ? (
                  <img src={m.photo} alt={`${m.nom}, ${m.role}`} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <div className="absolute inset-0 grid place-items-center">
                    <Cross className="absolute h-[70%] w-[70%] text-cross-soft transition-transform duration-[1.2s] group-hover:rotate-90" />
                    <span className="relative hidden font-display text-[1.6rem] italic text-cross-deep/80 sm:inline">Portrait</span>
                  </div>
                )}
                {!m.photo && <span className="absolute left-3 top-3 hidden sm:inline-block rounded-full bg-white/85 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted backdrop-blur">Photo à venir</span>}
              </div>
              <div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-3 sm:mt-4">
                <div>
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-cross-deep">{m.role}</span>
                  <h3 className="mt-1 text-[1.35rem] leading-tight sm:text-[1.6rem]">{m.nom}</h3>
                </div>
              </div>
              <p className="mt-2 text-[14.5px] text-muted">{m.bio}</p></div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
