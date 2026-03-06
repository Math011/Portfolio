import React from 'react';
import { journeySteps } from '../../data/journeySteps';
import './ProgressBar.css';

const ProgressBar = ({ progress, activeSection, onNavigate }) => {
  return (
    <div className="progress-container">
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${progress}%` }}
        />
        
        {journeySteps.map((step) => (
          <div
            key={step.id}
            className="progress-step"
            style={{ left: `${step.position}%` }}
          >
            <div 
              className={`step-icon ${
                progress >= step.position ? 'step-active' : 'step-inactive'
              }`}
              onClick={() => onNavigate(step.position)}
            >
              {step.icon}
            </div>
            <div className="step-label">
              <span 
                className={`label-text ${
                  activeSection === step.id ? 'label-active' : 'label-inactive'
                }`}
                onClick={() => onNavigate(step.position)}
              >
                {step.label}
              </span>
            </div>
          </div>
        ))}
        
        <div className="finish-line">
          <div className="finish-icon">🏁</div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;