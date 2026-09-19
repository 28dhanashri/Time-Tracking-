import React, { useState } from 'react';
import { FiClock, FiPlay, FiSquare, FiAlertCircle } from 'react-icons/fi';
import { formatSeconds, formatTime } from '../utils/timeUtils';

const Timer = ({
  activeSession,
  elapsedSeconds,
  activities = [],
  onStartTimer,
  onStopTimer
}) => {
  const [selectedActivityId, setSelectedActivityId] = useState('');

  const handleQuickStart = () => {
    if (!selectedActivityId) return;
    onStartTimer(selectedActivityId);
  };

  return (
    <div
      className="card"
      style={{
        backgroundColor: activeSession ? 'var(--bg-card)' : 'var(--bg-card)',
        border: activeSession ? '1px solid var(--success)' : '1px solid var(--border-color)',
        padding: '1.5rem'
      }}
    >
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FiClock size={18} color={activeSession ? 'var(--success)' : 'var(--text-secondary)'} />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>
            {activeSession ? 'Currently Tracking' : 'Active Timer'}
          </h3>
        </div>

        {activeSession ? (
          <span className="active-pill-green">
            <span className="status-dot status-dot-active" />
            <span>Active Session</span>
          </span>
        ) : (
          <span className="active-pill-idle">
            <span className="status-dot status-dot-idle" />
            <span>Idle</span>
          </span>
        )}
      </div>

      {activeSession ? (
        /* TIMER RUNNING STATE */
        <div style={{ textAlign: 'center', padding: '0.75rem 0' }}>
          <div style={{ marginBottom: '0.5rem' }}>
            <span className={`badge badge-${activeSession.category?.toLowerCase() || 'other'}`}>
              {activeSession.category}
            </span>
          </div>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '0.25rem 0 0.5rem 0', color: 'var(--text-primary)' }}>
            {activeSession.activityId?.name || 'Tracked Activity'}
          </h2>

          {/* Large Timer Display */}
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '3rem',
              fontWeight: 700,
              color: 'var(--primary)',
              letterSpacing: '0.04em',
              margin: '0.5rem 0'
            }}
          >
            {formatSeconds(elapsedSeconds)}
          </div>

          <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            Session started at <strong>{formatTime(activeSession.startTime)}</strong>
          </p>

          <button
            onClick={onStopTimer}
            className="btn btn-danger btn-lg"
            style={{ minWidth: '160px' }}
          >
            <FiSquare size={16} />
            <span>Stop Timer</span>
          </button>
        </div>
      ) : (
        /* TIMER IDLE STATE */
        <div style={{ padding: '0.5rem 0' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            No timer running
          </h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
            Choose an activity to start tracking your time.
          </p>

          <div
            style={{
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'center',
              flexWrap: 'wrap',
              maxWidth: '520px'
            }}
          >
            <select
              value={selectedActivityId}
              onChange={(e) => setSelectedActivityId(e.target.value)}
              className="form-control"
              style={{ flex: 1, minWidth: '220px' }}
            >
              <option value="">-- Select an Activity --</option>
              {activities.map((act) => (
                <option key={act._id} value={act._id}>
                  {act.name} ({act.category})
                </option>
              ))}
            </select>

            <button
              onClick={handleQuickStart}
              disabled={!selectedActivityId}
              className="btn btn-success btn-lg"
            >
              <FiPlay size={16} />
              <span>Start Timer</span>
            </button>
          </div>

          {activities.length === 0 && (
            <p style={{ fontSize: '0.8rem', color: 'var(--warning)', marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <FiAlertCircle size={14} />
              <span>No activities found. Please create an activity first to start tracking time.</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Timer;
