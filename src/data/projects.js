// Données centralisées des projets
// Les textes (title, description) utilisent des clés de traduction
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
    githubLink: 'https://github.com/',
    liveLink: '#',
    color: '#7CB342' // Vert
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
      '/images/projects/project2-3.jpg',
    ],
    tags: ['Vue.js', 'Firebase'],
    githubLink: 'https://github.com/',
    liveLink: '#',
    color: '#E67E22' // Orange
  },
  {
    id: 3,
    titleKey: 'project3_title',
    descriptionKey: 'project3_description',
    fullDescriptionKey: 'project3_fullDescription',
    image: '/images/projects/project3.jpg',
    gallery: [
      '/images/projects/project3.jpg',
      '/images/projects/project3-2.jpg',
      '/images/projects/project3-3.jpg',
    ],
    tags: ['Next.js', 'Tailwind CSS'],
    githubLink: 'https://github.com/',
    liveLink: '#',
    color: '#3498DB' // Bleu
  },
  {
    id: 4,
    titleKey: 'project4_title',
    descriptionKey: 'project4_description',
    fullDescriptionKey: 'project4_fullDescription',
    image: '/images/projects/project4.jpg',
    gallery: [
      '/images/projects/project4.jpg',
      '/images/projects/project4-2.jpg',
      '/images/projects/project4-3.jpg',
    ],
    tags: ['React Native', 'Express'],
    githubLink: 'https://github.com/',
    liveLink: '#',
    color: '#9B59B6' // Violet
  }
];