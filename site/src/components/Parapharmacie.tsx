import { ArrowRight } from "lucide-react";
import entree from "../assets/entree.webp";
import hygiene from "../assets/hygiene.webp";
import rayonSante from "../assets/rayon-sante.webp";
import rayons from "../assets/rayons.webp";
import HoverExpand from "./ui/HoverExpand";

const items = [
  { id: "rayons", tag: "Dermocosmétique", title: "Nos rayons soins", description: "Soins du visage, du corps et des cheveux : un large choix de marques dermatologiques, conseillé par l'équipe.", image: rayons },
  { id: "sante", tag: "Au quotidien", title: "Santé et premiers soins", description: "Douleurs, pansements, hygiène intime, froid et chaud : l'essentiel pour se soigner au quotidien.", image: rayonSante },
  { id: "hygiene", tag: "Hygiène", title: "Hygiène bucco-dentaire", description: "Brosses à dents, brossettes, dentifrices et bains de bouche, pour toute la famille.", image: hygiene },
  { id: "confort", tag: "Confort", title: "Confort et orthopédie", description: "Chaussures de confort, protections et soins du quotidien, dès l'entrée de la pharmacie.", image: entree },
];

export default function Parapharmacie() {
  return (
    <section id="parapharmacie" className="bg-white py-[clamp(90px,12vw,170px)]">
      <div className="wrap">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <span className="eyebrow">Parapharmacie</span>
            <h2 className="h-sec mt-5">Beauté, soins <em className="italic text-cross">et bien-être.</em></h2>
          </div>
          <p className="text-muted lg:col-span-4 lg:col-start-9">
            Une sélection de soins choisis en officine. Le bon produit est d'abord celui qui convient à votre peau : venez en parler avec l'équipe.
          </p>
        </div>
        <HoverExpand items={items} className="mt-14" />
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 text-[14px] text-muted">
          <span>Site vitrine : pas de vente en ligne. Produits et disponibilités en officine.</span>
          <a href="#contact" data-subject="Parapharmacie" className="btn-line group">Poser une question <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></a>
        </div>
      </div>
    </section>
  );
}
