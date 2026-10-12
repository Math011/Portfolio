# 🎒 Portfolio — Mathieu Raudin

🇬🇧 [English](README.md) · 🇫🇷 **Français**

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-7-CA4245?logo=reactrouter&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-103_tests-6E9F18?logo=vitest&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-déployé-222222?logo=githubpages&logoColor=white)

Portfolio personnel sur le thème du voyage et du road trip. Le visiteur défile à travers un paysage qui se déroule au scroll, et découvre les différentes "étapes" du parcours : qui je suis, mes projets, et comment me contacter.

🌐 **En ligne** : [math011.github.io/Portfolio](https://math011.github.io/Portfolio/)


---

## ✨ Fonctionnalités

- 🎬 **Animation au scroll** : vidéo de paysage qui défile en arrière-plan, synchronisée avec la progression (molette et écran tactile)
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
| **Front-end** | React 18, React Router 7, CSS Modules |
| **Build & dev** | Vite 8 (`@vitejs/plugin-react`) |
| **Tests** | Vitest 5, React Testing Library, jsdom, user-event |
| **Services** | EmailJS (`@emailjs/browser`, envoi d'emails), Google reCAPTCHA v2 |
| **Hébergement** | GitHub Pages, publié avec `gh-pages` |
| **Polices** | Fraunces, Manrope, JetBrains Mono, Caveat (Google Fonts) |

> 🔧 Projet initialement créé avec Create React App, puis migré vers **Vite** (dev server instantané, build plus rapide, dépendances maintenues) et **Vitest** pour les tests.

---

## 🚀 Installation

### Prérequis

- Node.js ≥ 20.19 (22 recommandé)
- npm ≥ 10

### Étapes

```bash
# 1. Cloner le repo
git clone https://github.com/Math011/Portfolio.git
cd Portfolio

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env .env.local
# Puis ouvrir .env.local et remplir avec vos vraies clés
```

### Variables d'environnement (`.env.local`)

```env
# EmailJS — créer un compte sur https://www.emailjs.com/
VITE_APP_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_APP_EMAILJS_TEMPLATE_ID=template_xxxxxxx
VITE_APP_EMAILJS_AUTOREPLY_ID=template_xxxxxxx
VITE_APP_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxxx

# Google reCAPTCHA v2 — créer une clé sur https://www.google.com/recaptcha/admin
VITE_APP_RECAPTCHA_SITE_KEY=6Lcxxxxxxxxxxxxxxxxxxxxxxxxx

# Email de contact affiché sur la page Contact
VITE_APP_CONTACT_EMAIL=vous@exemple.com
```

> Seules les variables préfixées par `VITE_` sont exposées au code par Vite. Après une modification du fichier, relancez le serveur de dev.

---

## 💻 Commandes disponibles

```bash
# Lancer le serveur de dev (http://localhost:3000/Portfolio/)
npm start

# Lancer les tests unitaires (mode watch)
npm test

# Lancer les tests une seule fois (CI)
npx vitest run

# Build de production (dossier dist/)
npm run build

# Prévisualiser le build de production en local
npm run preview

# Publier sur GitHub Pages (build + envoi sur la branche gh-pages)
npm run deploy
```

---

## 📁 Structure du projet

```
Portfolio/
├── public/                      # Fichiers copiés tels quels dans dist/
│   ├── cv/                      # CV en PDF (FR / EN)
│   ├── images/                  # Assets statiques (SVG, JPG)
│   │   └── projets/             # Captures d'écran des projets
│   ├── videos/                  # Vidéos de fond du parcours
│   ├── 404.html                 # Redirection SPA pour GitHub Pages
│   ├── favicon.svg / favicon.ico
│   └── robots.txt
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
│   │   └── LanguageContext.jsx  # Gestion FR/EN
│   │
│   ├── data/
│   │   └── journeySteps.js      # Définition des étapes du voyage
│   │
│   ├── hooks/
│   │   ├── useFirstLoad.js      # Loading screen à la première visite
│   │   ├── useTouchScroll.js    # Conversion des gestes tactiles en scroll
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
│   ├── App.jsx                  # Routes + Suspense (code splitting)
│   ├── App.css                  # Styles globaux
│   └── index.jsx                # Point d'entrée
│
├── index.html                   # Template HTML (CSP, preloads, polices)
├── vite.config.js               # Configuration Vite + Vitest
├── .env                         # Modèle des variables d'env (sans valeurs)
├── package.json
├── README.md                    # Version anglaise
└── README.fr.md                 # Version française
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
7. **EmailJS** — quota mensuel limité du plan gratuit, captcha verification activée sur le template principal

⚠️ **Note importante** : les clés EmailJS et reCAPTCHA sont exposées dans le bundle JS public (inhérent à toute SPA sans backend). La protection principale vient de la whitelist de domaine côté reCAPTCHA.

---

## ⚡ Performances

- **Code splitting** : chaque page est chargée à la demande via `React.lazy()`, pour alléger le bundle initial
- **Compression vidéo** : MP4 H.264 CRF 28 + WebM en fallback pour les navigateurs modernes
- **Polices préconnectées** : `<link rel="preconnect">` sur Google Fonts pour accélérer le chargement des polices
- **Loading screen rapide** : 900ms uniquement sur le premier load (Home + Projects)

---

## 🧩 Défis techniques

### Synchroniser la vidéo avec le scroll
Le cœur du site est une vidéo qui avance au rythme du défilement. Une première approche utilisait deux vidéos (une en marche avant, une en marche arrière) déclenchées selon le sens du scroll, mais leur synchronisation restait instable, notamment au retour à zéro de la boucle. La logique a été recentrée dans un hook dédié, `useVideoScroll`, qui fait le lien entre la progression du scroll, la vidéo et les étapes du parcours. C'est la partie la plus testée du projet (25 tests).

### Rendre le parcours utilisable au doigt
Sur mobile, l'événement `wheel` (molette) n'existe pas : le parcours restait bloqué. Le hook `useTouchScroll` convertit les gestes tactiles en événements que `useVideoScroll` sait déjà traiter, ce qui évite de dupliquer la logique entre ordinateur et mobile.

### Le routage sur GitHub Pages
GitHub Pages ne connaît que les fichiers statiques : rafraîchir `/Portfolio/projects` renvoyait une erreur 404. Un fichier `404.html` redirige vers l'application en encodant le chemin dans l'URL, puis un petit script dans `index.html` restaure la bonne adresse avant le démarrage de React Router. Le `basename` du routeur s'appuie sur `import.meta.env.BASE_URL` pour fonctionner aussi bien en local qu'en ligne.

### Un formulaire de contact sans backend
Sans serveur, toute la protection anti-spam doit se faire côté client : reCAPTCHA, champ honeypot, délai minimum avant envoi et limitation du nombre d'envois (voir [Sécurité](#-sécurité)). Pour tester ces protections, les tests simulent le passage du temps avec les faux timers de Vitest et vérifient qu'aucun email n'est envoyé quand un bot est détecté.

### La migration de Create React App vers Vite
Create React App n'étant plus maintenu, ses dépendances internes accumulaient les alertes de sécurité Dependabot, impossibles à corriger avec `npm audit fix`. La migration vers Vite a impliqué de :
- renommer les fichiers contenant du JSX en `.jsx` ;
- remplacer `process.env.REACT_APP_*` par `import.meta.env.VITE_*` ;
- adapter les tests de Jest à Vitest (`jest.requireActual` → `importOriginal`, mocks avec export `default`, imports ESM au lieu de `require`) ;
- corriger les chemins construits avec `BASE_URL` (qui se termine par `/`) ;
- publier le dossier `dist/` au lieu de l'ancien `build/`.

---

## 🧪 Tests

Tests unitaires avec **Vitest** + **React Testing Library** (103 tests).

```bash
npm test
```

Couverture actuelle :
- `useVideoScroll` (25 tests)
- `ProjectDetailPage` (21 tests)
- `RoadElement` menus (15 tests)
- `ProjectsPage` (14 tests)
- `AboutPage` (11 tests)
- Routes principales (9 tests)
- `ContactPage` + `ContactForm` — sécurité, accessibilité (8 tests)

---

## 🎨 Crédits & inspirations

- **Concept "voyage / road trip"** : design et illustrations personnels
- **Polices** : [Google Fonts](https://fonts.google.com/) (Fraunces, Manrope, JetBrains Mono, Caveat)
- **Icônes développeur** : [Devicons](https://devicon.dev/) (CDN jsDelivr)

---

## 👤 Auteur

**Mathieu Raudin**

- 🌐 [Portfolio](https://math011.github.io/Portfolio/)
- 💼 [LinkedIn](https://linkedin.com/in/mathieuraudin)
- 💻 [GitHub](https://github.com/Math011)

---

## 📝 Licence

Ce projet est personnel — code disponible à des fins d'inspiration uniquement.

Les éléments graphiques et le contenu (textes, illustrations, captures d'écran) ne sont pas réutilisables sans autorisation.