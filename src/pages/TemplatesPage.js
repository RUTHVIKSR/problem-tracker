import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import Modal from '../components/Modal';

const TemplatesPage = () => {
  const { state, actions } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedTemplates, setExpandedTemplates] = useState(new Set());
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [editingTemplateIndex, setEditingTemplateIndex] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    code: '',
    status: 'to-do',
    frequency: 0
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
      code: '',
      status: 'to-do',
      frequency: 0
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

  const openStatusModal = (index) => {
    setEditingTemplateIndex(index);
    setStatusModalOpen(true);
  };

  const closeStatusModal = () => {
    setStatusModalOpen(false);
    setEditingTemplateIndex(null);
  };

  const updateStatus = (status) => {
    if (editingTemplateIndex !== null) {
      actions.updateTemplateStatus(editingTemplateIndex, status);
      closeStatusModal();
    }
  };

  const updateFrequency = (index, delta) => {
    actions.updateTemplateFreq(index, delta);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({
      title: '',
      code: '',
      status: 'to-do',
      frequency: 0
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
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            required
          >
            <option value="to-do">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="revise">Revise</option>
            <option value="memorized">Memorized</option>
          </select>
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

      <Modal isOpen={statusModalOpen} onClose={closeStatusModal}>
        <div className="status-modal">
          <h2>Update Template Status</h2>
          <div className="status-options">
            <button 
              type="button" 
              className="status-option to-do"
              onClick={() => updateStatus('to-do')}
            >
              To Do
            </button>
            <button 
              type="button" 
              className="status-option in-progress"
              onClick={() => updateStatus('in-progress')}
            >
              In Progress
            </button>
            <button 
              type="button" 
              className="status-option revise"
              onClick={() => updateStatus('revise')}
            >
              Revise
            </button>
            <button 
              type="button" 
              className="status-option memorized"
              onClick={() => updateStatus('memorized')}
            >
              Memorized
            </button>
          </div>
        </div>
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
              
              <div className="template-info">
                <div className="template-meta">
                  <button
                    className={`template-status ${template.status || 'to-do'} clickable-status`}
                    onClick={() => openStatusModal(index)}
                    title="Click to update status"
                  >
                    {template.status || 'to-do'}
                  </button>
                  <div className="template-frequency">
                    <span className="freq-number">{template.frequency || 0}</span>
                    <div className="freq-controls">
                      <button
                        className="freq-btn freq-decrease"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateFrequency(index, -1);
                        }}
                        title="Decrease frequency"
                      >
                        −
                      </button>
                      <button
                        className="freq-btn freq-increase"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateFrequency(index, 1);
                        }}
                        title="Increase frequency"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {!isExpanded && (
                <div className="template-preview">
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
