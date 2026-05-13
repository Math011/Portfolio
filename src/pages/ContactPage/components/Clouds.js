import React from 'react';
import styles from '../ContactPage.module.css';

const CLOUDS_CONFIG = [
  { row: 1, images: ['nuage1.svg', 'nuage3.svg', 'nuage5.svg'] },
  { row: 2, images: ['nuage2.svg', 'nuage4.svg', 'nuage1.svg'] },
  { row: 3, images: ['nuage3.svg', 'nuage5.svg', 'nuage2.svg'] },
];

const Clouds = () => (
  <>
    {CLOUDS_CONFIG.map(({ row, images }) => (
      <div key={row} className={styles[`cloudsRow${row}`]}>
        {images.map((img, i) => (
          <img
            key={i}
            src={`/images/${img}`}
            alt=""
            className={styles[`cloudRow${row}`]}
          />
        ))}
      </div>
    ))}
  </>
);

export default Clouds;