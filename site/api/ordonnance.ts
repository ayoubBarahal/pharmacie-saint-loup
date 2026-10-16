// Fonction serveur Vercel : reçoit une ordonnance (formulaire multipart) et l'envoie par e-mail à la pharmacie.
// Variables d'environnement (réglages Vercel) : SMTP_USER, SMTP_PASS, et en option SMTP_HOST, SMTP_PORT, ORDONNANCE_EMAIL.
import nodemailer from "nodemailer";

const MAX_FILES = 5;
const MAX_TOTAL = 4_200_000; // Vercel refuse les requêtes de plus de 4,5 Mo
const TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];

const json = (status: number, body: object) => Response.json(body, { status });
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const clean = (v: FormDataEntryValue | null, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  const { SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_USER || !SMTP_PASS) return json(500, { error: "config" });

  let form: FormData;
  try { form = await req.formData(); } catch { return json(400, { error: "format" }); }

  // champ piège invisible : seuls les robots le remplissent
  if (clean(form.get("website"), 100)) return json(200, { ok: true });

  const nom = clean(form.get("nom"), 60);
  const prenom = clean(form.get("prenom"), 60);
  const naissance = clean(form.get("naissance"), 10);
  const tel = clean(form.get("telephone"), 20);
  const message = clean(form.get("message"), 1000);
  const files = form.getAll("fichiers").filter((f): f is File => f instanceof File && f.size > 0);

  const d = /^(\d{4})-(\d{2})-(\d{2})$/.exec(naissance);
  const birth = d ? new Date(`${naissance}T00:00:00Z`) : null;
  const valid =
    nom.length >= 1 && prenom.length >= 1 && form.get("rgpd") === "on" &&
    birth && !isNaN(+birth) && +d![1] >= 1900 && birth <= new Date() &&
    /^(\+33\s?|0)[1-9]([\s.-]?\d{2}){4}$/.test(tel) &&
    files.length >= 1 && files.length <= MAX_FILES &&
    files.every((f) => TYPES.includes(f.type)) &&
    files.reduce((n, f) => n + f.size, 0) <= MAX_TOTAL;
  if (!valid) return json(400, { error: "invalid" });

  const dateFr = `${d![3]}/${d![2]}/${d![1]}`;
  const slug = `${nom}-${prenom}`.normalize("NFD").replace(/[^\w-]+/g, "").toLowerCase();
  const rows = [["Nom", nom.toUpperCase()], ["Prénom", prenom], ["Date de naissance", dateFr], ["Téléphone", tel], ...(message ? [["Message", message]] : [])];

  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 465),
    secure: Number(process.env.SMTP_PORT || 465) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  try {
    await transport.sendMail({
      from: `"Site Pharmacie Saint-Loup" <${SMTP_USER}>`,
      to: process.env.ORDONNANCE_EMAIL || SMTP_USER,
      subject: `Ordonnance — ${nom.toUpperCase()} ${prenom} (né(e) le ${dateFr})`,
      text: rows.map(([k, v]) => `${k} : ${v}`).join("\n") + `\n\n${files.length} pièce(s) jointe(s).`,
      html: `<h2 style="font-family:sans-serif">Nouvelle ordonnance reçue via le site</h2>
        <table style="font-family:sans-serif;font-size:15px;border-collapse:collapse">${rows
          .map(([k, v]) => `<tr><td style="padding:6px 16px 6px 0;color:#666">${k}</td><td style="padding:6px 0"><b>${esc(v).replace(/\n/g, "<br>")}</b></td></tr>`)
          .join("")}</table>
        <p style="font-family:sans-serif;color:#666">${files.length} pièce(s) jointe(s). Rappeler le patient au ${esc(tel)} quand la commande est prête.</p>`,
      attachments: await Promise.all(files.map(async (f, i) => ({
        filename: `ordonnance-${slug}-${i + 1}.${f.type === "image/jpeg" ? "jpg" : f.type.split("/")[1]}`,
        content: Buffer.from(await f.arrayBuffer()),
        contentType: f.type,
      }))),
    });
    return json(200, { ok: true });
  } catch (e) {
    console.error("Envoi ordonnance impossible :", (e as Error).message);
    return json(502, { error: "send" });
  }
}
