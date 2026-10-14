// Questions fréquentes : affichées sur le site ET injectées en données structurées (FAQPage) dans index.html.
// Aucune dépendance navigateur : ce fichier est aussi lu par vite.config.ts au moment du build.

export const faq: { q: string; a: string }[] = [
  {
    q: "Où se trouve la Pharmacie Saint-Loup ?",
    a: "La Pharmacie Saint-Loup est située au 127 rue du Faubourg de Bourgogne, 45800 Saint-Jean-de-Braye, dans le quartier Saint-Loup, à l'est d'Orléans (Orléans Métropole).",
  },
  {
    q: "Quels sont les horaires d'ouverture de la pharmacie ?",
    a: "Du lundi au samedi de 9h00 à 12h30 et de 14h15 à 19h30. La pharmacie est fermée le dimanche.",
  },
  {
    q: "Peut-on se garer devant la pharmacie ?",
    a: "Oui, la pharmacie dispose d'un parking réservé à sa clientèle, pour les voitures comme pour les vélos.",
  },
  {
    q: "La pharmacie livre-t-elle à domicile ?",
    a: "Oui, la livraison à domicile est gratuite pour les patients habitant à proximité de la pharmacie. Appelez-nous au 02 38 54 10 96 pour connaître les modalités et organiser votre livraison.",
  },
  {
    q: "Peut-on se faire vacciner à la pharmacie ?",
    a: "Oui, la vaccination se fait sur rendez-vous, à prendre par téléphone au 02 38 54 10 96 (Covid-19, diphtérie-tétanos-poliomyélite…).",
  },
  {
    q: "Peut-on consulter un médecin à la pharmacie ?",
    a: "Oui, la pharmacie est équipée d'une cabine de téléconsultation Medadom qui permet de consulter un médecin en vidéo, aux horaires d'ouverture.",
  },
  {
    q: "Quelle est la pharmacie de garde à Orléans et Saint-Jean-de-Braye ?",
    a: "En dehors de nos horaires, appelez le 3237 ou consultez 3237.fr pour trouver la pharmacie de garde la plus proche. En cas d'urgence vitale, composez le 15.",
  },
];
