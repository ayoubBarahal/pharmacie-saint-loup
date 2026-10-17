import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, ExternalLink, FileText, Loader2, Lock, MessageCircle, Store, Upload, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type DragEvent, type FormEvent } from "react";
import { site } from "../data/site";
import { cn } from "../lib/cn";

type Field = "nom" | "prenom" | "naissance" | "tel" | "fichiers" | "rgpd";
type Errors = Partial<Record<Field, string>>;

const MAX_FILES = 5;
const MAX_TOTAL = 4_000_000; // limite d'envoi de l'hébergeur (4,5 Mo), avec une marge
const ACCEPT = "application/pdf,image/jpeg,image/png,image/webp,image/heic,image/heif";
const today = new Date().toISOString().slice(0, 10);
const mo = (n: number) => `${(n / 1_000_000).toFixed(1).replace(".", ",")} Mo`;

// Les photos de téléphone (3 à 8 Mo) sont réduites à 2000 px en JPEG : l'ordonnance reste lisible et l'envoi passe.
async function shrink(file: File): Promise<File> {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type) || file.size < 900_000) return file;
  try {
    const img = await createImageBitmap(file);
    const k = Math.min(1, 2000 / Math.max(img.width, img.height));
    const c = Object.assign(document.createElement("canvas"), { width: Math.round(img.width * k), height: Math.round(img.height * k) });
    c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
    const blob = await new Promise<Blob | null>((r) => c.toBlob(r, "image/jpeg", 0.82));
    return blob && blob.size < file.size ? new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" }) : file;
  } catch {
    return file;
  }
}

const steps = [
  { Icon: Upload, t: "Envoyez votre ordonnance", d: "Une photo nette ou un PDF, avec vos nom, prénom et date de naissance." },
  { Icon: Check, t: "Nous préparons votre traitement", d: "Le pharmacien vérifie l'ordonnance et vous appelle si un produit doit être commandé." },
  { Icon: Store, t: "Récupérez-le à la pharmacie", d: "Présentez l'ordonnance originale et votre carte Vitale au comptoir." },
];

