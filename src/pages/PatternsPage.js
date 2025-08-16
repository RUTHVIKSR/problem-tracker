import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';

const PatternsPage = () => {
  const { state, actions } = useApp();
  const [newPattern, setNewPattern] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
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
    <div>
      <h1>Manage Patterns</h1>

      <form className="add-pattern-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={newPattern}
          onChange={(e) => setNewPattern(e.target.value)}
          placeholder="Enter new pattern name (e.g., Dynamic Programming)"
          required
        />
        <button type="submit">Add Pattern</button>
      </form>

      <h2>Existing Patterns</h2>
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
