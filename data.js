/* ============================================================
   AppsJar — catalogue des applications
   Pour ajouter une app : copier un bloc et modifier les champs.
   cat  : "metier" | "design" | "aide"
   size : "small" | "medium" | "wide" | "large"  (taille de la tuile Metro)
   color: couleur de la tuile (style Windows 8)
   preview: true => aperçu en direct de l'app dans la tuile
   ============================================================ */

window.CATEGORIES = [
  { id: "metier", label: "Outils de métier",         icon: "briefcase" },
  { id: "design", label: "Outils designs",           icon: "palette" },
  { id: "aide",   label: "Sites et logiciel d'aide", icon: "lifebuoy" }
];

window.APPS = [
  /* ---------------- Outils de métier ---------------- */
  {
    id: "feuillemetre",
    name: "Feuille de Métré",
    desc: "Établir rapidement des métrés et quantitatifs de travaux, avec calculs automatiques et export.",
    url: "https://feuillemetre.netlify.app/",
    cat: "metier", tag: "Chantier", icon: "ruler",
    color: "#0047FF", size: "large", preview: true, isNew: true, mine: true
  },
  {
    id: "gantplanifaction",
    name: "Planification Gantt",
    desc: "Planifier les actions et tâches d'un projet sur un diagramme de Gantt clair et éditable.",
    url: "https://gantplanifaction.netlify.app/",
    cat: "metier", tag: "Gestion de projet", icon: "gantt",
    color: "#00A300", size: "wide", preview: true, isNew: true, mine: true
  },
  {
    id: "pdf-diviseur",
    name: "PDF Diviseur",
    desc: "Découper un document PDF en plusieurs fichiers par pages ou par plages.",
    url: "https://pdf-diviseur.netlify.app/",
    cat: "metier", tag: "PDF", icon: "scissors",
    color: "#E51400", size: "medium", preview: true, mine: true
  },
  {
    id: "pdfanalyses",
    name: "PDF Analyses",
    desc: "Analyser le contenu d'un PDF : pages, texte, statistiques et extraction d'informations.",
    url: "https://pdfanalyses.netlify.app/",
    cat: "metier", tag: "PDF", icon: "chart",
    color: "#7200AC", size: "medium", preview: true, mine: true
  },

  /* ---------------- Outils designs ---------------- */
  {
    id: "intercalaires",
    name: "Intercalaires",
    desc: "Créer et imprimer des intercalaires (séparateurs de classeur) personnalisés.",
    url: "https://intercalaires.netlify.app/",
    cat: "design", tag: "Impression", icon: "layers",
    color: "#FA6800", size: "wide", preview: true, mine: true
  },
  {
    id: "xswhitebord",
    name: "XS Whiteboard",
    desc: "Tableau blanc numérique pour dessiner, schématiser et présenter vos idées.",
    url: "https://xswhitebord.netlify.app/",
    cat: "design", tag: "Dessin", icon: "pen",
    color: "#1BA1E2", size: "large", preview: true, isNew: true, mine: true
  },

  /* ---------------- Sites et logiciel d'aide ---------------- */
  {
    id: "github-appsjar",
    name: "AppsJar sur GitHub",
    desc: "Le dépôt source du projet AppsJar : code, mises à jour et suivi.",
    url: "https://github.com/XHSalaH/AppsJar",
    cat: "aide", tag: "Code source", icon: "github",
    color: "#1E293B", size: "wide", mine: true
  },
  {
    id: "drawio",
    name: "draw.io",
    desc: "Diagrammes, organigrammes et schémas techniques gratuits en ligne.",
    url: "https://app.diagrams.net/",
    cat: "aide", tag: "Diagrammes", icon: "flow",
    color: "#F09609", size: "medium"
  },
  {
    id: "excalidraw",
    name: "Excalidraw",
    desc: "Croquis et schémas au style « dessiné à la main ».",
    url: "https://excalidraw.com/",
    cat: "aide", tag: "Croquis", icon: "pen",
    color: "#6965DB", size: "medium"
  },
  {
    id: "photopea",
    name: "Photopea",
    desc: "Éditeur d'images avancé directement dans le navigateur.",
    url: "https://www.photopea.com/",
    cat: "aide", tag: "Image", icon: "image",
    color: "#18A497", size: "small"
  },
  {
    id: "canva",
    name: "Canva",
    desc: "Présentations, affiches et visuels à partir de modèles.",
    url: "https://www.canva.com/",
    cat: "aide", tag: "Présentation", icon: "palette",
    color: "#00C4CC", size: "small"
  },
  {
    id: "ilovepdf",
    name: "iLovePDF",
    desc: "Fusionner, compresser et convertir des PDF.",
    url: "https://www.ilovepdf.com/fr",
    cat: "aide", tag: "PDF", icon: "file",
    color: "#D5232F", size: "small"
  },
  {
    id: "googlefonts",
    name: "Google Fonts",
    desc: "Bibliothèque de polices libres pour vos documents et designs.",
    url: "https://fonts.google.com/",
    cat: "aide", tag: "Typographie", icon: "type",
    color: "#4285F4", size: "small"
  }
];
