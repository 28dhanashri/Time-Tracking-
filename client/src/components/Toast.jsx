import React, { useEffect } from 'react';
import { FiCheckCircle, FiAlertCircle, FiX } from 'react-icons/fi';

const Toast = ({ message, type = 'success', onClose, duration = 4000 }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        if (onClose) onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!message) return null;

  const isSuccess = type === 'success';

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 18px',
        borderRadius: '12px',
        backgroundColor: isSuccess ? 'var(--success-bg)' : 'var(--danger-bg)',
        color: isSuccess ? 'var(--success)' : 'var(--danger)',
        border: `1px solid ${isSuccess ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
        boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
        fontWeight: 500,
        fontSize: '0.9rem',
        animation: 'slideUp 0.3s ease-out'
      }}
    >
      {isSuccess ? <FiCheckCircle size={20} /> : <FiAlertCircle size={20} />}
      <span>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: 'inherit',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          padding: '2px',
          marginLeft: '8px'
        }}
      >
        <FiX size={16} />
      </button>
    </div>
  );
};

export default Toast;
