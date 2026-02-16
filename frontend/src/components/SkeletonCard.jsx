import React from 'react';
import './Skeleton.css';

const SkeletonCard = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton skeleton-image"></div>
      <div className="skeleton-content">
        <div className="skeleton skeleton-text title"></div>
        <div className="skeleton skeleton-text subtitle"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
