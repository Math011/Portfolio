import { useRef, useEffect, useState } from 'react';

const useVideoScroll = (videoRef) => {
  const lastScrollTimeRef = useRef(0);
  const rafRef = useRef(null);
  const directionRef = useRef(1);
  const progressRef = useRef(0);
  const targetPositionRef = useRef(null);
  const isFastForwardRef = useRef(false);

  const [progress, setProgress] = useState(0);

  const navigateToSection = (targetPosition) => {
    const video = videoRef.current;
    if (!video) return;

    const currentProgress = progressRef.current;
    if (targetPosition === currentProgress) return;

    directionRef.current = targetPosition > currentProgress ? 1 : -1;
    targetPositionRef.current = targetPosition;
    isFastForwardRef.current = true;

    if (video.paused) {
      video.play();
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let animationId;
    let lastVideoTime = 0;

    const handleWheel = (e) => {
      lastScrollTimeRef.current = performance.now();

      isFastForwardRef.current = false;
      targetPositionRef.current = null;

      const direction = e.deltaY > 0 ? 1 : -1;
      directionRef.current = direction;

      const currentProgress = progressRef.current;
      const canMove = (direction > 0 && currentProgress < 100) || 
                      (direction < 0 && currentProgress > 0);

      if (canMove) {
        if (video.paused) {
          video.play();
        }
      } else {
        video.pause();
      }

      if (!rafRef.current) {
        checkScrollStop();
      }
    };

    const checkScrollStop = () => {
      const now = performance.now();

      if (now - lastScrollTimeRef.current > 200) {
        video.pause();
        rafRef.current = null;
        return;
      }

      rafRef.current = requestAnimationFrame(checkScrollStop);
    };

    const updateProgress = () => {
      if (video.duration && !video.paused) {
        const videoTimeDelta = video.currentTime - lastVideoTime;
        
        if (Math.abs(videoTimeDelta) < 0.5) {
          const speedMultiplier = isFastForwardRef.current ? 4 : 1;
          const progressDelta = (videoTimeDelta / video.duration) * 100 * directionRef.current * speedMultiplier;
          
          setProgress(prev => {
            let newProgress = Math.max(0, Math.min(100, prev + progressDelta));
            
            if (isFastForwardRef.current && targetPositionRef.current !== null) {
              const target = targetPositionRef.current;
              const reachedTarget = (directionRef.current > 0 && newProgress >= target) ||
                                    (directionRef.current < 0 && newProgress <= target);
              
              if (reachedTarget) {
                newProgress = target;
                isFastForwardRef.current = false;
                targetPositionRef.current = null;
                video.pause();
              }
            }
            
            progressRef.current = newProgress;
            return newProgress;
          });
        }
      }
      
      lastVideoTime = video.currentTime;
      animationId = requestAnimationFrame(updateProgress);
    };

    animationId = requestAnimationFrame(updateProgress);
    window.addEventListener('wheel', handleWheel, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      cancelAnimationFrame(animationId);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [videoRef]);

  return { progress, navigateToSection };
};

export default useVideoScroll;