# 🎒 Portfolio — Mathieu Raudin

Portfolio personnel sur le thème du voyage et du road trip. Le visiteur défile à travers un paysage qui se déroule au scroll, et découvre les différentes "étapes" du parcours : qui je suis, mes projets, et comment me contacter.

🌐 **Live demo** : [mathieu-raudin.com](https://mathieu-raudin.com) *(à adapter avec votre URL)*

![Portfolio preview](public/images/portfolio-preview.jpg)

---

## ✨ Fonctionnalités

- 🎬 **Animation au scroll** : vidéo de paysage qui défile en arrière-plan, synchronisée avec la progression
- 🗺️ **Carte de route interactive** : étapes Accueil → À propos → Projets → Contact → Arrivée
- 🌍 **Bilingue** : français/anglais avec basculement instantané (contexte React)
- 📧 **Formulaire de contact sécurisé** : EmailJS + reCAPTCHA v2 + honeypot + timing check anti-bot
- 🎨 **Design "carnet de voyage"** : papier ambré, polices Fraunces/Manrope/Caveat, illustrations vectorielles
- 🌙 **Scène de nuit sur la page Contact** : feu de camp animé, étoiles scintillantes, lune avec cratères
- ⚡ **Performances optimisées** : code splitting, lazy loading, compression vidéo, preconnect

---

## 🛠️ Stack technique

| Catégorie | Technologies |
|---|---|
| **Front-end** | React 18, React Router v6, CSS Modules |
| **Outils** | Create React App, Jest, Testing Library |
| **Services** | EmailJS (envoi d'emails), Google reCAPTCHA v2 |
| **Hébergement** | (à adapter : Vercel / Netlify / etc.) |
| **Polices** | Fraunces, Manrope, JetBrains Mono, Caveat (Google Fonts) |

---

## 🚀 Installation

### Prérequis

- Node.js ≥ 16.x
- npm ≥ 8.x

### Étapes

```bash
# 1. Cloner le repo
git clone https://github.com/Math011/portfolio.git
cd portfolio

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env.local
# Puis ouvrir .env.local et remplir avec vos vraies clés
```

### Variables d'environnement (`.env.local`)

```env
# EmailJS — créer un compte sur https://www.emailjs.com/
REACT_APP_EMAILJS_SERVICE_ID=service_xxxxxxx
REACT_APP_EMAILJS_TEMPLATE_ID=template_xxxxxxx
REACT_APP_EMAILJS_AUTOREPLY_ID=template_xxxxxxx
REACT_APP_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxxx

# Google reCAPTCHA v2 — créer une clé sur https://www.google.com/recaptcha/admin
REACT_APP_RECAPTCHA_SITE_KEY=6Lcxxxxxxxxxxxxxxxxxxxxxxxxx

# Email de contact affiché sur la page Contact
[email protected]
```

---

## 💻 Commandes disponibles

```bash
# Lancer le serveur de dev (http://localhost:3000)
npm start

# Lancer les tests unitaires
npm test

# Lancer les tests en mode CI (une seule passe)
npm test -- --watchAll=false

# Build de production (dossier build/)
npm run build
```

---

## 📁 Structure du projet

```
portfolio/
├── public/
│   ├── images/                  # Assets statiques (SVG, JPG, vidéo)
│   │   └── projets/             # Captures d'écran des projets
│   ├── index.html               # Template HTML (CSP, preloads, polices)
│   └── manifest.json
│
├── src/
│   ├── components/              # Composants réutilisables
│   │   ├── BackgroundVideo/     # Vidéo de fond du scroll
│   │   ├── Header/              # Navigation principale
│   │   ├── LanguageSwitcher/    # FR / EN
│   │   ├── LoadingScreen/       # Écran de chargement initial
│   │   ├── ProgressBar/         # Barre de progression du voyage
│   │   ├── RoadElement/         # Cartes flottantes (HomeMenu, AboutMenu, etc.)
│   │   └── ScrollHint/          # Indicateur "scroller pour découvrir"
│   │
│   ├── contexts/
│   │   └── LanguageContext.js   # Gestion FR/EN
│   │
│   ├── data/
│   │   └── journeySteps.js      # Définition des étapes du voyage
│   │
│   ├── hooks/
│   │   ├── useFirstLoad.js      # Loading screen au premier visit
│   │   └── useVideoScroll.js    # Synchronisation scroll ↔ vidéo
│   │
│   ├── pages/
│   │   ├── AboutPage/           # Page "À propos"
│   │   ├── ContactPage/         # Page "Contact" (scène nuit + formulaire)
│   │   ├── ProjectsPage/        # Liste des projets
│   │   ├── ProjectDetailPage/   # Détail d'un projet
│   │   └── NotFoundPage/        # 404
│   │
│   ├── translations/            # Fichiers de traduction FR/EN
│   ├── App.js                   # Routes + Suspense (code splitting)
│   ├── App.css                  # Styles globaux
│   └── index.js                 # Point d'entrée
│
├── .env.example                 # Template des variables d'env
├── .gitignore
├── package.json
└── README.md
```

---

## 🔒 Sécurité

Le formulaire de contact est protégé par plusieurs couches :

1. **reCAPTCHA v2** — vérification côté Google (avec whitelist de domaine activée)
2. **Honeypot** — champ caché `website` qui ne devrait jamais être rempli (détection des bots automatiques)
3. **Timing check** — vérification que l'utilisateur a passé au moins 3 secondes sur le formulaire (filtrage des bots ultra-rapides)
4. **Rate limiting client** — maximum 3 envois par heure, intervalle minimum d'1 minute entre 2 envois
5. **Validation côté client** — longueurs, format email, détection de spam URL
6. **CSP (Content Security Policy)** — limite les sources autorisées pour scripts/styles/images
7. **EmailJS** — quota naturel de 200 emails/mois, captcha verification activée sur le template principal

⚠️ **Note importante** : les clés EmailJS et reCAPTCHA sont exposées dans le bundle JS public (inhérent à toute SPA sans backend). La protection principale vient de la whitelist de domaine côté reCAPTCHA.

---

## ⚡ Performances

- **Code splitting** : chaque page est chargée à la demande via `React.lazy()` → bundle initial ~50% plus léger
- **Compression vidéo** : MP4 H.264 CRF 28 + WebM en fallback pour les navigateurs modernes
- **Polices préconnectées** : `<link rel="preconnect">` sur Google Fonts pour gagner ~100ms
- **Loading screen rapide** : 900ms uniquement sur le premier load (Home + Projects)

---

## 🧪 Tests

Tests unitaires avec **Jest** + **React Testing Library**.

```bash
npm test
```

Couverture actuelle :
- `AboutPage` (13 tests)
- `ContactPage` + `ContactForm` (sécurité, accessibilité)
- `ProjectsPage`
- `ProjectDetailPage`
- `RoadElement` menus (15 tests)
- Routes principales

---

## 🎨 Crédits & inspirations

- **Concept "voyage / road trip"** : design et illustrations personnels
- **Polices** : [Google Fonts](https://fonts.google.com/) (Fraunces, Manrope, JetBrains Mono, Caveat)
- **Icônes développeur** : [Devicons](https://devicon.dev/) (CDN jsDelivr)

---

## 👤 Auteur

**Mathieu Raudin**

- 🌐 [Portfolio](https://mathieu-raudin.com) *(à adapter)*
- 💼 [LinkedIn](https://linkedin.com/in/mathieu-raudin-4a9b90230)
- 💻 [GitHub](https://github.com/Math011)

---

## 📝 Licence

Ce projet est personnel — code disponible à des fins éducatives et d'inspiration uniquement.

Les éléments graphiques et le contenu (textes, illustrations, captures d'écran) ne sont pas réutilisables sans autorisation.