import React from 'react';
import './LoadingScreen.css';

const LoadingScreen = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="loading-road">
          <div className="loading-line"></div>
        </div>
        <p className="loading-text">Chargement...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;