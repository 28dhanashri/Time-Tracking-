import React from 'react';
import { FiClock, FiTrash2, FiCalendar } from 'react-icons/fi';
import { formatDate, formatTime, formatDurationHuman, formatSeconds } from '../utils/timeUtils';

const SessionTable = ({ sessions = [], onDeleteSession }) => {
  if (sessions.length === 0) {
    return (
      <div className="empty-state">
        <FiClock className="empty-icon" />
        <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>No time sessions yet</h4>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Start a timer and your completed sessions will appear here.
        </p>
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          textAlign: 'left',
          fontSize: '0.875rem'
        }}
      >
        <thead>
          <tr
            style={{
              borderBottom: '1px solid var(--border-color)',
              color: 'var(--text-secondary)',
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              backgroundColor: 'var(--bg-input)'
            }}
          >
            <th style={{ padding: '0.75rem 1rem' }}>Activity</th>
            <th style={{ padding: '0.75rem 1rem' }}>Category</th>
            <th style={{ padding: '0.75rem 1rem' }}>Start Time</th>
            <th style={{ padding: '0.75rem 1rem' }}>End Time</th>
            <th style={{ padding: '0.75rem 1rem' }}>Duration</th>
            <th style={{ padding: '0.75rem 1rem' }}>Date</th>
            {onDeleteSession && <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {sessions.map((session) => {
            const categoryLower = session.category?.toLowerCase() || 'other';
            const activityName = session.activityId?.name || 'Deleted Activity';

            return (
              <tr
                key={session._id}
                style={{
                  borderBottom: '1px solid var(--border-color)'
                }}
              >
                {/* Activity Name */}
                <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {activityName}
                </td>

                {/* Category Badge */}
                <td style={{ padding: '0.85rem 1rem' }}>
                  <span className={`badge badge-${categoryLower}`}>
                    {session.category}
                  </span>
                </td>

                {/* Start Time */}
                <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}>
                  {formatTime(session.startTime)}
                </td>

                {/* End Time */}
                <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}>
                  {formatTime(session.endTime)}
                </td>

                {/* Duration */}
                <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
                  {formatDurationHuman(session.duration)}
                </td>

                {/* Date */}
                <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <FiCalendar size={13} color="var(--text-muted)" />
                    <span>{formatDate(session.date || session.startTime)}</span>
                  </div>
                </td>

                {/* Delete Action */}
                {onDeleteSession && (
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                    <button
                      onClick={() => onDeleteSession(session._id)}
                      className="btn btn-outline btn-sm"
                      title="Delete Session"
                      style={{ padding: '0.3rem 0.4rem', color: 'var(--danger)' }}
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default SessionTable;
