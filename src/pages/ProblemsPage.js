import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import Modal from '../components/Modal';

const ProblemsPage = () => {
  const { state, actions } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    difficulty: '',
    status: 'Complete',
    patterns: [],
    metacognition: '',
    takeaways: '',
    analysis: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
    actions.addProblem(formData);
    setFormData({
      id: '',
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
      id: '',
      difficulty: '',
      status: 'Complete',
      patterns: [],
      metacognition: '',
      takeaways: '',
      analysis: ''
    });
  };

  return (
    <div>
      <h1>Competitive Programming Problem Tracker</h1>

      <div className="add-problem-container">
        <button className="open-modal-btn" onClick={openModal}>
          Add New Problem
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <form className="problem-form" onSubmit={handleSubmit}>
          <h2>Add a New Entry</h2>
          <div className="form-grid">
            <input
              type="text"
              name="id"
              value={formData.id}
              onChange={handleInputChange}
              placeholder="Problem (e.g., 1427E)"
              required
            />
            <input
              type="number"
              name="difficulty"
              value={formData.difficulty}
              onChange={handleInputChange}
              placeholder="Difficulty (e.g., 2500)"
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
              placeholder="Metacognition"
            />
            <textarea
              name="takeaways"
              value={formData.takeaways}
              onChange={handleInputChange}
              placeholder="Takeaways"
            />
            <textarea
              name="analysis"
              value={formData.analysis}
              onChange={handleInputChange}
              placeholder="Analysis"
            />
          </div>
          <button type="submit">Add Problem</button>
        </form>
      </Modal>

      <hr />

      <h2>Solved Problems</h2>
      <table className="problems-table">
        <thead>
          <tr>
            <th>Problem</th>
            <th>Difficulty</th>
            <th>Status</th>
            <th>Patterns</th>
            <th>Analysis</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {state.problems.map((problem, index) => (
            <tr key={index}>
              <td>
                <a href={`https://codeforces.com/problem/${problem.id}`} target="_blank" rel="noopener noreferrer">
                  {problem.id}
                </a>
              </td>
              <td>{problem.difficulty}</td>
              <td>{problem.status}</td>
              <td>{problem.patterns.join(', ')}</td>
              <td>{problem.analysis.substring(0, 50)}...</td>
              <td>
                <button
                  className="action-btn delete-problem-btn"
                  onClick={() => handleDelete(index)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProblemsPage;
