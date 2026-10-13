import { site } from "../data/site";

export const toMin = (hhmm: string) => { const [h, m] = hhmm.split(":").map(Number); return h * 60 + m; };
const fr = (hhmm: string) => hhmm.replace(":", "h");

/** Heure actuelle à Paris (jour 0-6, minutes depuis minuit). */
function parisNow() {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Paris", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
      .formatToParts(new Date()).map((x) => [x.type, x.value]),
  );
  return { d: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(p.weekday), m: Number(p.hour) * 60 + Number(p.minute) };
}

const plages = (d: number) => (site.horaires.find((h) => h.d === d)?.plages ?? []).map((s) => s.split("–"));

export type OpenState = { open: boolean; label: string } | null;

/** « Ouvert · ferme à 12h30 » / « Fermé · ouvre demain à 09h00 », ou null si horaires non renseignés. */
export function openState(): OpenState {
  if (!site.horaires.some((h) => h.plages)) return null;
  const { d, m } = parisNow();
  const cur = plages(d).find(([a, b]) => m >= toMin(a) && m < toMin(b));
  if (cur) return { open: true, label: `Ouvert · ferme à ${fr(cur[1])}` };
  for (let i = 0; i < 7; i++) {
    const day = (d + i) % 7;
    const next = plages(day).find(([a]) => i > 0 || toMin(a) > m);
    if (next) {
      const when = i === 0 ? "" : i === 1 ? "demain " : `${site.horaires.find((h) => h.d === day)!.jour.toLowerCase()} `;
      return { open: false, label: `Fermé · ouvre ${when}à ${fr(next[0])}` };
    }
  }
  return { open: false, label: "Fermé" };
}

/** Nombre d'heures d'ouverture par semaine. */
export const weeklyHours = () =>
  Math.round(site.horaires.reduce((t, h) => t + (h.plages ?? []).reduce((a, p) => { const [x, y] = p.split("–"); return a + toMin(y) - toMin(x); }, 0), 0) / 60);
