import React from 'react';
import styles from '../ContactPage.module.css';

// =============================================================================
// SVG COMPONENTS - Éléments de la scène
// =============================================================================

// Feu de camp animé
export const Campfire = () => (
  <svg width="140" height="120" viewBox="0 0 160 140" className={styles.campfire}>
    {/* Cercle de pierres au sol (style cercle de feu de camp) */}
    <ellipse cx="80" cy="128" rx="62" ry="9" fill="rgba(0,0,0,0.18)" />

    {/* Pierres en cercle (5 visibles devant + 2 latérales) */}
    <ellipse cx="22" cy="124" rx="13" ry="10" fill="#5d5550" />
    <ellipse cx="22" cy="121" rx="11" ry="7"  fill="#7a716a" />
    <ellipse cx="42" cy="130" rx="12" ry="8" fill="#6b6258" />
    <ellipse cx="42" cy="127" rx="10" ry="5" fill="#857c70" />
    <ellipse cx="80" cy="132" rx="14" ry="8" fill="#5d5550" />
    <ellipse cx="80" cy="129" rx="12" ry="5" fill="#7a716a" />
    <ellipse cx="118" cy="130" rx="12" ry="8" fill="#6b6258" />
    <ellipse cx="118" cy="127" rx="10" ry="5" fill="#857c70" />
    <ellipse cx="138" cy="124" rx="13" ry="10" fill="#5d5550" />
    <ellipse cx="138" cy="121" rx="11" ry="7"  fill="#7a716a" />

    {/* Bûches croisées en X */}
    <g transform="translate(80 110)">
      {/* Bûche arrière */}
      <rect x="-42" y="-7" width="84" height="14" rx="6" fill="#3e2a1f" transform="rotate(-22)" />
      <rect x="-40" y="-5" width="80" height="3"  rx="1.5" fill="#5a3d2d" transform="rotate(-22)" />
      <ellipse cx="-42" cy="0" rx="5" ry="7" fill="#2a1c14" transform="rotate(-22)" />
      <ellipse cx="-42" cy="0" rx="3" ry="4" fill="#6b4a36" transform="rotate(-22)" />
      <circle cx="-42" cy="0" r="1.2" fill="#3e2a1f" transform="rotate(-22)" />
      <ellipse cx="42" cy="0" rx="5" ry="7" fill="#2a1c14" transform="rotate(-22)" />
      <ellipse cx="42" cy="0" rx="3" ry="4" fill="#6b4a36" transform="rotate(-22)" />
      <circle cx="42" cy="0" r="1.2" fill="#3e2a1f" transform="rotate(-22)" />

      {/* Bûche avant croisée */}
      <rect x="-42" y="-7" width="84" height="14" rx="6" fill="#4a3225" transform="rotate(22)" />
      <rect x="-40" y="-5" width="80" height="3"  rx="1.5" fill="#6b4a36" transform="rotate(22)" />
      <ellipse cx="-42" cy="0" rx="5" ry="7" fill="#2a1c14" transform="rotate(22)" />
      <ellipse cx="-42" cy="0" rx="3" ry="4" fill="#7a5640" transform="rotate(22)" />
      <circle cx="-42" cy="0" r="1.2" fill="#3e2a1f" transform="rotate(22)" />
      <ellipse cx="42" cy="0" rx="5" ry="7" fill="#2a1c14" transform="rotate(22)" />
      <ellipse cx="42" cy="0" rx="3" ry="4" fill="#7a5640" transform="rotate(22)" />
      <circle cx="42" cy="0" r="1.2" fill="#3e2a1f" transform="rotate(22)" />
    </g>

    {/* Braises rougeoyantes (sous les flammes, sur les bûches) */}
    <g className={styles.embers}>
      <ellipse cx="68" cy="105" rx="3" ry="1.5" fill="#ff5722" opacity="0.85" />
      <ellipse cx="80" cy="108" rx="4" ry="2"   fill="#ff7043" opacity="0.9" />
      <ellipse cx="92" cy="105" rx="3" ry="1.5" fill="#ff5722" opacity="0.85" />
    </g>

    {/* Flammes stylisées en gouttes (dégradé orange → jaune → blanc) */}
    <g className={styles.flames}>
      {/* Flamme externe gauche */}
      <path
        className={styles.flame2}
        d="M62 105 C 50 92, 50 70, 62 50 C 68 70, 70 90, 62 105 Z"
        fill="#e8552a"
      />
      {/* Flamme externe droite */}
      <path
        className={styles.flame3}
        d="M98 105 C 110 92, 110 70, 98 50 C 92 70, 90 90, 98 105 Z"
        fill="#e8552a"
      />
      {/* Flamme principale (haute, centrale) */}
      <path
        className={styles.flame1}
        d="M80 108 C 62 90, 62 60, 75 30 C 80 18, 80 18, 85 30 C 98 60, 98 90, 80 108 Z"
        fill="#ff7a2e"
      />
      {/* Cœur jaune */}
      <path
        className={styles.flameInner}
        d="M80 105 C 70 90, 70 65, 78 45 C 80 38, 80 38, 82 45 C 90 65, 90 90, 80 105 Z"
        fill="#ffc94a"
      />
      {/* Cœur blanc chaud */}
      <path
        className={styles.flameCore}
        d="M80 100 C 75 88, 75 70, 79 58 C 80 53, 80 53, 81 58 C 85 70, 85 88, 80 100 Z"
        fill="#fff4c4"
      />
    </g>

    {/* Étincelles qui montent */}
    <g className={styles.sparks}>
      <circle className={styles.spark1} cx="72" cy="40" r="1.8" fill="#ffc94a" />
      <circle className={styles.spark2} cx="86" cy="32" r="1.5" fill="#ff8f00" />
      <circle className={styles.spark3} cx="68" cy="22" r="1.4" fill="#ffc94a" />
      <circle className={styles.spark4} cx="90" cy="14" r="1.8" fill="#ff7043" />
    </g>
  </svg>
);

