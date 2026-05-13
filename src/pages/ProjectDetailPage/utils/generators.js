// =============================================================================
// CONFIGURATION
// =============================================================================

export const CLOUD_IMAGES = ['nuage1.svg', 'nuage2.svg', 'nuage3.svg', 'nuage5.svg'];
export const CLOUD_SIZES = ['small', 'medium', 'large'];

export const SIZE_TO_CLASS = {
  small: 'sizeSmall',
  medium: 'sizeMedium',
  large: 'sizeLarge',
  xlarge: 'sizeXlarge'
};

export const SPEED_TO_CLASS = {
  slow: 'speedSlow',
  normal: 'speedNormal',
  fast: 'speedFast'
};

// =============================================================================
// HELPERS
// =============================================================================

const seededRandom = (seed) => {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
};

// =============================================================================
// GENERATORS
// =============================================================================

export const generateBirds = (totalBirds = 8, maxHeight = 800) => {
  const birds = [];
  
  for (let i = 0; i < totalBirds; i++) {
    const seed = i + 100;
    const isLeft = seededRandom(seed * 7) > 0.5;
    const topPosition = 80 + seededRandom(seed * 3) * maxHeight;
    
    birds.push({
      id: i + 1,
      top: `${topPosition}px`,
      left: isLeft ? '-5%' : undefined,
      right: !isLeft ? '-5%' : undefined,
      size: Math.round(20 + seededRandom(seed * 11) * 16),
      direction: isLeft ? 'right' : 'left',
      duration: Math.round(18 + seededRandom(seed * 13) * 18),
      delay: Math.round(-(seededRandom(seed * 17) * 30)),
    });
  }
  
  return birds;
};

export const generateClouds = (numberOfClouds = 10, maxHeight = 900) => {
  const clouds = [];
  
  for (let i = 0; i < numberOfClouds; i++) {
    const seed = i + 50;
    const imageIndex = Math.floor(seededRandom(seed * 1.5) * CLOUD_IMAGES.length);
    const sizeIndex = Math.floor(seededRandom(seed * 2.5) * CLOUD_SIZES.length);
    const top = 50 + seededRandom(seed * 3) * maxHeight;
    
    clouds.push({
      id: i + 1,
      image: CLOUD_IMAGES[imageIndex],
      top: `${Math.round(top)}px`,
      size: CLOUD_SIZES[sizeIndex],
      direction: seededRandom(seed * 6) > 0.5 ? 'left' : 'right',
      speed: ['slow', 'normal', 'fast'][Math.floor(seededRandom(seed * 4) * 3)]
    });
  }
  
  return clouds;
};