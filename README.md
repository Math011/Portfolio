# 🎒 Portfolio — Mathieu Raudin

🇬🇧 **English** · 🇫🇷 [Français](README.fr.md)

A personal portfolio built around a travel and road-trip theme. Visitors scroll through a landscape that unfolds as they go, discovering each "stop" along the journey: who I am, my projects, and how to get in touch.

🌐 **Live demo**: [math011.github.io/Portfolio](https://math011.github.io/Portfolio/)

---

## ✨ Features

- 🎬 **Scroll-driven animation**: a landscape video plays in the background, synced with the visitor's progress (mouse wheel and touch screens)
- 🗺️ **Interactive road map**: stops Home → About → Projects → Contact → Finish line
- 🌍 **Bilingual**: French/English with instant switching (React context)
- 📧 **Secure contact form**: EmailJS + reCAPTCHA v2 + honeypot + anti-bot timing check
- 🎨 **"Travel journal" design**: amber paper, Fraunces/Manrope/Caveat fonts, vector illustrations
- 🌙 **Night scene on the Contact page**: animated campfire, twinkling stars, cratered moon
- ⚡ **Optimized performance**: code splitting, lazy loading, video compression, preconnect

---

## 🛠️ Tech stack

| Category | Technologies |
|---|---|
| **Front-end** | React 18, React Router v7, CSS Modules |
| **Tooling** | Vite, Vitest, Testing Library |
| **Services** | EmailJS (email delivery), Google reCAPTCHA v2 |
| **Hosting** | GitHub Pages |
| **Fonts** | Fraunces, Manrope, JetBrains Mono, Caveat (Google Fonts) |

---

## 🚀 Getting started

### Prerequisites

- Node.js ≥ 20.19 (22 recommended)
- npm ≥ 10

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/Math011/Portfolio.git
cd Portfolio

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env .env.local
# Then open .env.local and fill in your real keys
```

### Environment variables (`.env.local`)

```env
# EmailJS — create an account at https://www.emailjs.com/
VITE_APP_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_APP_EMAILJS_TEMPLATE_ID=template_xxxxxxx
VITE_APP_EMAILJS_AUTOREPLY_ID=template_xxxxxxx
VITE_APP_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxxx

# Google reCAPTCHA v2 — create a key at https://www.google.com/recaptcha/admin
VITE_APP_RECAPTCHA_SITE_KEY=6Lcxxxxxxxxxxxxxxxxxxxxxxxxx

# Contact email shown on the Contact page
VITE_APP_CONTACT_EMAIL=you@example.com
```

> Vite only exposes variables prefixed with `VITE_` to the code. Restart the dev server after editing the file.

---

## 💻 Available scripts

```bash
# Start the dev server (http://localhost:3000/Portfolio/)
npm start

# Run unit tests (watch mode)
npm test

# Run tests once (CI)
npx vitest run

# Production build (dist/ folder)
npm run build

# Preview the production build locally
npm run preview

# Publish to GitHub Pages (build + push to the gh-pages branch)
npm run deploy
```

---

## 📁 Project structure

```
Portfolio/
├── public/                      # Files copied as-is into dist/
│   ├── cv/                      # Résumé as PDF (FR / EN)
│   ├── images/                  # Static assets (SVG, JPG)
│   │   └── projets/             # Project screenshots
│   ├── videos/                  # Journey background videos
│   ├── 404.html                 # SPA redirect for GitHub Pages
│   ├── favicon.svg / favicon.ico
│   └── robots.txt
│
├── src/
│   ├── components/              # Reusable components
│   │   ├── BackgroundVideo/     # Scroll-driven background video
│   │   ├── Header/              # Main navigation
│   │   ├── LanguageSwitcher/    # FR / EN
│   │   ├── LoadingScreen/       # Initial loading screen
│   │   ├── ProgressBar/         # Journey progress bar
│   │   ├── RoadElement/         # Floating cards (HomeMenu, AboutMenu, etc.)
│   │   └── ScrollHint/          # "Scroll to explore" hint
│   │
│   ├── contexts/
│   │   └── LanguageContext.jsx  # FR/EN handling
│   │
│   ├── data/
│   │   └── journeySteps.js      # Journey stop definitions
│   │
│   ├── hooks/
│   │   ├── useFirstLoad.js      # Loading screen on first visit
│   │   ├── useTouchScroll.js    # Turns touch gestures into scrolling
│   │   └── useVideoScroll.js    # Scroll ↔ video sync
│   │
│   ├── pages/
│   │   ├── AboutPage/           # "About" page
│   │   ├── ContactPage/         # "Contact" page (night scene + form)
│   │   ├── ProjectsPage/        # Project list
│   │   ├── ProjectDetailPage/   # Project details
│   │   └── NotFoundPage/        # 404
│   │
│   ├── translations/            # FR/EN translation files
│   ├── App.jsx                  # Routes + Suspense (code splitting)
│   ├── App.css                  # Global styles
│   └── index.jsx                # Entry point
│
├── index.html                   # HTML template (CSP, preloads, fonts)
├── vite.config.js               # Vite + Vitest configuration
├── .env                         # Environment variable template (no values)
├── package.json
├── README.md                    # English version
└── README.fr.md                 # French version
```

---

## 🔒 Security

The contact form is protected by several layers:

1. **reCAPTCHA v2** — verified by Google (with domain allowlist enabled)
2. **Honeypot** — a hidden `website` field that should never be filled in (catches automated bots)
3. **Timing check** — makes sure the user spent at least 3 seconds on the form (filters out ultra-fast bots)
4. **Client-side rate limiting** — at most 3 submissions per hour, with at least 1 minute between two submissions
5. **Client-side validation** — field lengths, email format, spam URL detection
6. **CSP (Content Security Policy)** — restricts the allowed sources for scripts/styles/images
7. **EmailJS** — built-in quota of 200 emails/month, captcha verification enabled on the main template

⚠️ **Important note**: the EmailJS and reCAPTCHA keys are exposed in the public JS bundle (inherent to any SPA without a backend). The main protection comes from the reCAPTCHA domain allowlist.

---

## ⚡ Performance

- **Code splitting**: each page is loaded on demand with `React.lazy()` → ~50% lighter initial bundle
- **Video compression**: MP4 H.264 CRF 28 + WebM fallback for modern browsers
- **Preconnected fonts**: `<link rel="preconnect">` to Google Fonts saves ~100ms
- **Fast loading screen**: 900ms, only on first load (Home + Projects)

---

## 🧪 Testing

Unit tests with **Vitest** + **React Testing Library** (103 tests).

```bash
npm test
```

Current coverage:
- `useVideoScroll` (25 tests)
- `ProjectDetailPage` (21 tests)
- `RoadElement` menus (15 tests)
- `ProjectsPage` (14 tests)
- `AboutPage` (11 tests)
- Main routes (9 tests)
- `ContactPage` + `ContactForm` — security, accessibility (8 tests)

---

## 🎨 Credits & inspiration

- **"Travel / road trip" concept**: original design and illustrations
- **Fonts**: [Google Fonts](https://fonts.google.com/) (Fraunces, Manrope, JetBrains Mono, Caveat)
- **Developer icons**: [Devicons](https://devicon.dev/) (jsDelivr CDN)

---

## 👤 Author

**Mathieu Raudin**

- 🌐 [Portfolio](https://math011.github.io/Portfolio/)
- 💼 [LinkedIn](https://linkedin.com/in/mathieu-raudin-4a9b90230)
- 💻 [GitHub](https://github.com/Math011)

---

## 📝 License

This is a personal project — the code is available for educational and inspiration purposes only.

Graphic assets and content (text, illustrations, screenshots) may not be reused without permission.
