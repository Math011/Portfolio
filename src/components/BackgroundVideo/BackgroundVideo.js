import React, { forwardRef } from 'react';
import styles from './BackgroundVideo.module.css';

const BackgroundVideo = forwardRef(({ src }, ref) => {
  return (
    <section className="video-section">
      <video
        ref={ref}
        className={styles.backgroundVideo}
        src={src}
        muted
        loop
      />
    </section>
  );
});

BackgroundVideo.displayName = 'BackgroundVideo';

export default BackgroundVideo;