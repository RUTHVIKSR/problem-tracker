import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import Modal from '../components/Modal';

const TemplatesPage = () => {
  const { state, actions } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedTemplates, setExpandedTemplates] = useState(new Set());
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

  const toggleExpanded = (index) => {
    const newExpanded = new Set(expandedTemplates);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedTemplates(newExpanded);
  };

  const copyToClipboard = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      console.log('Code copied to clipboard');
    } catch (err) {
      console.error('Failed to copy code: ', err);
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
    <div className="content-wrapper">
      <div className="page-header">
        <h2>Templates</h2>
        <button className="add-button" onClick={openModal}>
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


      <div className="templates-grid">
        {state.templates.map((template, index) => {
          const isExpanded = expandedTemplates.has(index);
          return (
            <div key={index} className="template-card">
              <div className="template-header">
                <h3 className="template-title">{template.title}</h3>
                <div className="template-actions">
                  <button
                    className="expand-btn"
                    onClick={() => toggleExpanded(index)}
                    title={isExpanded ? 'Hide code' : 'Show code'}
                  >
                    {isExpanded ? '▼' : '▶'}
                  </button>
                  <button
                    className="delete-template-btn"
                    onClick={() => handleDelete(index)}
                    title="Delete template"
                  >
                    ×
                  </button>
                </div>
              </div>
              
              {!isExpanded && (
                <div className="template-preview">
                  <p className="code-preview">
                    {template.code.split('\n')[0].substring(0, 100)}
                    {template.code.length > 100 ? '...' : ''}
                  </p>
                  <button 
                    className="view-code-btn"
                    onClick={() => toggleExpanded(index)}
                  >
                    View Code
                  </button>
                </div>
              )}
              
              {isExpanded && (
                <div className="template-code-section">
                  <div className="code-header">
                    <span className="code-label">Code</span>
                    <button
                      className="copy-code-btn"
                      onClick={() => copyToClipboard(template.code)}
                      title="Copy code to clipboard"
                    >
                      📋 Copy
                    </button>
                  </div>
                  <pre className="code-block">
                    <code>{template.code}</code>
                  </pre>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TemplatesPage;
