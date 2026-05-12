// Liste des projets — couleurs des ballons depuis la palette du site
export const projects = [
  {
    id: 1,
    titleKey: 'project1_title',
    descriptionKey: 'project1_description',
    fullDescriptionKey: 'project1_fullDescription',
    image: '/images/projects/project1.jpg',
    gallery: [
      '/images/projets/portfolio/portfolio-home.jpg',
      '/images/projets/portfolio/portfolio-about.jpg',
      '/images/projets/portfolio/portfolio-contact.jpg'
    ],
    tags: ['React'],
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
      '/images/projects/project2.jpg',
      '/images/projects/project2-2.jpg',
    ],
    tags: ['React'],
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
      '/images/projects/project3.jpg',
    ],
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
    githubLink: 'https://github.com/Math011/project4',
    liveLink: '#',
    color: '#C5542B'
  },
];

// Export default pour compatibilité
export default projects;