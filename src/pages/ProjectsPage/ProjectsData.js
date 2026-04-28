// Liste des projets — couleurs des ballons depuis la palette du site

export const projects = [
  {
    id: 1,
    titleKey: 'project1_title',
    descriptionKey: 'project1_description',
    fullDescriptionKey: 'project1_fullDescription',
    image: '/images/projects/project1.jpg',
    gallery: [
      '/images/projects/project1.jpg',
      '/images/projects/project1-2.jpg',
      '/images/projects/project1-3.jpg',
    ],
    tags: ['React', 'Node.js', 'MongoDB'],
    githubLink: 'https://github.com/username/project1',
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
    tags: ['Vue.js', 'Firebase'],
    githubLink: 'https://github.com/username/project2',
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
    tags: ['Next.js', 'Tailwind CSS'],
    githubLink: 'https://github.com/username/project3',
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
      '/images/projects/project4.jpg',
    ],
    tags: ['React Native', 'Express'],
    githubLink: 'https://github.com/username/project4',
    liveLink: '#',
    color: '#C5542B'
  },
];

// Export default pour compatibilité
export default projects;