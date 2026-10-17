// ─────────────────────────────────────────────────────────────
// Toutes les informations de la pharmacie sont ici.
// Remplacez les valeurs "À compléter" par les informations réelles.
// ─────────────────────────────────────────────────────────────

export const TODO = "À compléter";

export const site = {
  nom: "Pharmacie Saint-Loup",
  adresse: {
    rue: "127 rue du Faubourg de Bourgogne",
    cp: "45800",
    ville: "Saint-Jean-de-Braye",
    secteur: "Orléans Métropole",
  },
  // Coordonnées GPS officielles (Base Adresse Nationale, api-adresse.data.gouv.fr).
  geo: { lat: 47.903476, lng: 1.93201 },
  // Communes voisines mentionnées pour le référencement local.
  communes: ["Saint-Jean-de-Braye", "Orléans", "Semoy", "Chécy", "Combleux", "Marigny-les-Usages"],
  // Numéro confirmé par sante.fr (annuaire officiel du ministère de la Santé).
  telephone: { affichage: "02 38 54 10 96", lien: "tel:+33238541096" },
  email: "pharmaciesaintloup45@gmail.com" as string | null,
  googleMaps: "https://maps.app.goo.gl/as3J7DPdUrAFod6ZA",
  itineraire:
    "https://www.google.com/maps/dir/?api=1&destination=PHARMACIE+SAINT-LOUP%2C+127+Rue+du+Faubourg+de+Bourgogne%2C+45800+Saint-Jean-de-Braye",
  doctolib: "https://www.doctolib.fr/pharmacie/saint-jean-de-braye/pharmacie-saint-loup-saint-jean-de-braye",
  reseaux: [
    { nom: "Facebook", url: "https://www.facebook.com/share/1FbVfk1Y7n/" },
    { nom: "TikTok", url: "https://www.tiktok.com/@pharmaciesaintloup" },
  ] as { nom: string; url: string }[],

  // Horaires relevés sur Pharmanity, 118712 et sante.fr (à confirmer sur place).
  // null = fermé. Exemple : ["08:30–12:30", "14:00–19:30"]
  horaires: [
    { jour: "Lundi", d: 1, plages: ["09:00–12:30", "14:15–19:30"] as string[] | null },
    { jour: "Mardi", d: 2, plages: ["09:00–12:30", "14:15–19:30"] as string[] | null },
    { jour: "Mercredi", d: 3, plages: ["09:00–12:30", "14:15–19:30"] as string[] | null },
    { jour: "Jeudi", d: 4, plages: ["09:00–12:30", "14:15–19:30"] as string[] | null },
    { jour: "Vendredi", d: 5, plages: ["09:00–12:30", "14:15–19:30"] as string[] | null },
    { jour: "Samedi", d: 6, plages: ["09:00–12:30", "14:15–19:30"] as string[] | null },
    { jour: "Dimanche", d: 0, plages: null as string[] | null },
  ],

  livraison: {
    secteur: null as string | null,
    delais: null as string | null,
    conditions: null as string | null,
  },

  vaccins: ["Covid-19", "Diphtérie-Tétanos-Poliomyélite (DTP)"] as string[] | null, // source : sante.fr, Pharmanity

  // Nombre de membres de l'équipe affiché dans les chiffres-clés.
  nbEquipe: 5,

  // Ajoutez une photo (src/assets) si souhaité.
  equipe: [
    { nom: "Soufiane Ouârab", role: "Pharmacien titulaire", bio: "Docteur en pharmacie, diplômé de la faculté de pharmacie de Tours. À votre écoute pour le suivi de vos traitements, la prévention et vos conseils santé.", photo: null as string | null },
    { nom: "Bouchra", role: "Pharmacienne", bio: "Pharmacienne, vous accompagne au quotidien : délivrance des ordonnances, conseils et prévention.", photo: null as string | null },
    { nom: "Sana Ouârab", role: "Étudiante en pharmacie · 6ᵉ année", bio: "Étudiante en 6ᵉ année de pharmacie, elle participe à l'accueil et au conseil aux côtés de l'équipe.", photo: null as string | null },
  ],
};

export const nav: { id: string; label: string; large?: boolean }[] = [
  { id: "pharmacie", label: "Notre pharmacie" },
  { id: "services", label: "Services" },
  { id: "ordonnance", label: "Ordonnance", large: true },
  { id: "parapharmacie", label: "Parapharmacie" },
  { id: "vaccination", label: "Vaccination" },
  { id: "teleconsultation", label: "Téléconsultation" },
  { id: "acces", label: "Accès" },
];
