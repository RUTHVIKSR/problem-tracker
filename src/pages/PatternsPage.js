import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';

const PatternsPage = () => {
  const { state, actions } = useApp();
  const [newPattern, setNewPattern] = useState('');
  const [selectedPattern, setSelectedPattern] = useState(null);

  const handleSubmit = () => {
    const trimmedPattern = newPattern.trim();
    if (trimmedPattern) {
      actions.addPattern(trimmedPattern);
      setNewPattern('');
    }
  };

  const handleDelete = (index) => {
    actions.deletePattern(index);
    // If the deleted pattern was selected, clear selection
    if (selectedPattern === state.patterns[index]) {
      setSelectedPattern(null);
    }
  };

  const handlePatternSelect = (pattern) => {
    setSelectedPattern(pattern);
  };

  const handleCopyPatterns = async () => {
    const patternsList = state.patterns.join('\n');
    try {
      await navigator.clipboard.writeText(patternsList);
      // You could add a toast notification here if desired
      console.log('Patterns copied to clipboard');
    } catch (err) {
      console.error('Failed to copy patterns: ', err);
    }
  };

  // Filter problems by selected pattern
  const filteredProblems = selectedPattern 
    ? state.problems.filter(problem => problem.patterns.includes(selectedPattern))
    : [];

  // Helper functions for styling tags (copied from ProblemsPage)
  const getDifficultyClass = (difficulty) => {
    const diff = difficulty.toLowerCase();
    if (diff.includes('easy') || diff === 'e') return 'easy';
    if (diff.includes('medium') || diff === 'm') return 'medium';
    if (diff.includes('hard') || diff === 'h') return 'hard';
    
    const rating = parseInt(difficulty);
    if (rating <= 1200) return 'easy';
    if (rating <= 1800) return 'medium';
    return 'hard';
  };

  const getStatusClass = (status) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('complete')) return 'complete';
    if (statusLower.includes('progress')) return 'in-progress';
    return 'todo';
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
      
      <div className="patterns-layout">
        <div className="patterns-sidebar">
          <div className="patterns-header">
            <h3>All Patterns</h3>
            <button 
              className="copy-patterns-btn"
              onClick={handleCopyPatterns}
              title="Copy all patterns to clipboard"
            >
              📋
            </button>
          </div>
          <div className="patterns-list">
            {state.patterns.map((pattern, index) => (
              <div 
                key={index} 
                className={`pattern-item ${selectedPattern === pattern ? 'selected' : ''}`}
                onClick={() => handlePatternSelect(pattern)}
              >
                <span className="pattern-name">{pattern}</span>
                <button
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(index);
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="patterns-content">
          {selectedPattern ? (
            <>
              <h3>Problems using "{selectedPattern}"</h3>
              {filteredProblems.length > 0 ? (
                <div className="filtered-problems">
                  {filteredProblems.map((problem, index) => (
                    <div key={index} className="problem-card">
                      <div className="problem-header">
                        <a href={problem.link} target="_blank" rel="noopener noreferrer" className="problem-link">
                          {problem.id}
                        </a>
                        <div className="problem-meta">
                          <span className={`difficulty-tag ${getDifficultyClass(problem.difficulty)}`}>
                            {problem.difficulty}
                          </span>
                          <span className={`status-tag ${getStatusClass(problem.status)}`}>
                            {problem.status}
                          </span>
                        </div>
                      </div>
                      {problem.analysis && (
                        <div className="problem-analysis">
                          <strong>Analysis:</strong> {problem.analysis}
                        </div>
                      )}
                      {problem.takeaways && (
                        <div className="problem-takeaways">
                          <strong>Takeaways:</strong> {problem.takeaways}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-problems">
                  No problems found with this pattern.
                </div>
              )}
            </>
          ) : (
            <div className="no-selection">
              <h3>Select a pattern to view related problems</h3>
              <p>Click on any pattern from the list to see all problems that use that pattern.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatternsPage;
