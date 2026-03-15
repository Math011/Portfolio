// =============================================================================
// CONFIGURATION generateClouds, generateBirds 
// =============================================================================

export const CLOUD_IMAGES = ['nuage1.svg', 'nuage2.svg', 'nuage3.svg', 'nuage5.svg'];
export const CLOUD_SIZES = ['xsmall', 'small', 'medium', 'large', 'xlarge', 'xxlarge'];
export const CLOUD_SPEEDS = ['slow', 'normal', 'fast'];

export const SIZE_TO_OPACITY = {
  xsmall: 'veryLight',
  small: 'light',
  medium: 'mediumLight',
  large: 'medium',
  xlarge: 'mediumDark',
  xxlarge: 'dark'
};

export const SIZE_TO_CLASS = {
  xsmall: 'sizeXsmall',
  small: 'sizeSmall',
  medium: 'sizeMedium',
  large: 'sizeLarge',
  xlarge: 'sizeXlarge',
  xxlarge: 'sizeXxlarge'
};

export const OPACITY_TO_CLASS = {
  veryLight: 'opacityVeryLight',
  light: 'opacityLight',
  mediumLight: 'opacityMediumLight',
  medium: 'opacityMedium',
  mediumDark: 'opacityMediumDark',
  dark: 'opacityDark'
};

export const SPEED_TO_CLASS = {
  slow: 'speedSlow',
  normal: 'speedNormal',
  fast: 'speedFast'
};

// =============================================================================
// HELPERS
// =============================================================================

// Fonction random avec seed
const createRandom = (randomSeed) => (seed) => {
  const x = Math.sin((seed + randomSeed) * 9999) * 10000;
  return x - Math.floor(x);
};

// =============================================================================
// GENERATORS
// =============================================================================

export const generateBirds = (numberOfProjects) => {
  const birds = [];
  const randomSeed = Math.random() * 10000;
  const random = createRandom(randomSeed);
  
  let birdId = 0;
  const zoneHeight = 450;
  const birdsPerZone = 5;

  // Zone du titre
  for (let i = 0; i < 3; i++) {
    birdId++;
    const isLeft = random(birdId * 7) > 0.5;
    birds.push({
      id: birdId,
      top: `${50 + random(birdId * 3) * 100}px`,
      left: isLeft ? '-5%' : undefined,
      right: !isLeft ? '-5%' : undefined,
      size: Math.round(18 + random(birdId * 11) * 18),
      direction: isLeft ? 'right' : 'left',
      duration: Math.round(18 + random(birdId * 13) * 18),
      delay: Math.round(-(random(birdId * 17) * 30)),
    });
  }

  // Zones des projets
  for (let zone = 0; zone < numberOfProjects; zone++) {
    const zoneStart = 180 + (zone * zoneHeight);
    const sectionHeight = zoneHeight / birdsPerZone;

    for (let i = 0; i < birdsPerZone; i++) {
      birdId++;
      const sectionStart = zoneStart + (i * sectionHeight);
      const topPosition = sectionStart + random(birdId * 3) * (sectionHeight * 0.8);
      const isLeft = random(birdId * 7) > 0.5;

      birds.push({
        id: birdId,
        top: `${topPosition}px`,
        left: isLeft ? '-5%' : undefined,
        right: !isLeft ? '-5%' : undefined,
        size: Math.round(18 + random(birdId * 11) * 18),
        direction: isLeft ? 'right' : 'left',
        duration: Math.round(18 + random(birdId * 13) * 18),
        delay: Math.round(-(random(birdId * 17) * 30)),
      });
    }
  }

  return birds;
};

export const generateClouds = (numberOfProjects) => {
  const clouds = [];
  const randomSeed = Math.random() * 10000;
  const random = createRandom(randomSeed);
  
  let cloudId = 0;
  const zoneHeight = 450;

  // Zone du titre
  const titleClouds = 2 + Math.floor(random(999) * 2);
  for (let i = 0; i < titleClouds; i++) {
    cloudId++;
    clouds.push(createCloud(cloudId, 20 + random(cloudId * 17) * 120, random));
  }

  // Zones des projets
  for (let zone = 0; zone < numberOfProjects; zone++) {
    const zoneStart = 150 + (zone * zoneHeight);
    const zoneEnd = zoneStart + zoneHeight;
    const thirdHeight = (zoneEnd - zoneStart) / 3;
    const cloudsInZone = 5 + Math.floor(random(zone * 100) * 3);

    for (let i = 0; i < cloudsInZone; i++) {
      cloudId++;
      const section = i % 3;
      const sectionStart = zoneStart + (section * thirdHeight);
      const overflow = thirdHeight * 0.2;
      const top = (sectionStart - overflow) + random(cloudId * 17) * (thirdHeight + overflow * 2);
      
      clouds.push(createCloud(cloudId, Math.max(20, top), random));
    }
  }

  return clouds;
};

const createCloud = (id, top, random) => {
  const imageIndex = Math.floor(random(id * 23) * CLOUD_IMAGES.length);
  const sizeIndex = Math.floor(random(id * 37) * CLOUD_SIZES.length);
  const speedIndex = Math.floor(random(id * 41) * CLOUD_SPEEDS.length);
  const size = CLOUD_SIZES[sizeIndex];

  return {
    id,
    image: CLOUD_IMAGES[imageIndex],
    top: `${Math.round(top)}px`,
    size,
    opacity: SIZE_TO_OPACITY[size],
    direction: random(id * 43) > 0.5 ? 'left' : 'right',
    speed: CLOUD_SPEEDS[speedIndex],
    delay: Math.round(random(id * 47) * -60)
  };
};