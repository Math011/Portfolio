import Project2Content from '../pages/ProjectDetailPage/projectContents/Project2Content';
import Project3Content from '../pages/ProjectDetailPage/projectContents/Project3Content';


// Liste des projets — couleurs des ballons depuis la palette du site
export const projects = [
  {
    id: 1,
    titleKey: 'project1_title', 
    descriptionKey: 'project1_description',
    fullDescriptionKey: 'project1_fullDescription',
    image: '/images/projects/project1.jpg',
    gallery: [
      '/images/projects/portfolio/portfolio-home.jpg',
      '/images/projects/portfolio/portfolio-about.jpg',
      '/images/projects/portfolio/portfolio-contact.jpg'
    ],
    tags: ['React', 'CSS Modules', 'EmailJS'],
    githubLink: 'https://github.com/Math011/Portfolio ',
    liveLink: '#',
    color: '#D9732D'
  },
  {
    id: 2,
    titleKey: 'project2_title',
    descriptionKey: 'project2_description',
    fullDescriptionKey: 'project2_fullDescription',
    image: '/images/projects/project2.jpg',
    gallery: [
      '/images/projects/news/news-home.jpg',
      '/images/projects/news/news-in-game.jpg',
      '/images/projects/news/news-resultats.jpg',
    ],
    customContent: Project2Content,
    tags: ['Vanilla Js'],
    githubLink: 'https://github.com/Math011/news',
    liveLink: '#',
    color: '#5A7046'
  },
  {
    id: 3,
    titleKey: 'project3_title',
    descriptionKey: 'project3_description',
    fullDescriptionKey: 'project3_fullDescription',
    image: '/images/projects/project3.jpg',
    gallery: [
      '/images/projects/docker-symfony-template/docker-symfony-react.jpg',
      '/images/projects/docker-symfony-template/docker-symfony.jpg',
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
    image: '/images/projects/project4.jpg',
    gallery: [
    ],
    tags: ['Symfony', 'React', 'PostgreSQL'],
    githubLink: 'https://github.com/Math011/',
    liveLink: '#',
    color: '#C5542B'
  },
];

// Export default pour compatibilité
export default projects;