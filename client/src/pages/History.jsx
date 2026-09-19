import React, { useState, useEffect, useCallback } from 'react';
import { FiFilter, FiSearch, FiCalendar, FiRefreshCw } from 'react-icons/fi';
import SessionTable from '../components/SessionTable';
import { fetchSessions, deleteSession } from '../services/api';
import Toast from '../components/Toast';

const CATEGORIES = ['All', 'Development', 'Education', 'Work', 'Personal', 'Meeting', 'Exercise', 'Other'];

const History = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Toast state
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('success');

  const showToast = (msg, type = 'success') => {
    setToastMessage(msg);
    setToastType(type);
  };

  const loadSessions = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (categoryFilter !== 'All') params.category = categoryFilter;
      if (dateFilter) params.date = dateFilter;

      const res = await fetchSessions(params);
      if (res.success) {
        setSessions(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch session history:', err);
    } finally {
      setLoading(false);
    }
  }, [categoryFilter, dateFilter]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const handleDeleteSession = async (id) => {
    if (!window.confirm('Are you sure you want to delete this session record?')) {
      return;
    }

    try {
      const res = await deleteSession(id);
      if (res.success) {
        showToast('Session record deleted successfully', 'success');
        loadSessions();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete session', 'error');
    }
  };

  const clearFilters = () => {
    setCategoryFilter('All');
    setDateFilter('');
    setSearchQuery('');
  };

  // Filter sessions by search query
  const filteredSessions = sessions.filter((sess) => {
    const actName = sess.activityId?.name || '';
    return actName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="page-content">
      <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage(null)} />

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Time Session History</h1>
          <p className="page-subtitle">View, filter, and manage past time tracking sessions.</p>
        </div>
        <button onClick={loadSessions} className="btn btn-outline">
          <FiRefreshCw size={16} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter Controls Bar */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1.25rem' }}>
        <div className="grid-3" style={{ gap: '1rem', alignItems: 'center' }}>
          {/* Category Filter */}
          <div>
            <label className="form-label" style={{ marginBottom: '0.35rem' }}>
              <FiFilter size={14} style={{ marginRight: '4px' }} /> Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="form-control"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <label className="form-label" style={{ marginBottom: '0.35rem' }}>
              <FiCalendar size={14} style={{ marginRight: '4px' }} /> Date
            </label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="form-control"
            />
          </div>

          {/* Search Input */}
          <div>
            <label className="form-label" style={{ marginBottom: '0.35rem' }}>
              <FiSearch size={14} style={{ marginRight: '4px' }} /> Search Activity
            </label>
            <input
              type="text"
              placeholder="Search by activity name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control"
            />
          </div>
        </div>

        {(categoryFilter !== 'All' || dateFilter || searchQuery) && (
          <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={clearFilters} className="btn btn-outline btn-sm">
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* History Table Card */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.15rem' }}>Session Logs ({filteredSessions.length})</h3>
        </div>
        <SessionTable sessions={filteredSessions} onDeleteSession={handleDeleteSession} />
      </div>
    </div>
  );
};

export default History;
