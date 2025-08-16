import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import Modal from '../components/Modal';

const ProblemsPage = () => {
  const { state, actions } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    link: '',
    problemId: '',
    difficulty: '',
    status: 'Complete',
    patterns: [],
    metacognition: '',
    takeaways: '',
    analysis: ''
  });

  // Function to convert link to platform/problem format
  const convertLinkToProblemId = (link) => {
    try {
      const url = new URL(link);
      const hostname = url.hostname.toLowerCase();
      
      if (hostname.includes('leetcode')) {
        // Extract problem slug from LeetCode URL
        const match = link.match(/\/problems\/([^\/\?#]+)/);
        if (match) {
          let problemSlug = match[1];
          // Remove trailing slash and any query parameters
          problemSlug = problemSlug.replace(/\/$/, '').split('?')[0].split('#')[0];
          console.log('LeetCode problem slug extracted:', problemSlug); // Debug log
          return problemSlug;
        }
        // Fallback for different URL patterns
        const pathMatch = url.pathname.match(/\/(\d+)\//);
        if (pathMatch) {
          return `LC${pathMatch[1]}`;
        }
      } else if (hostname.includes('codeforces')) {
        // Extract problem from Codeforces URL
        const match = link.match(/\/problem\/(\w+)/);
        if (match) {
          return `CF${match[1]}`;
        }
      } else if (hostname.includes('atcoder')) {
        // Extract problem from AtCoder URL
        const match = link.match(/\/tasks\/(\w+)/);
        if (match) {
          return `AC${match[1]}`;
        }
      } else if (hostname.includes('codechef')) {
        // Extract problem from CodeChef URL
        const match = link.match(/\/problems\/(\w+)/);
        if (match) {
          return `CC${match[1]}`;
        }
      }
      
      // If no specific platform detected, extract any numbers/letters
      const generalMatch = link.match(/\/(\w+)(?:\/|$)/);
      if (generalMatch) {
        return generalMatch[1].toUpperCase();
      }
      
      return link; // Return original if can't parse
    } catch (error) {
      // If URL parsing fails, try to extract patterns
      const match = link.match(/(\w+)\/(\w+)/);
      if (match) {
        const platform = match[1].toLowerCase();
        const problemId = match[2];
        
        const platformMap = {
          'leetcode': 'LC',
          'codeforces': 'CF',
          'atcoder': 'AC',
          'codechef': 'CC'
        };
        
        const prefix = platformMap[platform] || platform.substring(0, 2).toUpperCase();
        return `${prefix}${problemId}`;
      }
      
      return link;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'link') {
      const problemId = convertLinkToProblemId(value);
      setFormData(prev => ({
        ...prev,
        [name]: value,
        problemId: problemId
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handlePatternsChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({
      ...prev,
      patterns: selectedOptions
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const problemData = {
      ...formData,
      id: formData.problemId // Use the converted problem ID
    };
    actions.addProblem(problemData);
    setFormData({
      link: '',
      problemId: '',
      difficulty: '',
      status: 'Complete',
      patterns: [],
      metacognition: '',
      takeaways: '',
      analysis: ''
    });
    setIsModalOpen(false);
  };

  const handleDelete = (index) => {
    if (window.confirm('Are you sure you want to delete this problem?')) {
      actions.deleteProblem(index);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({
      link: '',
      problemId: '',
      difficulty: '',
      status: 'Complete',
      patterns: [],
      metacognition: '',
      takeaways: '',
      analysis: ''
    });
  };

  // Helper functions for styling tags
  const getDifficultyClass = (difficulty) => {
    const diff = difficulty.toLowerCase();
    if (diff.includes('easy') || diff === 'e') return 'easy';
    if (diff.includes('medium') || diff === 'm') return 'medium';
    if (diff.includes('hard') || diff === 'h') return 'hard';
    
    // For numeric ratings
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
    <>
      <div className="content-wrapper">
        <div className="page-header">
          <h2>Problems</h2>
          <button className="add-button" onClick={openModal}>
            Add New Problem
          </button>
        </div>

        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <form className="problem-form" onSubmit={handleSubmit}>
            <h2>Add a New Problem</h2>
            <div className="form-grid">
              <div className="link-input-container">
                <input
                  type="url"
                  name="link"
                  value={formData.link}
                  onChange={handleInputChange}
                  placeholder="Problem Link (e.g., https://leetcode.com/problems/two-sum/)"
                  required
                />
                {formData.problemId && (
                  <div className="problem-id-preview">
                    Problem ID: <strong>{formData.problemId}</strong>
                  </div>
                )}
              </div>
              <input
                type="text"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
                placeholder="Difficulty (Easy/Medium/Hard or rating)"
              />
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
              >
                <option value="Complete">Complete</option>
                <option value="In Progress">In Progress</option>
                <option value="To Do">To Do</option>
              </select>
              <select
                name="patterns"
                multiple
                value={formData.patterns}
                onChange={handlePatternsChange}
                className="problem-patterns"
              >
                {state.patterns.map((pattern, index) => (
                  <option key={index} value={pattern}>
                    {pattern}
                  </option>
                ))}
              </select>
              <textarea
                name="metacognition"
                value={formData.metacognition}
                onChange={handleInputChange}
                placeholder="Metacognition - What did you think during problem solving?"
                className="large-textarea"
              />
              <textarea
                name="takeaways"
                value={formData.takeaways}
                onChange={handleInputChange}
                placeholder="Takeaways - What did you learn?"
                className="medium-textarea"
              />
              <textarea
                name="analysis"
                value={formData.analysis}
                onChange={handleInputChange}
                placeholder="Analysis - Approach, complexity, alternative solutions"
                className="medium-textarea"
              />
            </div>
            <button type="submit">Add Problem</button>
          </form>
        </Modal>
      </div>

      <div className="problems-table-container">
        <table className="problems-table">
          <thead>
            <tr>
              <th className="problem-col">Problem</th>
              <th className="difficulty-col">Difficulty</th>
              <th className="status-col">Status</th>
              <th className="pattern-col">Pattern</th>
              <th className="metacognition-col">Metacognition</th>
              <th className="takeaway-col">Takeaway</th>
              <th className="analysis-col">Analysis</th>
              <th className="actions-col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {state.problems.map((problem, index) => (
              <tr key={index}>
                <td className="problem-col">
                  <a href={problem.link} target="_blank" rel="noopener noreferrer" className="problem-link">
                    {problem.id}
                  </a>
                </td>
                <td className="difficulty-col">
                  <span className={`difficulty-tag ${getDifficultyClass(problem.difficulty)}`}>
                    {problem.difficulty}
                  </span>
                </td>
                <td className="status-col">
                  <span className={`status-tag ${getStatusClass(problem.status)}`}>
                    {problem.status}
                  </span>
                </td>
                <td className="pattern-col">{problem.patterns.join(', ')}</td>
                <td className="metacognition-col">
                  <div className="cell-content" title={problem.metacognition}>
                    {problem.metacognition}
                  </div>
                </td>
                <td className="takeaway-col">
                  <div className="cell-content" title={problem.takeaways}>
                    {problem.takeaways}
                  </div>
                </td>
                <td className="analysis-col">
                  <div className="cell-content" title={problem.analysis}>
                    {problem.analysis}
                  </div>
                </td>
                <td className="actions-col">
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(index)}
                    title="Delete this problem"
                  >
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ProblemsPage;
