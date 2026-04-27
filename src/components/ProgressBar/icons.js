import React from 'react';

// Icônes SVG sobres pour les étapes de la barre de progression.
// Toutes utilisent currentColor pour s'adapter à la couleur du parent.
// Taille standard : 14x14px (cf. ProgressBar).

export const HomeIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"
       strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 7 L8 2 L14 7 L14 13 Q14 14 13 14 L3 14 Q2 14 2 13 Z" />
    <path d="M6 14 L6 9 L10 9 L10 14" />
  </svg>
);

export const TentIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4"
       strokeLinecap="round" strokeLinejoin="round">
    {/* Toile gauche */}
    <path d="M3 13 L8 4" />
    {/* Toile droite */}
    <path d="M13 13 L8 4" />
    {/* Sol */}
    <path d="M2.5 13 L13.5 13" />
    {/* Ouverture en V (entrée) */}
    <path d="M6.5 13 L8 9 L9.5 13" />
    {/* Mât */}
    <path d="M8 4 L8 3" />
  </svg>
);

export const RocketIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"
       strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 2 Q11 5 11 9 L11 12 L5 12 L5 9 Q5 5 8 2 Z" />
    <circle cx="8" cy="7" r="1.2" />
    <path d="M5 12 L3 14 M11 12 L13 14" />
  </svg>
);

export const MailboxIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"
       strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 7 Q3 5 5 5 L11 5 Q13 5 13 7 L13 13 L3 13 Z" />
    <path d="M5 5 L5 9" />
    <path d="M8 14 L8 13" />
  </svg>
);

// Icône du petit coureur sur la ligne (orienté à droite).
export const RunnerIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round">
    <circle cx="14" cy="5" r="2" fill="currentColor" stroke="none" />
    <path d="M6 22 L10 15 L13 13 L16 15" />
    <path d="M10 15 L7 11 L12 8 L16 9 L19 12" />
    <path d="M13 13 L16 18 L13 22" />
  </svg>
);

// Drapeau à damier — affiché seulement quand on est arrivé.
// Pour l'animation "qui se hisse", on utilise un composant dédié RisingFlag.
export const CheckeredFlag = () => (
  <svg viewBox="0 0 16 16" fill="none">
    {/* Mât */}
    <line x1="3" y1="2" x2="3" y2="14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    {/* Damier 4x3 */}
    <g transform="translate(3.8, 2.5)">
      {[0, 1, 2, 3].map((col) =>
        [0, 1, 2].map((row) => {
          const isFilled = (col + row) % 2 === 0;
          return (
            <rect
              key={`${col}-${row}`}
              x={col * 2}
              y={row * 2}
              width="2"
              height="2"
              fill={isFilled ? 'currentColor' : 'transparent'}
            />
          );
        })
      )}
    </g>
  </svg>
);

/* ----------------------------------------------------------------------------
   RisingFlag — drapeau qui se hisse le long du mât en fonction du progress.
   - progress = 0   → drapeau en bas du mât (rangé)
   - progress = 100 → drapeau hissé en haut + ondulation continue
   ---------------------------------------------------------------------------- */
export const RisingFlag = ({ progress = 0 }) => {
  // De 80% à 100%, le drapeau monte ; avant, il reste rangé en bas.
  const start = 80;
  const end = 100;
  const t = Math.max(0, Math.min(1, (progress - start) / (end - start)));

  // Position verticale du drapeau (en unités SVG, sur 16x16) :
  // - rangé en bas : y = 11
  // - hissé en haut : y = 2.5
  const flagBaseY = 11 - t * 8.5;

  // Dès qu'il est hissé (≥95%), on déclenche l'ondulation.
  const isHoisted = t > 0.95;

  return (
    <svg viewBox="0 0 16 16" fill="none" style={{ overflow: 'visible' }}>
      {/* Ondulation : on injecte le keyframes localement (s'exécute en SVG) */}
      <style>{`
        @keyframes risingFlagWave {
          0%, 100% { transform: skewY(0deg)   scaleX(1); }
          25%      { transform: skewY(-3deg)  scaleX(1.02); }
          50%      { transform: skewY(0deg)   scaleX(0.98); }
          75%      { transform: skewY(3deg)   scaleX(1.02); }
        }
      `}</style>

      {/* Sol */}
      <line x1="1.5" y1="14" x2="6" y2="14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
      {/* Mât */}
      <line x1="3" y1="2" x2="3" y2="14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      {/* Anneau au sommet */}
      <circle cx="3" cy="2" r="0.6" fill="currentColor" />

      {/* Drapeau qui se hisse — translation Y selon progress */}
      <g
        style={{
          transform: `translateY(${flagBaseY - 2.5}px)`,
          transition: 'transform 220ms ease-out',
        }}
      >
        {/* Sous-groupe qui ondule (animation indépendante de la translation) */}
        <g
          style={{
            transformOrigin: '3px 5.5px',
            animation: isHoisted ? 'risingFlagWave 2.4s ease-in-out infinite' : 'none',
          }}
        >
          {/* Damier 4x3 collé au mât */}
          {[0, 1, 2, 3].map((col) =>
            [0, 1, 2].map((row) => {
              const isFilled = (col + row) % 2 === 0;
              return (
                <rect
                  key={`${col}-${row}`}
                  x={3.8 + col * 2}
                  y={2.5 + row * 2}
                  width="2"
                  height="2"
                  fill={isFilled ? 'currentColor' : 'transparent'}
                />
              );
            })
          )}
        </g>
      </g>
    </svg>
  );
};