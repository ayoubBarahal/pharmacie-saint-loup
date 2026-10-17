import { motion } from "framer-motion";
import { Car, Navigation, Phone } from "lucide-react";
import { site } from "../data/site";
import { cn } from "../lib/cn";
import Cross from "./ui/Cross";
import OpenStatus from "./ui/OpenStatus";
import parking from "../assets/parking.webp";

function MapArt() {
  return (
    <svg viewBox="0 0 800 560" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
      <rect width="800" height="560" fill="#F3F2EC" />
      {[...Array(14)].map((_, i) => (
        <rect key={i} x={(i * 137) % 760} y={(i * 89) % 470} width={60 + ((i * 31) % 90)} height={40 + ((i * 23) % 60)} rx="6" fill="#E4ECE6" />
      ))}
      <g stroke="#FFFFFF" strokeWidth="10" strokeLinecap="round">
        <path d="M120 0 L180 560" /><path d="M420 0 L380 560" /><path d="M640 0 L700 560" />
        <path d="M0 150 L800 120" /><path d="M0 400 L800 440" />
      </g>
      {/* Loire */}
      <path d="M-20 520 C 200 470, 420 560, 820 480" stroke="#D4E8F0" strokeWidth="46" fill="none" />
      <text x="560" y="530" className="fill-[#8FB3C2] font-mono" fontSize="12" letterSpacing="3">LOIRE</text>
      {/* Faubourg de Bourgogne */}
      <path d="M-10 300 C 220 286, 520 262, 810 236" stroke="#0F7C6B" strokeOpacity=".55" strokeWidth="9" fill="none" strokeLinecap="round" />
      <text x="40" y="282" className="fill-[#0B5C50] font-mono" fontSize="12" letterSpacing="2.5" transform="rotate(-2 40 282)">RUE DU FAUBOURG DE BOURGOGNE</text>
    </svg>
  );
}

export default function Access() {
  const today = new Date().getDay();
  const filled = site.horaires.some((h) => h.plages);
  return (
    <section id="acces" className="bg-white py-[clamp(90px,12vw,170px)]">
      <div className="wrap">
        <span className="eyebrow">Localisation et accès</span>
        <h2 className="h-sec mt-5">Nous <em className="italic text-cross">trouver.</em></h2>

        <div className="mt-14 grid gap-4 lg:grid-cols-12">
          <div className="relative min-h-[460px] overflow-hidden rounded-[28px] border border-line lg:col-span-7 lg:min-h-[560px]">
            <MapArt />
            <div className="absolute left-1/2 top-[30%] -translate-x-1/2 -translate-y-full sm:top-[44%]">
              <motion.span className="absolute left-1/2 top-[58px] h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cross/25"
                animate={{ scale: [0.6, 1.8], opacity: [0.7, 0] }} transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }} />
              <span className="relative grid h-14 w-14 place-items-center rounded-[50%_50%_50%_6px] bg-cross shadow-[0_14px_30px_-10px_rgba(11,92,80,.7)] [transform:rotate(-45deg)]">
                <Cross className="h-6 w-6 [transform:rotate(45deg)]" color="#fff" />
              </span>
            </div>
            <div className="absolute inset-x-3 bottom-3 rounded-[22px] bg-white/92 p-5 backdrop-blur-md sm:inset-x-4 sm:bottom-4 sm:p-6">
              <address className="font-display text-[clamp(1.4rem,2.2vw,1.9rem)] not-italic leading-tight">
                {site.adresse.rue}<br />{site.adresse.cp} {site.adresse.ville}
              </address>
              <div className="mt-4 flex flex-wrap gap-2.5">
                <a href={site.itineraire} target="_blank" rel="noopener" className="btn-green py-3"><Navigation size={16} /> Itinéraire</a>
                <a href={site.googleMaps} target="_blank" rel="noopener" className="btn-line py-3">Ouvrir dans Google Maps</a>
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:col-span-5">
            <div className="rounded-[28px] border border-line bg-paper p-6 sm:p-8">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-[1.8rem]">Horaires</h3>
                <OpenStatus />
                {!filled && <span className="rounded-full bg-peach/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[#7A4B22]">À compléter</span>}
              </div>
              <table className="mt-4 w-full text-[15px] [font-variant-numeric:tabular-nums]">
                <tbody>
                  {site.horaires.map((h) => (
                    <tr key={h.jour} className={cn("border-b border-line last:border-0", h.d === today && "text-cross-deep")}>
                      <th className="py-2.5 text-left font-normal">
                        {h.d === today && <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-cross align-middle" />}{h.jour}
                      </th>
                      <td className={cn("py-2.5 text-right", h.d === today ? "font-medium" : "text-muted")}>{h.plages ? h.plages.join(" · ") : "Fermé"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-4 text-[13px] text-muted">Pharmacie de garde : 3237 ou <a className="underline underline-offset-4" href="https://www.3237.fr" target="_blank" rel="noopener">3237.fr</a>. Urgence vitale : 15.</p>
            </div>
            <div className="rounded-[28px] border border-line bg-paper p-6 sm:p-8">
              <h3 className="text-[1.8rem]">Accès pratique</h3>
              <ul className="mt-4 grid gap-3.5 text-[15px]">
                <li className="flex gap-3"><Phone size={17} className="mt-1 shrink-0 text-cross" /><a href={site.telephone.lien}>{site.telephone.affichage}</a></li>
                <li className="flex gap-3"><Car size={17} className="mt-1 shrink-0 text-cross" /><span>Stationnement : parking de la pharmacie réservé à notre clientèle, voitures et vélos.</span></li>
              </ul>
              <img src={parking} alt="Panneau « Parking pharmacie, réservé à notre clientèle » pour voitures et vélos" loading="lazy"
                className="mt-6 aspect-[3/2] w-full rounded-2xl object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
