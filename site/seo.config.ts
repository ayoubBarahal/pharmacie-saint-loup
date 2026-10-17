// Référencement (SEO) généré au build à partir de src/data/site.ts et src/data/faq.ts :
// données structurées schema.org (Pharmacy, WebSite, FAQPage), sitemap.xml et robots.txt.
import type { Plugin } from "vite";
import { faq } from "./src/data/faq";
import { site } from "./src/data/site";

const DAYS: Record<number, string> = { 0: "Sunday", 1: "Monday", 2: "Tuesday", 3: "Wednesday", 4: "Thursday", 5: "Friday", 6: "Saturday" };

function openingHours() {
  // regroupe les jours qui ont la même plage horaire
  const groups = new Map<string, string[]>();
  for (const h of site.horaires) for (const p of h.plages ?? []) {
    const k = p.replace("–", "-");
    groups.set(k, [...(groups.get(k) ?? []), `https://schema.org/${DAYS[h.d]}`]);
  }
  return [...groups].map(([p, days]) => {
    const [opens, closes] = p.split("-");
    return { "@type": "OpeningHoursSpecification", dayOfWeek: days, opens, closes };
  });
}

function jsonLd(url: string) {
  const pharmacy = {
    "@context": "https://schema.org",
    "@type": "Pharmacy",
    "@id": `${url}/#pharmacie`,
    name: site.nom,
    alternateName: ["Pharmacie St Loup", "Pharmacie Saint Loup"],
    description: "Pharmacie à Saint-Jean-de-Braye, près d'Orléans : conseils pharmaceutiques, parapharmacie, vaccination, téléconsultation et livraison gratuite à domicile à proximité.",
    url: `${url}/`,
    image: [`${url}/og-image.jpg`],
    logo: `${url}/icon-512.png`,
    telephone: site.telephone.lien.replace("tel:", ""),
    ...(site.email ? { email: site.email } : {}),
    priceRange: "€",
    currenciesAccepted: "EUR",
    paymentAccepted: "Espèces, Carte bancaire, Carte Vitale",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.adresse.rue,
      postalCode: site.adresse.cp,
      addressLocality: site.adresse.ville,
      addressRegion: "Centre-Val de Loire",
      addressCountry: "FR",
    },
    geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
    hasMap: site.googleMaps,
    sameAs: [...site.reseaux.map((r) => r.url), site.doctolib],
    openingHoursSpecification: openingHours(),
    areaServed: site.communes.map((name) => ({ "@type": "City", name })),
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Parking réservé à la clientèle", value: true },
      { "@type": "LocationFeatureSpecification", name: "Livraison gratuite à domicile", value: true },
      { "@type": "LocationFeatureSpecification", name: "Cabine de téléconsultation", value: true },
      { "@type": "LocationFeatureSpecification", name: "Vaccination sur rendez-vous", value: true },
    ],
    employee: site.equipe.map((m) => ({ "@type": "Person", name: m.nom, jobTitle: m.role })),
  };
  const website = { "@context": "https://schema.org", "@type": "WebSite", "@id": `${url}/#site`, url: `${url}/`, name: site.nom, inLanguage: "fr-FR", publisher: { "@id": `${url}/#pharmacie` } };
  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };
  return [pharmacy, website, faqPage];
}

export default function seo(siteUrl: string): Plugin {
  const url = siteUrl.replace(/\/+$/, "");
  return {
    name: "pharmacie-seo",
    transformIndexHtml: {
      order: "pre",
      handler: (html) => ({
        html: html.replaceAll("%SITE_URL%", url),
        tags: jsonLd(url).map((data) => ({
          tag: "script", attrs: { type: "application/ld+json" }, children: JSON.stringify(data).replace(/</g, "\\u003c"), injectTo: "head" as const,
        })),
      }),
    },
    generateBundle() {
      const today = new Date().toISOString().slice(0, 10);
      this.emitFile({ type: "asset", fileName: "robots.txt", source: `User-agent: *\nAllow: /\n\nSitemap: ${url}/sitemap.xml\n` });
      this.emitFile({
        type: "asset", fileName: "sitemap.xml",
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n  <url>\n    <loc>${url}/</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>1.0</priority>\n    <image:image><image:loc>${url}/og-image.jpg</image:loc></image:image>\n  </url>\n</urlset>\n`,
      });
    },
  };
}
