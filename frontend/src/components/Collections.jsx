import React, { useState } from 'react';
import './Collections.css';

const Collections = ({ movies }) => {
  const [collections, setCollections] = useState([
    { id: 1, title: 'Summer Favorites', category: 'Mood', count: 12, description: 'Best movies for a sunny day.' },
    { id: 2, title: 'Mind-Bending Sci-Fi', category: 'Genre', count: 8, description: 'Prepare to have your brain melted.' },
    { id: 3, title: 'Classic Noir', category: 'Style', count: 5, description: 'Dark streets and cynical detectives.' },
  ]);

  const [categories] = useState(['All', 'Mood', 'Genre', 'Style', 'Director']);
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredCollections = activeCategory === 'All' 
    ? collections 
    : collections.filter(c => c.category === activeCategory);

  return (
    <div className="collections-page">
      <header className="page-header">
        <div className="header-content">
          <h1 className="page-title">Collections</h1>
          <p className="page-subtitle">Curated lists of cinematic gems.</p>
        </div>
        <button className="create-collection-btn">
          <span>+</span> New Collection
        </button>
      </header>

      <div className="filter-bar">
        {categories.map(cat => (
          <button 
            key={cat} 
            className={`filter-tag ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="collections-grid">
        {filteredCollections.map(collection => (
          <div key={collection.id} className="collection-card">
            <div className="collection-thumb">
              {/* Simplified thumbnails using placeholders or movie posters */}
              <div className="thumb-grid">
                <div className="thumb-item" style={{backgroundImage: `url(${movies[0].poster_path})`}}></div>
                <div className="thumb-item" style={{backgroundImage: `url(${movies[1].poster_path})`}}></div>
                <div className="thumb-item" style={{backgroundImage: `url(${movies[2].poster_path})`}}></div>
              </div>
            </div>
            <div className="collection-info">
              <div className="collection-meta">
                <span className="collection-category">{collection.category}</span>
                <span className="collection-count">{collection.count} films</span>
              </div>
              <h3 className="collection-title">{collection.title}</h3>
              <p className="collection-desc">{collection.description}</p>
              
              <div className="collection-actions">
                <button className="action-btn edit-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                  Edit
                </button>
                <button className="action-btn share-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                    <polyline points="16 6 12 2 8 6"></polyline>
                    <line x1="12" y1="2" x2="12" y2="15"></line>
                  </svg>
                  Share
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Collections;
