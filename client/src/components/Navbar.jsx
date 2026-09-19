import React from 'react';
import { FiSun, FiMoon, FiUser, FiMenu, FiClock } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import { formatSeconds } from '../utils/timeUtils';

const Navbar = ({ activeSession, elapsedSeconds, onToggleMobileSidebar, onOpenSettings }) => {
  const { theme, toggleTheme } = useTheme();

  // Format date as: Friday, September 18, 2026
  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const studentName = localStorage.getItem('student-name') || 'Student';

  return (
    <header
      style={{
        height: '64px',
        backgroundColor: 'var(--bg-navbar)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.5rem',
        position: 'sticky',
        top: 0,
        zIndex: 90
      }}
    >
      {/* Left Side: Mobile Menu Button + Today's Date & Timer Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={onToggleMobileSidebar}
          className="btn btn-outline btn-sm"
          style={{ padding: '0.4rem', display: 'flex' }}
          title="Toggle Navigation Menu"
        >
          <FiMenu size={18} />
        </button>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            {formattedDate}
          </span>
          <div style={{ fontSize: '0.775rem', marginTop: '1px' }}>
            {activeSession ? (
              <span className="active-pill-green">
                <span className="status-dot status-dot-active" />
                <span>
                  Tracking: <strong>{activeSession.activityId?.name || 'Activity'}</strong> ({formatSeconds(elapsedSeconds)})
                </span>
              </span>
            ) : (
              <span style={{ color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <span className="status-dot status-dot-idle" />
                <span>No timer running</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right Side: Theme Toggle & User Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="btn btn-outline"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          style={{ padding: '0.45rem', borderRadius: '50%', width: '36px', height: '36px' }}
        >
          {theme === 'dark' ? (
            <FiSun size={17} color="#F59E0B" />
          ) : (
            <FiMoon size={17} color="#2563EB" />
          )}
        </button>

        {/* User Profile Avatar */}
        <div
          onClick={onOpenSettings}
          title="Click to open settings"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.3rem 0.65rem',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--bg-input)',
            border: '1px solid var(--border-color)',
            cursor: 'pointer'
          }}
        >
          <div
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.8rem',
              fontWeight: 600
            }}
          >
            <FiUser size={14} />
          </div>
          <span style={{ fontSize: '0.825rem', fontWeight: 500, color: 'var(--text-primary)' }}>
            {studentName}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