// Panneau en bois
export const WoodenSign = ({ text }) => (
  <svg width="260" height="160" viewBox="0 0 280 180" className={styles.woodenSign}>
    {/* Poteau central */}
    <rect x="125" y="60" width="30" height="120" fill="#5D4037" />
    <rect x="130" y="60" width="8" height="120" fill="#6D4C41" />
    
    {/* Panneau */}
    <rect x="15" y="10" width="250" height="60" rx="5" fill="#8D6E63" />
    <path d="M20 25 Q70 23, 140 25 Q200 27, 260 25" stroke="rgba(0,0,0,0.1)" fill="none" strokeWidth="2" />
    <path d="M20 40 Q100 38, 180 40 Q230 42, 260 40" stroke="rgba(0,0,0,0.08)" fill="none" strokeWidth="2" />
    <path d="M20 55 Q60 53, 120 55 Q190 57, 260 55" stroke="rgba(0,0,0,0.1)" fill="none" strokeWidth="2" />
    <rect x="15" y="10" width="250" height="15" rx="5" fill="rgba(255,255,255,0.1)" />
    
    {/* Texte */}
    <text x="140" y="48" textAnchor="middle" fontSize="20" fill="#3E2723" fontFamily="'Caveat', cursive" fontWeight="bold">
      {text}
    </text>
    
    {/* Clous */}
    <circle cx="30" cy="25" r="4" fill="#424242" />
    <circle cx="250" cy="25" r="4" fill="#424242" />
    <circle cx="30" cy="55" r="4" fill="#424242" />
    <circle cx="250" cy="55" r="4" fill="#424242" />
  </svg>
);

