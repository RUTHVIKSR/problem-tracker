import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';

const PatternsPage = () => {
  const { state, actions } = useApp();
  const [newPattern, setNewPattern] = useState('');

  const handleSubmit = () => {
    const trimmedPattern = newPattern.trim();
    if (trimmedPattern) {
      actions.addPattern(trimmedPattern);
      setNewPattern('');
    }
  };

  const handleDelete = (index) => {
    actions.deletePattern(index);
  };

  return (
    <div className="content-wrapper">
      <div className="page-header">
        <h2>Patterns</h2>
        <div className="add-pattern-inline">
          <input
            type="text"
            value={newPattern}
            onChange={(e) => setNewPattern(e.target.value)}
            placeholder="Enter new pattern name"
            required
          />
          <button type="button" onClick={handleSubmit} className="add-button">
            Add Pattern
          </button>
        </div>
      </div>
      <div className="patterns-list">
        {state.patterns.map((pattern, index) => (
          <div key={index} className="pattern-tag">
            <span>{pattern}</span>
            <button
              className="delete-btn"
              onClick={() => handleDelete(index)}
            >
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatternsPage;
