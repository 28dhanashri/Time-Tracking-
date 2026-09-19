import React, { useState, useEffect, useCallback } from 'react';
import { FiPlus, FiSearch, FiX } from 'react-icons/fi';
import ActivityCard from '../components/ActivityCard';
import {
  fetchActivities,
  createActivity,
  updateActivity,
  deleteActivity
} from '../services/api';
import { useTimer } from '../hooks/useTimer';
import Toast from '../components/Toast';

const CATEGORIES = ['All', 'Development', 'Education', 'Work', 'Personal', 'Meeting', 'Exercise', 'Other'];

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Development',
    description: ''
  });
  const [formError, setFormError] = useState('');

  // Toast State
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('success');

  const showToast = (msg, type = 'success') => {
    setToastMessage(msg);
    setToastType(type);
  };

  const loadActivities = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchActivities();
      if (res.success) {
        setActivities(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch activities:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const {
    activeSession,
    startTimer: handleStartTimer,
    stopTimer: handleStopTimer
  } = useTimer(loadActivities);

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  const openAddModal = () => {
    setEditingActivity(null);
    setFormData({ name: '', category: 'Development', description: '' });
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (act) => {
    setEditingActivity(act);
    setFormData({
      name: act.name,
      category: act.category,
      description: act.description || ''
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingActivity(null);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('Activity name is required');
      return;
    }

    try {
      if (editingActivity) {
        const res = await updateActivity(editingActivity._id, formData);
        if (res.success) {
          showToast('Activity updated successfully!', 'success');
          loadActivities();
          closeModal();
        }
      } else {
        const res = await createActivity(formData);
        if (res.success) {
          showToast('New activity created successfully!', 'success');
          loadActivities();
          closeModal();
        }
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save activity');
    }
  };

  const handleDeleteActivity = async (id) => {
    if (!window.confirm('Are you sure you want to delete this activity? Linked time sessions will also be removed.')) {
      return;
    }

    try {
      const res = await deleteActivity(id);
      if (res.success) {
        showToast('Activity deleted successfully', 'success');
        loadActivities();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete activity', 'error');
    }
  };

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

  // Filter activities by category & search query
  const filteredActivities = activities.filter((act) => {
    const matchesCategory = selectedCategory === 'All' || act.category === selectedCategory;
    const matchesSearch = act.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          act.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="page-content">
      <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage(null)} />

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">My Activities</h1>
          <p className="page-subtitle">Create and manage the activities you want to track.</p>
        </div>
        <button onClick={openAddModal} className="btn btn-primary">
          <FiPlus size={16} />
          <span>Add Activity</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="card" style={{ marginBottom: '1.75rem', padding: '0.85rem 1.15rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Category Filter Buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-outline'}`}
                style={{ borderRadius: 'var(--radius-full)' }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', width: '240px' }}>
            <FiSearch style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={15} />
            <input
              type="text"
              placeholder="Search activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '2.1rem', height: '36px', fontSize: '0.825rem' }}
            />
          </div>
        </div>
      </div>

      {/* Activities Grid or Empty State */}
      {filteredActivities.length === 0 ? (
        <div className="empty-state card">
          <h4 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.35rem' }}>No activities yet</h4>
          <p style={{ fontSize: '0.85rem', marginBottom: '1.15rem', color: 'var(--text-secondary)' }}>
            {searchQuery || selectedCategory !== 'All'
              ? 'Try clearing search filters or selecting another category.'
              : 'Start by creating your first activity to begin tracking your time.'}
          </p>
          {(!searchQuery && selectedCategory === 'All') && (
            <button onClick={openAddModal} className="btn btn-primary btn-sm">
              <FiPlus size={15} />
              <span>Create Activity</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid-3">
          {filteredActivities.map((act) => (
            <ActivityCard
              key={act._id}
              activity={act}
              activeSession={activeSession}
              onStartTimer={onStartTimer}
              onStopTimer={onStopTimer}
              onEdit={openEditModal}
              onDelete={handleDeleteActivity}
            />
          ))}
        </div>
      )}

      {/* Add / Edit Activity Form Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{editingActivity ? 'Edit Activity' : 'Add New Activity'}</h3>
              <button onClick={closeModal} className="btn btn-outline btn-sm" style={{ padding: '0.25rem' }}>
                <FiX size={18} />
              </button>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="modal-body">
                {formError && (
                  <div
                    style={{
                      padding: '0.55rem 0.75rem',
                      borderRadius: '6px',
                      backgroundColor: 'var(--danger-bg)',
                      color: 'var(--danger)',
                      fontSize: '0.825rem',
                      marginBottom: '1rem'
                    }}
                  >
                    {formError}
                  </div>
                )}

                {/* Activity Name */}
                <div className="form-group">
                  <label className="form-label">Activity Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. React Development"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-control"
                    required
                  />
                </div>

                {/* Category Selection */}
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="form-control"
                  >
                    {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div className="form-group">
                  <label className="form-label">Description (Optional)</label>
                  <textarea
                    placeholder="Brief description of the activity..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={closeModal} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingActivity ? 'Save Changes' : 'Create Activity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Activities;
