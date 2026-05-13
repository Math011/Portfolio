import React from 'react';
import Bird from './Bird';
import { SIZE_TO_CLASS, SPEED_TO_CLASS } from '../utils/generators';
import styles from '../ProjectDetailPage.module.css';

const DecorativeBackground = ({ birds, clouds }) => (
  <>
    {/* Oiseaux décoratifs */}
    <div className={styles.backgroundBirds}>
      {birds.map((bird) => (
        <div
          key={bird.id}
          className={`${styles.flyingBird} ${bird.direction === 'left' ? styles.directionLeft : styles.directionRight}`}
          style={{
            top: bird.top,
            left: bird.left,
            right: bird.right,
            animationDuration: `${bird.duration}s`,
            animationDelay: `${bird.delay}s`,
          }}
        >
          <Bird size={bird.size} direction={bird.direction} />
        </div>
      ))}
    </div>

    {/* Nuages décoratifs */}
    <div className={styles.backgroundClouds}>
      {clouds.map((cloud) => (
        <img
          key={cloud.id}
          src={`/images/${cloud.image}`}
          alt=""
          className={`${styles.bgCloud} ${styles[SIZE_TO_CLASS[cloud.size]]} ${cloud.direction === 'left' ? styles.directionLeft : styles.directionRight} ${styles[SPEED_TO_CLASS[cloud.speed]]}`}
          style={{ top: cloud.top }}
        />
      ))}
    </div>
  </>
);

export default DecorativeBackground;