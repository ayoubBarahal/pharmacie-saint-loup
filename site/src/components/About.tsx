import { HeartHandshake, MessagesSquare, Stethoscope } from "lucide-react";
import { useRef } from "react";
import interieur from "../assets/interieur.webp";
import { gsap, prefersReduced, useGSAP } from "../lib/gsap";
const values = [
  { Icon: HeartHandshake, t: "Un accueil attentif", d: "Chaque client est reçu avec disponibilité et discrétion, au comptoir comme à l'écart." },
  { Icon: MessagesSquare, t: "Des conseils sur mesure", d: "Traitements, petits maux, soins de la peau : nos conseils partent de votre situation." },
  { Icon: Stethoscope, t: "La prévention au quotidien", d: "Vaccination, hygiène de vie, suivi des traitements : un accompagnement au-delà de l'ordonnance." },
];

export default function About() {
  const root = useRef<HTMLElement>(null);
  useGSAP(() => {
    if (prefersReduced()) return;
    gsap.fromTo(".about-img", { yPercent: -8, scale: 1.15 }, { yPercent: 8, scale: 1.15, ease: "none",
      scrollTrigger: { trigger: ".about-media", start: "top bottom", end: "bottom top", scrub: true } });
    gsap.from(".about-media", { clipPath: "inset(18% 10% 18% 10% round 28px)", ease: "power2.out",
      scrollTrigger: { trigger: ".about-media", start: "top 90%", end: "top 40%", scrub: 0.6 } });
  }, { scope: root });

  return (
    <section id="pharmacie" ref={root} className="py-[clamp(90px,12vw,170px)]">
      <div className="wrap">
        <span className="eyebrow">Notre pharmacie</span>

        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="about-media relative aspect-[4/3] overflow-hidden rounded-[28px] lg:col-span-7">
            <img src={interieur} alt="Intérieur de la Pharmacie Saint-Loup : allées de rayons santé et soins, murs vert clair" loading="lazy"
              className="about-img absolute inset-0 h-full w-full object-cover object-[50%_55%]" />
          </div>
          <div className="flex flex-col justify-between gap-10 lg:col-span-5">
            <div>
              <h2 className="h-sec">Une pharmacie <em className="italic text-cross">de proximité.</em></h2>
            </div>
            <ul className="divide-y divide-line border-y border-line">
              {values.map(({ Icon, t, d }) => (
                <li key={t} className="group flex gap-4 py-5">
                  <Icon size={20} className="mt-1 shrink-0 text-cross transition-transform duration-500 group-hover:scale-110" />
                  <div>
                    <h3 className="font-sans text-[16px] font-medium tracking-normal">{t}</h3>
                    <p className="mt-1 text-[14.5px] text-muted">{d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