// Personne assise
export const Person = ({ variant = 1 }) => {
  // Variant 1 = personnage à gauche (regarde à droite, vers son ami).
  // Variant 2 = personnage à droite (regarde à gauche via scaleX).
  // Le SVG est dessiné de face avec jambes symétriques et deux bras, mais
  // la TÊTE est tournée à droite pour que le personnage regarde vers l'autre
  // de l'autre côté du feu. Le scaleX(-1) sur variant 2 inverse tout proprement.
  const facingRight = variant === 1;

  const palette = facingRight
    ? { jacket: '#3a5a78', jacketShade: '#28435c', pants: '#3e2a1f', pantsShade: '#2a1c14', skin: '#d9a886', skinShade: '#b88564', hair: '#2c1810', boot: '#1a1108' }
    : { jacket: '#7a3a4e', jacketShade: '#5a2638', pants: '#3a3028', pantsShade: '#241d18', skin: '#c89a78', skinShade: '#a47856', hair: '#3a2014', boot: '#1a1108' };

  return (
    <svg
      width="46"
      height="68"
      viewBox="0 0 60 90"
      className={styles.person}
      style={{ transform: facingRight ? 'scaleX(1)' : 'scaleX(-1)' }}
    >
      {/* === Jambes symétriques (assises, légèrement écartées) === */}
      {/* Jambe gauche */}
      <path
        d="M19 60 Q18 72, 20 82 L28 82 Q28 70, 28 60 Z"
        fill={palette.pants}
      />
      <ellipse cx="24" cy="84" rx="6" ry="3" fill={palette.boot} />

      {/* Jambe droite */}
      <path
        d="M32 60 Q32 70, 32 82 L40 82 Q42 72, 41 60 Z"
        fill={palette.pants}
      />
      <ellipse cx="36" cy="84" rx="6" ry="3" fill={palette.boot} />

      {/* === Buste (manteau) === */}
      <path
        d="M16 60 Q14 44, 18 32 Q24 26, 30 25 Q36 26, 42 32 Q46 44, 44 60 Z"
        fill={palette.jacket}
      />
      {/* Légère ombre verticale au centre pour donner du volume */}
      <path
        d="M30 28 Q31 42, 30 58"
        stroke={palette.jacketShade}
        strokeWidth="1"
        fill="none"
        opacity="0.4"
      />

      {/* === Bras gauche : pend le long du corps === */}
      <path
        d="M16 36 Q12 44, 14 56 Q16 58, 18 56 Q19 46, 20 38 Z"
        fill={palette.jacket}
      />
      {/* Main gauche */}
      <circle cx="16" cy="56" r="3" fill={palette.skin} />

      {/* === Bras droit : tendu en avant vers le feu === */}
      <path
        d="M40 36 Q48 42, 46 52 Q43 56, 40 54 Q39 46, 38 38 Z"
        fill={palette.jacket}
      />
      {/* Main droite (vers le feu) */}
      <circle cx="43" cy="53" r="3" fill={palette.skin} />

      {/* === Cou (légèrement décalé à droite, comme tête tournée vers le feu) === */}
      <rect x="29" y="22" width="5" height="5" fill={palette.skinShade} />

      {/* === Tête tournée à droite (vers l'autre personnage / le feu) === */}
      <ellipse cx="32" cy="16" rx="7.5" ry="9" fill={palette.skin} />
      {/* Petite zone d'ombre côté arrière (gauche dans cette vue) pour le volume */}
      <path
        d="M25 14 Q24 10, 26 7 Q26 12, 27 18 Q26 18, 25 16 Z"
        fill={palette.skinShade}
        opacity="0.6"
      />

      {/* === Cheveux / bonnet (couvre crâne, descend un peu sur la nuque arrière) === */}
      <path
        d="M24 13 Q23 5, 31 4 Q39 5, 39 13 Q39 17, 37 18 L37 10 Q31 7, 26 11 L26 17 Q24 17, 24 13 Z"
        fill={palette.hair}
      />
      {/* Petit pompon/bouton de bonnet au sommet */}
      <circle cx="32" cy="3.5" r="1.8" fill={palette.hair} />
    </svg>
  );
};

// Bûche
export const Log = () => (
  <svg width="70" height="25" viewBox="0 0 100 35" className={styles.log}>
    <ellipse cx="10" cy="18" rx="10" ry="12" fill="#5D4037" />
    <rect x="10" y="6" width="80" height="24" fill="#6D4C41" />
    <ellipse cx="90" cy="18" rx="10" ry="12" fill="#8D6E63" />
    <ellipse cx="90" cy="18" rx="7" ry="9" fill="#A1887F" />
    <circle cx="90" cy="18" r="6" stroke="#8D6E63" strokeWidth="1" fill="none" />
  </svg>
);