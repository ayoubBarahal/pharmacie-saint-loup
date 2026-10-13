# Pharmacie Saint-Loup — site vitrine

React + TypeScript + Vite, Tailwind CSS, Framer Motion, GSAP (ScrollTrigger, SplitText, DrawSVG) et Lenis.

## Démarrer
    npm install
    npm run dev        # développement
    npm run build      # site prêt à héberger dans dist/
    npm run preview    # aperçu en un seul fichier HTML

## Personnaliser
- Toutes les informations (horaires, équipe, livraison, vaccins, e-mail…) : `src/data/site.ts`
- Images : `src/assets/` — uniquement des photos réelles de l'officine.
- Formulaire : brancher l'envoi réel dans `src/components/Contact.tsx` (fonction `submit`).

## Mise en ligne et référencement (SEO)
1. Indiquer le nom de domaine définitif dans `.env` (`SITE_URL=https://…`, sans `/` final).
2. `npm run build`, puis publier le contenu du dossier `dist/` (Netlify, Vercel, OVH, o2switch…).
3. Au build, `seo.config.ts` génère automatiquement à partir de `src/data/site.ts` et `src/data/faq.ts` :
   données structurées Google (Pharmacy, WebSite, FAQPage), `sitemap.xml` et `robots.txt`.
4. Déclarer le site dans Google Search Console et y soumettre `https://…/sitemap.xml`.
5. Ajouter l'adresse du site dans la fiche Google Business Profile de la pharmacie.
- Icônes et image de partage : `public/` (`favicon.svg`, `og-image.jpg` 1200×630…).

## Crédits
- HoverExpand adapté de SmoothUI (Eduardo Calvo, MIT) — 21st.dev
- MagicCard, Marquee, NumberTicker et ShimmerButton adaptés de Magic UI (MIT) — 21st.dev
- Animations selon les bonnes pratiques des skills officiels GSAP (greensock/gsap-skills)
