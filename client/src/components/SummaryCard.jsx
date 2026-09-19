import React from 'react';

const SummaryCard = ({ title, value, subtext, icon: Icon, color = 'var(--primary)', bg = 'var(--primary-bg)' }) => {
  return (
    <div
      className="card card-hover"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1.15rem 1.25rem'
      }}
    >
      <div
        style={{
          width: '44px',
          height: '44px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: bg,
          color: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
      >
        {Icon && <Icon size={22} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
          {title}
        </p>
        <h3 style={{ fontSize: '1.45rem', fontWeight: 700, margin: '0.1rem 0', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {value}
        </h3>
        {subtext && (
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {subtext}
          </p>
        )}
      </div>
    </div>
  );
};

export default SummaryCard;
