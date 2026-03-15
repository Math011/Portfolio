import React from 'react';
import styles from './ProjectDetailPage.module.css';

const ProjectGallery = ({ gallery, selectedImage, setSelectedImage, projectTitle, t }) => (
  <div className={styles.projectGallery}>
    <h3>{t('projectGallery')}</h3>
    <div className={styles.galleryThumbnails}>
      {gallery.map((img, index) => (
        <button
          key={index}
          className={`${styles.thumbnail} ${selectedImage === index ? styles.active : ''}`}
          onClick={() => setSelectedImage(index)}
          aria-label={`${projectTitle} - image ${index + 1}`}
          aria-pressed={selectedImage === index}
        >
          <img 
            src={img} 
            alt={`${projectTitle} - ${index + 1}`}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/150x100/FFEA93/4A3728?text=Image';
            }}
          />
        </button>
      ))}
    </div>
  </div>
);

export default ProjectGallery;