// =============================================================================
// SKILLS - source des compétences techniques
// -----------------------------------------------------------------------------
// Modifier cette liste suffit à mettre à jour la page À propos. Le compteur
// total dans les stats est calculé automatiquement (TOTAL_SKILLS).
// =============================================================================

export const SKILLS = {
  frontend: [
    { name: 'React',      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
    { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
    { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
    { name: 'HTML5',      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
    { name: 'CSS3',       icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' },
  ],
  backend: [
    { name: 'PHP',     icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg' },
    { name: 'Symfony', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/symfony/symfony-original.svg' },
  ],
  database: [
    { name: 'MySQL',      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
    { name: 'PostgreSQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
  ],
  testing: [
    // PHPUnit n'a pas d'icône Devicon claire. On laisse l'icon à null :
    // le SkillChip détecte ce cas et affiche le nom en style "puce texte"
    // au lieu d'un placeholder d'image cassée.
    { name: 'PHPUnit', icon: null },
  ],
  tools: [
    { name: 'Git',            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
    { name: 'GitHub',         icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg' },
    { name: 'GitLab',         icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gitlab/gitlab-original.svg' },
    { name: 'GitHub Actions', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/githubactions/githubactions-original.svg' },
    { name: 'Docker',         icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
  ],
};

// Compte le total de skills à travers toutes les catégories (dynamique).
// Utilisé dans la section "Stats" pour éviter de tenir un compteur à la main.
export const TOTAL_SKILLS = Object.values(SKILLS).reduce(
  (sum, list) => sum + list.length,
  0
);