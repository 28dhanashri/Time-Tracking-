import React, { useState, useEffect, useCallback } from 'react';
import { FiClock, FiPlay, FiSquare } from 'react-icons/fi';
import Timer from '../components/Timer';
import { fetchActivities } from '../services/api';
import { useTimer } from '../hooks/useTimer';
import Toast from '../components/Toast';
import { formatDurationHuman } from '../utils/timeUtils';

const TimerPage = () => {
  const [activities, setActivities] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('success');

  const showToast = (msg, type = 'success') => {
    setToastMessage(msg);
    setToastType(type);
  };

  const loadActivities = useCallback(async () => {
    try {
      const res = await fetchActivities();
      if (res.success) {
        setActivities(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch activities:', err);
    }
  }, []);

  const {
    activeSession,
    elapsedSeconds,
    startTimer: handleStartTimer,
    stopTimer: handleStopTimer
  } = useTimer(loadActivities);

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  const onStartTimer = async (activityId) => {
    const res = await handleStartTimer(activityId);
    if (res.success) {
      showToast(res.data?.message || 'Timer started!', 'success');
      loadActivities();
    } else {
      showToast(res.message, 'error');
    }
  };

  const onStopTimer = async () => {
    const res = await handleStopTimer();
    if (res.success) {
      showToast(`Timer stopped. Tracked ${res.data?.duration || 0} seconds!`, 'success');
      loadActivities();
    } else {
      showToast(res.message, 'error');
    }
  };

  return (
    <div className="page-content">
      <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage(null)} />

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Stopwatch & Timer</h1>
          <p className="page-subtitle">Track activity duration in real-time with timestamp precision.</p>
        </div>
      </div>

      {/* Large Central Timer */}
      <div style={{ maxWidth: '800px', margin: '0 auto 2.5rem auto' }}>
        <Timer
          activeSession={activeSession}
          elapsedSeconds={elapsedSeconds}
          activities={activities}
          onStartTimer={onStartTimer}
          onStopTimer={onStopTimer}
        />
      </div>

      {/* Quick Launch Activity List */}
      <div className="card">
        <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>Quick Launch Activity Timer</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          Select an activity below to immediately start its session timer.
        </p>

        <div className="grid-3">
          {activities.map((act) => {
            const isRunningThis = activeSession && activeSession.activityId?._id === act._id;
            return (
              <div
                key={act._id}
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isRunningThis ? 'var(--primary-bg)' : 'var(--bg-input)',
                  border: isRunningThis ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <span className={`badge badge-${act.category?.toLowerCase() || 'other'}`} style={{ marginBottom: '0.25rem' }}>
                    {act.category}
                  </span>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>{act.name}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Total: {formatDurationHuman(act.totalTime || 0)}
                  </span>
                </div>

                {isRunningThis ? (
                  <button onClick={onStopTimer} className="btn btn-danger btn-sm">
                    <FiSquare size={14} />
                    <span>Stop</span>
                  </button>
                ) : (
                  <button onClick={() => onStartTimer(act._id)} className="btn btn-primary btn-sm">
                    <FiPlay size={14} />
                    <span>Start</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TimerPage;
