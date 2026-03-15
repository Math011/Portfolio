import React from 'react';
import styles from './ContactPage.module.css';

// Configuration des arbres par rangée
const TREES_CONFIG = [
  // Rangée 1 - 7 arbres par côté
  { row: 'row1Left1', color: 'orange' },
  { row: 'row1Left2', color: 'vert' },
  { row: 'row1Left3', color: 'orange' },
  { row: 'row1Left4', color: 'vert' },
  { row: 'row1Left5', color: 'orange' },
  { row: 'row1Left6', color: 'vert' },
  { row: 'row1Left7', color: 'orange' },
  { row: 'row1Right1', color: 'vert' },
  { row: 'row1Right2', color: 'orange' },
  { row: 'row1Right3', color: 'vert' },
  { row: 'row1Right4', color: 'orange' },
  { row: 'row1Right5', color: 'vert' },
  { row: 'row1Right6', color: 'orange' },
  { row: 'row1Right7', color: 'vert' },
  // Rangée 2 - 6 arbres par côté
  { row: 'row2Left1', color: 'vert' },
  { row: 'row2Left2', color: 'orange' },
  { row: 'row2Left3', color: 'vert' },
  { row: 'row2Left4', color: 'orange' },
  { row: 'row2Left5', color: 'vert' },
  { row: 'row2Left6', color: 'orange' },
  { row: 'row2Right1', color: 'orange' },
  { row: 'row2Right2', color: 'vert' },
  { row: 'row2Right3', color: 'orange' },
  { row: 'row2Right4', color: 'vert' },
  { row: 'row2Right5', color: 'orange' },
  { row: 'row2Right6', color: 'vert' },
  // Rangée 3
  { row: 'row3Left1', color: 'orange' },
  { row: 'row3Left2', color: 'vert' },
  { row: 'row3Right1', color: 'vert' },
  { row: 'row3Right2', color: 'orange' },
  { row: 'row3Right3', color: 'vert' },
  { row: 'row3Right4', color: 'orange' },
  // Rangée 4
  { row: 'row4Left1', color: 'vert' },
  { row: 'row4Right1', color: 'orange' },
];

const Trees = () => (
  <>
    {TREES_CONFIG.map(({ row, color }) => (
      <img
        key={row}
        src={`/images/arbre-${color}.svg`}
        alt=""
        className={`${styles.tree} ${styles[row]}`}
      />
    ))}
  </>
);

export default Trees;