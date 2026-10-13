import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";
import seo from "./seo.config";

// SINGLE=1 : un seul fichier HTML (aperçu). Sans : build classique pour l'hébergement.
// SITE_URL (fichier .env) : adresse définitive du site, utilisée pour le SEO (canonical, sitemap, partage).
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react(), seo(env.SITE_URL || "https://www.pharmacie-saint-loup.fr"), ...(process.env.SINGLE ? [viteSingleFile()] : [])],
    build: { assetsInlineLimit: process.env.SINGLE ? 100_000_000 : 4096 },
  };
});
