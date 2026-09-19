import React, { useState, useEffect, useCallback } from 'react';
import {
  FiClock,
  FiList,
  FiCheckCircle,
  FiTag
} from 'react-icons/fi';
import SummaryCard from '../components/SummaryCard';
import Timer from '../components/Timer';
import CategoryChart from '../components/CategoryChart';
import DailyChart from '../components/DailyChart';
import SessionTable from '../components/SessionTable';
import {
  fetchSummaryReport,
  fetchCategoryReport,
  fetchDailyReport,
  fetchActivities,
  fetchSessions
} from '../services/api';
import { useTimer } from '../hooks/useTimer';
import Toast from '../components/Toast';

const Dashboard = () => {
  const [summaryData, setSummaryData] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [activities, setActivities] = useState([]);
  const [recentSessions, setRecentSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('success');

  const showToast = (msg, type = 'success') => {
    setToastMessage(msg);
    setToastType(type);
  };

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [summaryRes, categoryRes, dailyRes, actRes, sessionRes] = await Promise.all([
        fetchSummaryReport(),
        fetchCategoryReport(),
        fetchDailyReport(7),
        fetchActivities(),
        fetchSessions()
      ]);

      if (summaryRes.success) setSummaryData(summaryRes.data);
      if (categoryRes.success) setCategoryData(categoryRes.data);
      if (dailyRes.success) setDailyData(dailyRes.data);
      if (actRes.success) setActivities(actRes.data);
      if (sessionRes.success) setRecentSessions(sessionRes.data.slice(0, 5));
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const {
    activeSession,
    elapsedSeconds,
    startTimer: handleStartTimer,
    stopTimer: handleStopTimer
  } = useTimer(loadDashboardData);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const onStartTimer = async (activityId) => {
    const res = await handleStartTimer(activityId);
    if (res.success) {
      showToast(res.data?.message || 'Timer started successfully!', 'success');
      loadDashboardData();
    } else {
      showToast(res.message, 'error');
    }
  };

  const onStopTimer = async () => {
    const res = await handleStopTimer();
    if (res.success) {
      showToast(`Timer stopped. Tracked ${res.data?.duration || 0} seconds!`, 'success');
      loadDashboardData();
    } else {
      showToast(res.message, 'error');
    }
  };

  // Greeting based on time of day
  const hour = new Date().getHours();
  const greetingTime = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="page-content">
      <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage(null)} />

      {/* Header Section */}
      <div className="page-header">
        <div>
          <h1 className="page-title">{greetingTime}! Here's your time overview.</h1>
          <p className="page-subtitle">Track your activities and understand how you spend your day.</p>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid-4" style={{ marginBottom: '1.75rem' }}>
        <SummaryCard
          title="Today's Time"
          value={summaryData?.todayTotalHuman || '0m'}
          subtext={`Formatted: ${summaryData?.todayTotalFormatted || '00:00:00'}`}
          icon={FiClock}
          color="#2563EB"
          bg="rgba(37, 99, 235, 0.12)"
        />
        <SummaryCard
          title="Activities"
          value={summaryData?.totalActivities ?? 0}
          subtext="Configured tasks"
          icon={FiList}
          color="#0284C7"
          bg="rgba(2, 132, 199, 0.12)"
        />
        <SummaryCard
          title="Sessions"
          value={summaryData?.totalSessions ?? 0}
          subtext="Completed time logs"
          icon={FiCheckCircle}
          color="#16A34A"
          bg="rgba(22, 163, 74, 0.12)"
        />
        <SummaryCard
          title="Top Category"
          value={summaryData?.mostUsedCategory || 'None'}
          subtext="Highest tracked time"
          icon={FiTag}
          color="#7C3AED"
          bg="rgba(124, 58, 237, 0.12)"
        />
      </div>

      {/* Active Timer Widget */}
      <div style={{ marginBottom: '1.75rem' }}>
        <Timer
          activeSession={activeSession}
          elapsedSeconds={elapsedSeconds}
          activities={activities}
          onStartTimer={onStartTimer}
          onStopTimer={onStopTimer}
        />
      </div>

      {/* Charts Section */}
      <div className="grid-2" style={{ marginBottom: '1.75rem' }}>
        <CategoryChart data={categoryData} />
        <DailyChart data={dailyData} />
      </div>

      {/* Recent Sessions Table */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>Recent Time Sessions</h3>
          <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>Latest 5 entries</span>
        </div>
        <SessionTable sessions={recentSessions} />
      </div>
    </div>
  );
};

export default Dashboard;
