import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchActiveSession, startTimer, stopTimer } from '../services/api';
import { calculateElapsedTime } from '../utils/timeUtils';

export const useTimer = (onTimerStopped) => {
  const [activeSession, setActiveSession] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const intervalRef = useRef(null);

  // Fetch active running timer session from backend
  const syncActiveSession = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchActiveSession();
      if (res.success && res.data) {
        setActiveSession(res.data);
        setElapsedSeconds(calculateElapsedTime(res.data.startTime));
      } else {
        setActiveSession(null);
        setElapsedSeconds(0);
      }
    } catch (err) {
      console.error('Failed to sync active timer:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Timer ticker effect: calculate duration using timestamp offset every second
  useEffect(() => {
    if (activeSession && activeSession.startTime) {
      // Calculate immediately
      setElapsedSeconds(calculateElapsedTime(activeSession.startTime));

      intervalRef.current = setInterval(() => {
        setElapsedSeconds(calculateElapsedTime(activeSession.startTime));
      }, 1000);
    } else {
      setElapsedSeconds(0);
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [activeSession]);

  // Initial load sync
  useEffect(() => {
    syncActiveSession();
  }, [syncActiveSession]);

  // Start timer action
  const handleStartTimer = async (activityId) => {
    try {
      setError(null);
      const res = await startTimer(activityId);
      if (res.success) {
        setActiveSession(res.data);
        setElapsedSeconds(0);
        return { success: true, data: res.data };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to start timer';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  // Stop timer action
  const handleStopTimer = async () => {
    try {
      setError(null);
      const sessionId = activeSession?._id;
      const res = await stopTimer(sessionId);
      if (res.success) {
        setActiveSession(null);
        setElapsedSeconds(0);
        if (onTimerStopped) onTimerStopped();
        return { success: true, data: res.data };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to stop timer';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  return {
    activeSession,
    elapsedSeconds,
    isRunning: !!activeSession,
    loading,
    error,
    setError,
    startTimer: handleStartTimer,
    stopTimer: handleStopTimer,
    syncActiveSession
  };
};
