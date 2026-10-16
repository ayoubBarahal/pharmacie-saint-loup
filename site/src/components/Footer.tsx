import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Fragment, useEffect, type ReactNode } from "react";
import { nav, site } from "../data/site";
import { Logo } from "./Header";

export type LegalKey = "legal" | "privacy" | "cookies" | null;

const T = ({ children }: { children: ReactNode }) => <span className="todo whitespace-normal">{children}</span>;

const content: Record<Exclude<LegalKey, null>, { title: string; body: ReactNode }> = {
  legal: { title: "Mentions légales", body: (<>
    <h4>Éditeur du site</h4><p>Raison sociale : <T>[À compléter]</T> · Forme juridique et capital : <T>[À compléter]</T> · SIRET : <T>[À compléter]</T> · {site.adresse.rue}, {site.adresse.cp} {site.adresse.ville} · {site.telephone.affichage}{site.email && <> · {site.email}</>}.</p>
    <h4>Pharmacien titulaire</h4><p>Soufiane Ouârab · N° RPPS : <T>[À compléter]</T> · Inscription à l'Ordre national des pharmaciens, section A.</p>
    <h4>Licence et autorités</h4><p>N° de licence : <T>[À compléter]</T> · Agence Régionale de Santé Centre-Val de Loire · Ordre national des pharmaciens.</p>
    <h4>Directeur de la publication</h4><p><T>[À compléter]</T></p>
    <h4>Hébergeur</h4><p><T>[À compléter : nom, adresse, téléphone]</T></p>
    <h4>Crédits</h4><p>Conception et développement du site : Ing. Ayoub Barahal. Photographies : Pharmacie Saint-Loup. Composants adaptés de SmoothUI et Magic UI (licence MIT).</p>
  </>) },
  privacy: { title: "Confidentialité", body: (<>
    <p>Les données saisies dans le formulaire de contact (nom, coordonnées, message) servent uniquement à répondre à votre demande. Elles ne sont ni vendues ni cédées.</p>
    <h4>Responsable du traitement</h4><p>Soufiane Ouârab, pharmacien titulaire.</p>
    <h4>Vos droits</h4><p>Droit d'accès, de rectification et d'effacement, à exercer auprès de la pharmacie. Réclamation possible auprès de la CNIL.</p>
    <h4>Données de santé</h4><p>Ce formulaire n'est pas conçu pour recevoir des données de santé. Merci de ne pas y transmettre d'ordonnance ni d'information médicale.</p>
  </>) },
  cookies: { title: "Cookies", body: (<p>Cette version du site ne dépose aucun cookie de mesure d'audience ni publicitaire. Si un outil de statistiques ou un module tiers est ajouté, un bandeau de consentement devra être mis en place avant tout dépôt.</p>) },
};

export function LegalModal({ open, onClose }: { open: LegalKey; onClose: () => void }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[70] grid place-items-center bg-ink/40 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div role="dialog" aria-modal="true" aria-label={content[open].title} onClick={(e) => e.stopPropagation()}
            initial={{ y: 40, scale: 0.97 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
            className="max-h-[82vh] w-full max-w-[640px] overflow-y-auto rounded-[28px] bg-white p-7 sm:p-9 [&_h4]:mt-5 [&_h4]:font-medium [&_p]:mt-1.5 [&_p]:text-[14.5px] [&_p]:text-muted" data-lenis-prevent>
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-[2.4rem] leading-none">{content[open].title}</h2>
              <button onClick={onClose} aria-label="Fermer" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-paper hover:bg-cross-soft"><X size={18} /></button>
            </div>
            <div className="mt-4">{content[open].body}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Footer({ onLegal }: { onLegal: (k: LegalKey) => void }) {
  const hours = site.horaires.some((h) => h.plages);
  return (
    <footer className="relative overflow-hidden bg-cross-mist pt-20">
      <div className="wrap grid gap-12 pb-16 sm:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo />
          <p className="mt-5 max-w-[34ch] text-[14.5px] text-muted">Pharmacie à Saint-Jean-de-Braye, près d'Orléans : conseil, parapharmacie, vaccination, téléconsultation et livraison gratuite à domicile à proximité.</p>
        </div>
        <div className="lg:col-span-2">
          <h4 className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted">Navigation</h4>
          <ul className="mt-3 grid text-[14.5px] sm:mt-4 sm:gap-2.5">{nav.map((n) => <li key={n.id}><a href={`#${n.id}`} className="block py-1.5 hover:text-cross sm:inline sm:py-0">{n.label}</a></li>)}</ul>
        </div>
        <div className="lg:col-span-3">
          <h4 className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted">Coordonnées</h4>
          <ul className="mt-4 grid gap-2.5 text-[14.5px]">
            <li>{site.adresse.rue}<br />{site.adresse.cp} {site.adresse.ville}</li>
            <li><a href={site.telephone.lien} className="hover:text-cross">{site.telephone.affichage}</a></li>
            {site.email && <li><a href={`mailto:${site.email}`} className="hover:text-cross">{site.email}</a></li>}
            <li><a href={site.googleMaps} target="_blank" rel="noopener" className="underline underline-offset-4 hover:text-cross">Voir sur Google Maps</a></li>
          </ul>
        </div>
        <div className="lg:col-span-3">
          <h4 className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted">Horaires</h4>
          <div className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-[14px] text-muted [font-variant-numeric:tabular-nums]">
            {hours ? site.horaires.map((h) => <Fragment key={h.jour}><span>{h.jour}</span><span>{h.plages ? h.plages.join(" · ") : "Fermé"}</span></Fragment>)
              : <><span>Lun – Sam</span><span className="todo">[À compléter]</span><span>Dimanche</span><span className="todo">[À compléter]</span></>}
          </div>
        </div>
      </div>
      <div className="wrap flex flex-wrap items-center justify-between gap-4 border-t border-ink/10 py-6 text-[13px] text-muted">
        <span>© {new Date().getFullYear()} {site.nom} · Site réalisé par Ing. Ayoub Barahal</span>
        <div className="flex flex-wrap gap-5">
          <button onClick={() => onLegal("legal")} className="py-2 hover:text-ink">Mentions légales</button>
          <button onClick={() => onLegal("privacy")} className="py-2 hover:text-ink">Confidentialité</button>
          <button onClick={() => onLegal("cookies")} className="py-2 hover:text-ink">Cookies</button>
        </div>
      </div>
      <div aria-hidden className="pointer-events-none select-none overflow-hidden pb-24 sm:pb-6">
        <div className="wrap">
          <div className="font-display text-[22vw] italic leading-[0.78] tracking-[-0.05em] text-cross/[0.13] lg:text-[17.5rem] xl:text-[20rem]">Saint-Loup</div>
        </div>
      </div>
    </footer>
  );
}
