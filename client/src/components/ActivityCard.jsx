import React from 'react';
import { FiPlay, FiSquare, FiEdit2, FiTrash2, FiClock } from 'react-icons/fi';
import { formatDurationHuman } from '../utils/timeUtils';

const ActivityCard = ({
  activity,
  activeSession,
  onStartTimer,
  onStopTimer,
  onEdit,
  onDelete
}) => {
  const isCurrentlyRunning = activeSession && activeSession.activityId?._id === activity._id;
  const categoryLower = activity.category?.toLowerCase() || 'other';

  return (
    <div
      className="card card-hover"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justify: 'space-between',
        borderColor: isCurrentlyRunning ? 'var(--success)' : 'var(--border-color)'
      }}
    >
      <div>
        {/* Top Bar: Category Badge & Total Time */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span className={`badge badge-${categoryLower}`}>
            {activity.category}
          </span>
          <span style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 500 }}>
            <FiClock size={13} />
            {formatDurationHuman(activity.totalTime || 0)}
          </span>
        </div>

        {/* Activity Name & Description */}
        <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
          {activity.name}
        </h3>
        <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', minHeight: '36px', lineHeight: 1.4 }}>
          {activity.description || 'No description provided.'}
        </p>
      </div>

      {/* Action Footer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '1rem',
          paddingTop: '0.75rem',
          borderTop: '1px solid var(--border-color)'
        }}
      >
        {isCurrentlyRunning ? (
          <button
            onClick={onStopTimer}
            className="btn btn-danger btn-sm"
          >
            <FiSquare size={13} />
            <span>Stop</span>
          </button>
        ) : (
          <button
            onClick={() => onStartTimer(activity._id)}
            className="btn btn-primary btn-sm"
          >
            <FiPlay size={13} />
            <span>Start</span>
          </button>
        )}

        <div style={{ display: 'flex', gap: '0.35rem' }}>
          <button
            onClick={() => onEdit(activity)}
            className="btn btn-outline btn-sm"
            title="Edit Activity"
            style={{ padding: '0.35rem 0.5rem' }}
          >
            <FiEdit2 size={13} />
            <span>Edit</span>
          </button>
          <button
            onClick={() => onDelete(activity._id)}
            className="btn btn-outline btn-sm"
            title="Delete Activity"
            style={{ padding: '0.35rem 0.5rem', color: 'var(--danger)' }}
          >
            <FiTrash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;
