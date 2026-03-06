import React, { forwardRef } from 'react';
import './BackgroundVideo.css';

const BackgroundVideo = forwardRef(({ src }, ref) => {
  return (
    <section className="video-section">
      <video
        ref={ref}
        className="background-video"
        src={src}
        muted
        loop
      />
    </section>
  );
});

BackgroundVideo.displayName = 'BackgroundVideo';

export default BackgroundVideo;