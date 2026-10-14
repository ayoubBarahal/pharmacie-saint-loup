import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Loader2, Mail, MapPin, Phone, ShieldAlert, Share2, X } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { site } from "../data/site";
import { cn } from "../lib/cn";

type Errors = Partial<Record<"nom" | "coord" | "msg" | "rgpd", string>>;
// Clé d'accès Web3Forms (web3forms.com) : les messages sont envoyés à l'adresse e-mail liée à cette clé.
const FORM_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined;
const subjects = ["Question générale", "Livraison à domicile", "Vaccination", "Téléconsultation", "Parapharmacie", "Autre"];

export default function Contact({ onPrivacy }: { onPrivacy: () => void }) {
  const [v, setV] = useState({ nom: "", coord: "", objet: subjects[0], msg: "", rgpd: false });
  const [err, setErr] = useState<Errors>({});
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  useEffect(() => {
    const h = (e: Event) => setV((p) => ({ ...p, objet: (e as CustomEvent).detail }));
    window.addEventListener("set-subject", h);
    return () => window.removeEventListener("set-subject", h);
  }, []);

  const validate = () => {
    const e: Errors = {};
    if (v.nom.trim().length < 2) e.nom = "Indiquez votre nom et prénom.";
    const mail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.coord.trim());
    const tel = /^(\+33\s?|0)[1-9]([\s.-]?\d{2}){4}$/.test(v.coord.trim());
    if (!v.coord.trim()) e.coord = "Indiquez un téléphone ou un e-mail pour que nous puissions vous répondre.";
    else if (!mail && !tel) e.coord = "Format non reconnu. Exemple : 06 12 34 56 78 ou nom@exemple.fr";
    if (v.msg.trim().length < 10) e.msg = "Votre message doit contenir au moins 10 caractères.";
    if (!v.rgpd) e.rgpd = "Cochez la case pour accepter l'utilisation de vos coordonnées.";
    setErr(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (!FORM_KEY) return setState("error");
    setState("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: FORM_KEY,
          subject: `Site web — ${v.objet} — ${v.nom.trim()}`,
          from_name: "Site Pharmacie Saint-Loup",
          ...(v.coord.includes("@") ? { replyto: v.coord.trim() } : {}),
          "Nom et prénom": v.nom.trim(),
          "Téléphone ou e-mail": v.coord.trim(),
          Objet: v.objet,
          Message: v.msg.trim(),
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setState("done");
      setV({ nom: "", coord: "", objet: subjects[0], msg: "", rgpd: false });
    } catch {
      setState("error");
    }
  };

  const field = "w-full rounded-2xl border bg-paper px-4 py-3.5 text-[16px] outline-none transition focus:border-cross focus:bg-white focus:ring-4 focus:ring-cross/10";
  const Err = ({ k }: { k: keyof Errors }) => (
    <AnimatePresence>{err[k] && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-1.5 text-[13px] text-[#B3261E]">{err[k]}</motion.p>}</AnimatePresence>
  );

  const info = [
    { Icon: Phone, k: "Téléphone", v: <a href={site.telephone.lien} className="hover:text-cross">{site.telephone.affichage}</a> },
    ...(site.email ? [{ Icon: Mail, k: "E-mail", v: <a href={`mailto:${site.email}`}>{site.email}</a> }] : []),
    { Icon: MapPin, k: "Adresse", v: <a href={site.googleMaps} target="_blank" rel="noopener" className="hover:text-cross">{site.adresse.rue}, {site.adresse.cp} {site.adresse.ville}</a> },
    ...(site.reseaux.length ? [{ Icon: Share2, k: "Réseaux sociaux", v: site.reseaux.map((r) => <a key={r.url} href={r.url} className="mr-3 underline">{r.nom}</a>) }] : []),
  ];

  return (
    <section id="contact" className="py-[clamp(90px,12vw,170px)]">
      <div className="wrap grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <span className="eyebrow">Contact</span>
          <h2 className="h-sec mt-5">Une question ? <em className="italic text-cross">Parlons-en.</em></h2>
          <p className="mt-6 max-w-[44ch] text-muted">Le plus rapide reste de nous appeler ou de passer à l'officine. Pour une demande non urgente, utilisez le formulaire.</p>
          <ul className="mt-10 divide-y divide-line border-y border-line">
            {info.map(({ Icon, k, v }) => (
              <li key={k} className="flex gap-4 py-5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-cross-soft text-cross-deep"><Icon size={17} /></span>
                <div className="min-w-0"><div className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted">{k}</div><div className="mt-0.5 break-words text-[16px]">{v}</div></div>
              </li>
            ))}
          </ul>
        </div>

        <form onSubmit={submit} noValidate className="relative overflow-hidden rounded-[30px] border border-line bg-white p-6 shadow-[0_30px_80px_-50px_rgba(19,33,28,.4)] sm:p-10 lg:col-span-7">
          <div className="flex gap-3 rounded-2xl bg-peach/50 p-4 text-[14px] text-[#6B4320]">
            <ShieldAlert size={18} className="mt-0.5 shrink-0" />
            <p>Merci de ne pas transmettre d'ordonnance, de résultats d'analyse ni d'information médicale sensible par ce formulaire. Pour cela, appelez-nous ou venez à l'officine.</p>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div><label htmlFor="f-nom" className="mb-2 block text-[14px] font-medium">Nom et prénom</label>
              <input id="f-nom" autoComplete="name" value={v.nom} onChange={(e) => setV({ ...v, nom: e.target.value })} className={cn(field, err.nom ? "border-[#B3261E]" : "border-line")} /><Err k="nom" /></div>
            <div><label htmlFor="f-coord" className="mb-2 block text-[14px] font-medium">Téléphone ou e-mail</label>
              <input id="f-coord" value={v.coord} onChange={(e) => setV({ ...v, coord: e.target.value })} className={cn(field, err.coord ? "border-[#B3261E]" : "border-line")} /><Err k="coord" /></div>
          </div>
          <div className="mt-5">
            <span className="mb-2 block text-[14px] font-medium">Objet</span>
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Objet">
              {subjects.map((s) => (
                <button type="button" key={s} role="radio" aria-checked={v.objet === s} onClick={() => setV({ ...v, objet: s })}
                  className={cn("relative rounded-full border px-4 py-2 text-[14px] transition-colors", v.objet === s ? "border-ink text-white" : "border-line text-ink/80 hover:border-ink/40")}>
                  {v.objet === s && <motion.span layoutId="subject" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", bounce: 0.2, duration: 0.45 }} />}
                  <span className="relative">{s}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="mt-5"><label htmlFor="f-msg" className="mb-2 block text-[14px] font-medium">Message <span className="font-normal text-muted">(10 caractères minimum)</span></label>
            <textarea id="f-msg" rows={5} value={v.msg} onChange={(e) => setV({ ...v, msg: e.target.value })} className={cn(field, "resize-y", err.msg ? "border-[#B3261E]" : "border-line")} /><Err k="msg" /></div>
          <label htmlFor="f-rgpd" className="mt-5 flex items-start gap-3 text-[14px] text-muted">
            <input id="f-rgpd" type="checkbox" checked={v.rgpd} onChange={(e) => setV({ ...v, rgpd: e.target.checked })} className="mt-1 h-[18px] w-[18px] shrink-0 accent-[#0F7C6B]" />
            <span>J'accepte que mes coordonnées soient utilisées uniquement pour répondre à ma demande. <button type="button" onClick={onPrivacy} className="underline underline-offset-4">Politique de confidentialité</button></span>
          </label>
          <Err k="rgpd" />
          <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
            <span className="text-[13px] text-muted">Réponse pendant les horaires d'ouverture.</span>
            <button type="submit" disabled={state === "sending"} className="btn-main min-w-[220px] disabled:opacity-70">
              {state === "sending" ? <><Loader2 size={17} className="animate-spin" /> Envoi…</> : <>Envoyer le message <ArrowRight size={17} /></>}
            </button>
          </div>

          <AnimatePresence>
            {(state === "done" || state === "error") && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 grid place-items-center bg-white/95 p-8 text-center backdrop-blur">
                <motion.div initial={{ y: 20, scale: 0.96 }} animate={{ y: 0, scale: 1 }} transition={{ type: "spring", bounce: 0.3 }} className="max-w-[40ch]">
                  <span className={cn("mx-auto grid h-16 w-16 place-items-center rounded-full text-white", state === "done" ? "bg-cross" : "bg-[#B3261E]")}>{state === "done" ? <Check size={28} /> : <X size={28} />}</span>
                  <h3 className="mt-6 text-[2.2rem]">{state === "done" ? "Message envoyé." : "Envoi impossible."}</h3>
                  <p className="mt-3 text-muted">{state === "done"
                    ? "Merci, la pharmacie a bien reçu votre message. Nous vous répondons pendant les horaires d'ouverture."
                    : <>Votre message n'a pas pu être transmis. Réessayez dans un instant ou appelez-nous au {site.telephone.affichage}.</>}</p>
                  <button type="button" onClick={() => setState("idle")} className="btn-line mt-6">Revenir au formulaire</button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </section>
  );
}
