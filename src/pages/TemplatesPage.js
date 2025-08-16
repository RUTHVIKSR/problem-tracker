import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import Modal from '../components/Modal';

const TemplatesPage = () => {
  const { state, actions } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    code: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    actions.addTemplate(formData);
    setFormData({
      title: '',
      code: ''
    });
    setIsModalOpen(false);
  };

  const handleDelete = (index) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      actions.deleteTemplate(index);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({
      title: '',
      code: ''
    });
  };

  return (
    <div>
      <h1>Code Templates</h1>

      <div className="add-problem-container">
        <button className="open-modal-btn" onClick={openModal}>
          Add New Template
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <form className="template-form" onSubmit={handleSubmit}>
          <h2>Add New Template</h2>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Template Title (e.g., Sieve of Eratosthenes)"
            required
          />
          <textarea
            name="code"
            value={formData.code}
            onChange={handleInputChange}
            placeholder="Paste your code here..."
            className="template-code"
          />
          <button type="submit">Save Template</button>
        </form>
      </Modal>

      <h2>Saved Templates</h2>
      <div className="templates-container">
        {state.templates.map((template, index) => (
          <div key={index} className="template-card">
            <h3>
              {template.title}
              <button
                className="delete-btn"
                onClick={() => handleDelete(index)}
              >
                X
              </button>
            </h3>
            <pre>
              <code>{template.code}</code>
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplatesPage;
