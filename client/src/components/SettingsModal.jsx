import React, { useState } from 'react';
import { FiX, FiMoon, FiSun, FiUser, FiInfo, FiCheck } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

const SettingsModal = ({ isOpen, onClose }) => {
  const { theme, toggleTheme } = useTheme();
  const [studentName, setStudentName] = useState(
    localStorage.getItem('student-name') || 'Student User'
  );
  const [defaultCategory, setDefaultCategory] = useState(
    localStorage.getItem('default-category') || 'Development'
  );
  const [savedMessage, setSavedMessage] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('student-name', studentName);
    localStorage.setItem('default-category', defaultCategory);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Settings & Preferences
          </h3>
          <button onClick={onClose} className="btn btn-outline btn-sm" style={{ padding: '0.25rem' }}>
            <FiX size={18} />
          </button>
        </div>

        <form onSubmit={handleSave}>
          <div className="modal-body">
            {savedMessage && (
              <div
                style={{
                  padding: '0.5rem 0.75rem',
                  borderRadius: '6px',
                  backgroundColor: 'var(--success-bg)',
                  color: 'var(--success)',
                  fontSize: '0.85rem',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <FiCheck size={16} />
                <span>Settings saved successfully!</span>
              </div>
            )}

            {/* Display Mode */}
            <div className="form-group">
              <label className="form-label">Appearance Theme</label>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.35rem' }}>
                <button
                  type="button"
                  onClick={theme === 'dark' ? toggleTheme : undefined}
                  className={`btn ${theme === 'light' ? 'btn-primary' : 'btn-outline'}`}
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  <FiSun size={16} />
                  <span>Light Mode</span>
                </button>
                <button
                  type="button"
                  onClick={theme === 'light' ? toggleTheme : undefined}
                  className={`btn ${theme === 'dark' ? 'btn-primary' : 'btn-outline'}`}
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  <FiMoon size={16} />
                  <span>Dark Mode</span>
                </button>
              </div>
            </div>

            {/* User Profile Name */}
            <div className="form-group">
              <label className="form-label">User Display Name</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="form-control"
                  placeholder="Enter your name"
                />
              </div>
            </div>

            {/* Default Category Selection */}
            <div className="form-group">
              <label className="form-label">Default Activity Category</label>
              <select
                value={defaultCategory}
                onChange={(e) => setDefaultCategory(e.target.value)}
                className="form-control"
              >
                <option value="Development">Development</option>
                <option value="Education">Education</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Meeting">Meeting</option>
                <option value="Exercise">Exercise</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* About / Project Info */}
            <div
              style={{
                marginTop: '1.25rem',
                padding: '0.85rem',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                <FiInfo size={15} color="var(--primary)" />
                <span>TimeTrack Project Details</span>
              </div>
              <p>BCA 3rd Year Personal Productivity & Time Management Tool.</p>
              <p style={{ marginTop: '0.2rem', color: 'var(--text-muted)' }}>Built with React, Express, Node.js & MongoDB.</p>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-outline">
              Close
            </button>
            <button type="submit" className="btn btn-primary">
              Save Preferences
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsModal;
