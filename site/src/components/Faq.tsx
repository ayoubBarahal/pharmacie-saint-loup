import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";
import { faq } from "../data/faq";
import { cn } from "../lib/cn";

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="py-[clamp(90px,12vw,170px)]">
      <div className="wrap grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <span className="eyebrow">Questions fréquentes</span>
          <h2 className="h-sec mt-5">Vos questions, <em className="italic text-cross">nos réponses.</em></h2>
        </div>
        <ul className="divide-y divide-line border-y border-line lg:col-span-7 lg:col-start-6">
          {faq.map(({ q, a }, i) => {
            const on = open === i;
            return (
              <li key={q}>
                <h3 className="font-sans text-[16px] font-medium tracking-normal sm:text-[17px]">
                  <button type="button" onClick={() => setOpen(on ? null : i)} aria-expanded={on} aria-controls={`faq-${i}`}
                    className="flex w-full items-center justify-between gap-5 py-5 text-left">
                    {q}
                    <motion.span animate={{ rotate: on ? 45 : 0 }} className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-full transition-colors", on ? "bg-cross text-white" : "bg-cross-soft text-cross-deep")}>
                      <Plus size={16} />
                    </motion.span>
                  </button>
                </h3>
                {/* réponse toujours présente dans la page (lisible par Google), repliée visuellement */}
                <motion.div id={`faq-${i}`} initial={false} animate={{ height: on ? "auto" : 0, opacity: on ? 1 : 0 }}
                  transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }} className="overflow-hidden" aria-hidden={!on}>
                  <p className="max-w-[62ch] pb-6 pr-12 text-[15px] text-muted">{a}</p>
                </motion.div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
