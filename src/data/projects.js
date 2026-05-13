import Project2Content from '../pages/ProjectDetailPage/projectContents/Project2Content';
import Project3Content from '../pages/ProjectDetailPage/projectContents/Project3Content';

const BASE = process.env.PUBLIC_URL;

// Liste des projets — couleurs des ballons depuis la palette du site
export const projects = [
  {
    id: 1,
    titleKey: 'project1_title',
    descriptionKey: 'project1_description',
    fullDescriptionKey: 'project1_fullDescription',

    image: `${BASE}/images/projects/portfolio/portfolio-home.jpg`,

    gallery: [
      `${BASE}/images/projects/portfolio/portfolio-home.jpg`,
      `${BASE}/images/projects/portfolio/portfolio-about.jpg`,
      `${BASE}/images/projects/portfolio/portfolio-contact.jpg`,
    ],

    tags: ['React', 'CSS Modules', 'EmailJS'],

    githubLink: 'https://github.com/Math011/Portfolio',

    liveLink: '#',

    color: '#D9732D'
  },

  {
    id: 2,
    titleKey: 'project2_title',
    descriptionKey: 'project2_description',
    fullDescriptionKey: 'project2_fullDescription',

    image: `${BASE}/images/projects/news/news-home.jpg`,

    gallery: [
      `${BASE}/images/projects/news/news-home.jpg`,
      `${BASE}/images/projects/news/news-in-game.jpg`,
      `${BASE}/images/projects/news/news-resultats.jpg`,
    ],

    customContent: Project2Content,

    tags: ['Vanilla JS'],

    githubLink: 'https://github.com/Math011/news',

    liveLink: '#',

    color: '#5A7046'
  },

  {
    id: 3,
    titleKey: 'project3_title',
    descriptionKey: 'project3_description',
    fullDescriptionKey: 'project3_fullDescription',

    image: `${BASE}/images/projects/docker-symfony-template/docker-symfony-react.jpg`,

    gallery: [
      `${BASE}/images/projects/docker-symfony-template/docker-symfony-react.jpg`,
      `${BASE}/images/projects/docker-symfony-template/docker-symfony.jpg`,
    ],

    customContent: Project3Content,

    tags: ['Shell'],

    githubLink: 'https://github.com/Math011/docker-symfony-template',

    liveLink: '#',

    color: '#8B5A2B'
  },

  {
    id: 4,
    titleKey: 'project4_title',
    descriptionKey: 'project4_description',
    fullDescriptionKey: 'project4_fullDescription',

    image: `${BASE}/images/projects/project4.jpg`,

    gallery: [],

    tags: ['Symfony', 'React', 'PostgreSQL'],

    githubLink: 'https://github.com/Math011/',

    liveLink: '#',

    color: '#C5542B'
  },
];

// Export default pour compatibilité
export default projects;