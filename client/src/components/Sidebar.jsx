import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FiGrid,
  FiList,
  FiClock,
  FiPieChart,
  FiFileText,
  FiSettings,
  FiX
} from 'react-icons/fi';

const Sidebar = ({ isMobileOpen, onCloseMobile, onOpenSettings }) => {
  const navItems = [
    { path: '/', label: 'Dashboard', icon: FiGrid },
    { path: '/activities', label: 'Activities', icon: FiList },
    { path: '/timer', label: 'Timer', icon: FiClock },
    { path: '/reports', label: 'Reports', icon: FiPieChart },
    { path: '/history', label: 'History', icon: FiFileText }
  ];

  return (
    <>
      {/* Backdrop for Mobile */}
      <div
        className={`sidebar-overlay ${isMobileOpen ? 'open' : ''}`}
        onClick={onCloseMobile}
      />

      <aside
        className={`sidebar-desktop ${isMobileOpen ? 'open' : ''}`}
        style={{
          width: '250px',
          backgroundColor: 'var(--bg-sidebar)',
          borderRight: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          padding: '1.25rem 1rem',
          flexShrink: 0
        }}
      >
        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.25rem 0.5rem 1.5rem 0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF'
              }}
            >
              <FiClock size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.1 }}>
                TimeTrack
              </h2>
              <span style={{ fontSize: '0.725rem', color: 'var(--text-secondary)', display: 'block', marginTop: '2px' }}>
                Personal Time Management
              </span>
            </div>
          </div>

          {/* Close button for Mobile */}
          {isMobileOpen && (
            <button
              onClick={onCloseMobile}
              className="btn btn-outline btn-sm"
              style={{ padding: '0.25rem' }}
            >
              <FiX size={18} />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                  backgroundColor: isActive ? 'var(--primary-bg)' : 'transparent',
                  transition: 'var(--transition-fast)'
                })}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Settings Button */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
          <button
            onClick={() => {
              if (onCloseMobile) onCloseMobile();
              if (onOpenSettings) onOpenSettings();
            }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.65rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: 'var(--text-secondary)',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <FiSettings size={18} />
            <span>Settings</span>
          </button>
        </div>

        {/* Footer info */}
        <div
          style={{
            marginTop: '0.75rem',
            padding: '0.65rem',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--bg-input)',
            fontSize: '0.725rem',
            color: 'var(--text-muted)',
            textAlign: 'center'
          }}
        >
          <p style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>TimeTrack v1.0</p>
          <p style={{ fontSize: '0.7rem' }}>BCA Final Year Project</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