export default function Ordonnance({ onPrivacy }: { onPrivacy: () => void }) {
  const empty = { nom: "", prenom: "", naissance: "", tel: "", message: "", website: "", rgpd: false };
  const [v, setV] = useState(empty);
  const [files, setFiles] = useState<File[]>([]);
  const [err, setErr] = useState<Errors>({});
  const [drag, setDrag] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const input = useRef<HTMLInputElement>(null);
  const total = files.reduce((n, f) => n + f.size, 0);
  const previews = useMemo(() => files.map((f) => (/^image\/(jpeg|png|webp)$/.test(f.type) ? URL.createObjectURL(f) : null)), [files]);
  useEffect(() => () => previews.forEach((u) => u && URL.revokeObjectURL(u)), [previews]);

  const add = async (list: FileList | null) => {
    if (!list?.length) return;
    const picked = Array.from(list).filter((f) => ACCEPT.split(",").includes(f.type));
    const next = [...files, ...(await Promise.all(picked.map(shrink)))].slice(0, MAX_FILES);
    setFiles(next);
    setErr((e) => ({ ...e, fichiers: picked.length < list.length ? "Formats acceptés : photo (JPEG, PNG, HEIC) ou PDF." : undefined }));
    if (input.current) input.current.value = "";
  };
  const onDrop = (e: DragEvent) => { e.preventDefault(); setDrag(false); add(e.dataTransfer.files); };

  const validate = () => {
    const e: Errors = {};
    if (!v.nom.trim()) e.nom = "Indiquez votre nom.";
    if (!v.prenom.trim()) e.prenom = "Indiquez votre prénom.";
    if (!v.naissance || v.naissance > today || v.naissance < "1900-01-01") e.naissance = "Indiquez une date de naissance valide.";
    if (!/^(\+33\s?|0)[1-9]([\s.-]?\d{2}){4}$/.test(v.tel.trim())) e.tel = "Numéro non reconnu. Exemple : 06 12 34 56 78";
    if (!files.length) e.fichiers = "Ajoutez une photo ou un PDF de votre ordonnance.";
    else if (total > MAX_TOTAL) e.fichiers = `Fichiers trop lourds (${mo(total)}). Maximum ${mo(MAX_TOTAL)} au total.`;
    if (!v.rgpd) e.rgpd = "Cochez la case pour autoriser la transmission de votre ordonnance.";
    setErr(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setState("sending");
    const body = new FormData();
    body.append("nom", v.nom.trim()); body.append("prenom", v.prenom.trim()); body.append("naissance", v.naissance);
    body.append("telephone", v.tel.trim()); body.append("message", v.message.trim()); body.append("website", v.website);
    body.append("rgpd", "on");
    files.forEach((f) => body.append("fichiers", f));
    try {
      const res = await fetch("/api/ordonnance", { method: "POST", body });
      if (!res.ok) throw new Error(String(res.status));
      setState("done");
      setV(empty); setFiles([]);
    } catch {
      setState("error");
    }
  };

  const field = "w-full rounded-2xl border bg-paper px-4 py-3.5 text-[16px] outline-none transition focus:border-cross focus:bg-white focus:ring-4 focus:ring-cross/10";
  const Err = ({ k }: { k: Field }) => (
    <AnimatePresence>{err[k] && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-1.5 text-[13px] text-[#B3261E]">{err[k]}</motion.p>}</AnimatePresence>
  );
  const text = (k: "nom" | "prenom" | "tel", label: string, extra: object) => (
    <div><label htmlFor={`o-${k}`} className="mb-2 block text-[14px] font-medium">{label}</label>
      <input id={`o-${k}`} value={v[k]} onChange={(e) => setV({ ...v, [k]: e.target.value })} {...extra} className={cn(field, err[k] ? "border-[#B3261E]" : "border-line")} /><Err k={k} /></div>
  );

  return (
    <section id="ordonnance" className="bg-cross-mist py-[clamp(90px,12vw,170px)]">
      <div className="wrap grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <span className="eyebrow">Ordonnance en ligne</span>
          <h2 className="h-sec mt-5">Envoyez votre ordonnance, <em className="italic text-cross">on prépare.</em></h2>
          <p className="mt-6 max-w-[44ch] text-muted">Gagnez du temps : transmettez votre ordonnance avant de venir. Votre traitement vous attend au comptoir, sans file d'attente.</p>
          <ol className="mt-10 divide-y divide-line border-y border-line">
            {steps.map(({ Icon, t, d }, i) => (
              <li key={t} className="flex gap-4 py-5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-cross-deep"><Icon size={17} /></span>
                <div><div className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted">Étape {i + 1}</div>
                  <h3 className="mt-0.5 font-sans text-[16px] font-medium tracking-normal">{t}</h3><p className="mt-1 text-[14.5px] text-muted">{d}</p></div>
              </li>
            ))}
          </ol>
          <a href={site.doctolib} target="_blank" rel="noopener noreferrer"
            className="group mt-8 flex items-center gap-4 rounded-2xl border border-line bg-white p-5 transition hover:border-cross/50">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-cross-soft text-cross-deep"><MessageCircle size={17} /></span>
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-medium">Vous utilisez Doctolib ?</span>
              <span className="mt-0.5 block text-[14px] text-muted">Vous pouvez aussi contacter la pharmacie directement sur Doctolib.</span>
            </span>
            <ExternalLink size={16} className="shrink-0 text-cross-deep transition group-hover:translate-x-0.5" />
          </a>
        </div>

        <form onSubmit={submit} noValidate className="relative overflow-hidden rounded-[30px] border border-line bg-white p-6 shadow-[0_30px_80px_-50px_rgba(19,33,28,.4)] sm:p-10 lg:col-span-7">
          <div className="flex gap-3 rounded-2xl bg-cross-soft/60 p-4 text-[14px] text-cross-deep">
            <Lock size={18} className="mt-0.5 shrink-0" />
            <p>Votre ordonnance est transmise uniquement à l'équipe de la pharmacie. En cas d'urgence, appelez-nous au {site.telephone.affichage}.</p>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {text("nom", "Nom", { autoComplete: "family-name" })}
            {text("prenom", "Prénom", { autoComplete: "given-name" })}
            <div><label htmlFor="o-naissance" className="mb-2 block text-[14px] font-medium">Date de naissance</label>
              <input id="o-naissance" type="date" min="1900-01-01" max={today} autoComplete="bday" value={v.naissance} onChange={(e) => setV({ ...v, naissance: e.target.value })}
                className={cn(field, err.naissance ? "border-[#B3261E]" : "border-line")} /><Err k="naissance" /></div>
            {text("tel", "Téléphone", { type: "tel", inputMode: "tel", autoComplete: "tel" })}
          </div>

          <div className="mt-5">
            <span className="mb-2 block text-[14px] font-medium">Ordonnance <span className="font-normal text-muted">(photo ou PDF, {MAX_FILES} fichiers max.)</span></span>
            <label onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)} onDrop={onDrop}
              className={cn("flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed px-4 py-8 text-center transition-colors",
                drag ? "border-cross bg-cross-soft/40" : err.fichiers ? "border-[#B3261E] bg-paper" : "border-line bg-paper hover:border-cross/50")}>
              <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-cross-deep"><Upload size={20} /></span>
              <span className="text-[15px]"><b className="font-medium text-cross-deep">Prendre une photo</b> ou choisir un fichier</span>
              <span className="text-[13px] text-muted">Toute l'ordonnance doit être visible et lisible.</span>
              <input ref={input} type="file" accept={ACCEPT} multiple className="sr-only" onChange={(e) => add(e.target.files)} disabled={files.length >= MAX_FILES} />
            </label>
            {files.length > 0 && (
              <ul className="mt-3 grid gap-2">
                {files.map((f, i) => (
                  <li key={`${f.name}-${i}`} className="flex items-center gap-3 rounded-xl border border-line px-3 py-2 text-[14px]">
                    {previews[i]
                      ? <img src={previews[i]!} alt="" className="h-10 w-10 shrink-0 rounded-lg object-cover" />
                      : <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-cross-soft text-cross-deep"><FileText size={17} /></span>}
                    <span className="min-w-0 flex-1 truncate">{f.name}</span>
                    <span className="shrink-0 font-mono text-[12px] text-muted">{mo(f.size)}</span>
                    <button type="button" onClick={() => setFiles(files.filter((_, j) => j !== i))} aria-label={`Retirer ${f.name}`}
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-full hover:bg-paper"><X size={15} /></button>
                  </li>
                ))}
              </ul>
            )}
            <Err k="fichiers" />
          </div>

          <div className="mt-5"><label htmlFor="o-msg" className="mb-2 block text-[14px] font-medium">Précisions <span className="font-normal text-muted">(facultatif)</span></label>
            <textarea id="o-msg" rows={3} maxLength={1000} value={v.message} onChange={(e) => setV({ ...v, message: e.target.value })} placeholder="Ex. : je passerai jeudi après-midi, génériques acceptés…"
              className={cn(field, "resize-y border-line")} /></div>
          <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden value={v.website} onChange={(e) => setV({ ...v, website: e.target.value })} className="absolute -left-[9999px] h-0 w-0 opacity-0" />

          <label htmlFor="o-rgpd" className="mt-5 flex items-start gap-3 text-[14px] text-muted">
            <input id="o-rgpd" type="checkbox" checked={v.rgpd} onChange={(e) => setV({ ...v, rgpd: e.target.checked })} className="mt-1 h-[18px] w-[18px] shrink-0 accent-[#0F7C6B]" />
            <span>J'accepte que mon ordonnance et mes informations soient transmises à la pharmacie pour préparer mon traitement. <button type="button" onClick={onPrivacy} className="underline underline-offset-4">Politique de confidentialité</button></span>
          </label>
          <Err k="rgpd" />
          <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
            <span className="text-[13px] text-muted">L'original vous sera demandé au comptoir.</span>
            <button type="submit" disabled={state === "sending"} className="btn-main min-w-[220px] disabled:opacity-70">
              {state === "sending" ? <><Loader2 size={17} className="animate-spin" /> Envoi…</> : <>Envoyer l'ordonnance <ArrowRight size={17} /></>}
            </button>
          </div>

          <AnimatePresence>
            {(state === "done" || state === "error") && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 grid place-items-center bg-white/95 p-8 text-center backdrop-blur">
                <motion.div initial={{ y: 20, scale: 0.96 }} animate={{ y: 0, scale: 1 }} transition={{ type: "spring", bounce: 0.3 }} className="max-w-[40ch]">
                  <span className={cn("mx-auto grid h-16 w-16 place-items-center rounded-full text-white", state === "done" ? "bg-cross" : "bg-[#B3261E]")}>{state === "done" ? <Check size={28} /> : <X size={28} />}</span>
                  <h3 className="mt-6 text-[2.2rem]">{state === "done" ? "Ordonnance envoyée." : "Envoi impossible."}</h3>
                  <p className="mt-3 text-muted">{state === "done"
                    ? "Merci, la pharmacie a bien reçu votre ordonnance. Nous vous appelons si besoin. Pensez à apporter l'original."
                    : <>Votre ordonnance n'a pas pu être transmise. Réessayez dans un instant ou appelez-nous au {site.telephone.affichage}.</>}</p>
                  <button type="button" onClick={() => setState("idle")} className="btn-line mt-6">{state === "done" ? "Envoyer une autre ordonnance" : "Revenir au formulaire"}</button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </section>
  );
}
