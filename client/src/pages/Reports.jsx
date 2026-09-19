import React, { useState, useEffect } from 'react';
import CategoryChart from '../components/CategoryChart';
import DailyChart from '../components/DailyChart';
import SummaryCard from '../components/SummaryCard';
import { fetchCategoryReport, fetchDailyReport, fetchSummaryReport } from '../services/api';
import { FiPieChart, FiBarChart2, FiAward, FiClock } from 'react-icons/fi';
import { formatDurationHuman, formatSeconds } from '../utils/timeUtils';

const Reports = () => {
  const [summary, setSummary] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [daysRange, setDaysRange] = useState(7);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReports = async () => {
      try {
        setLoading(true);
        const [sumRes, catRes, dailyRes] = await Promise.all([
          fetchSummaryReport(),
          fetchCategoryReport(),
          fetchDailyReport(daysRange)
        ]);

        if (sumRes.success) setSummary(sumRes.data);
        if (catRes.success) setCategoryData(catRes.data);
        if (dailyRes.success) setDailyData(dailyRes.data);
      } catch (err) {
        console.error('Failed to load report analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, [daysRange]);

  return (
    <div className="page-content">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Analytics & Reports</h1>
          <p className="page-subtitle">Category-wise breakdown and daily tracked time metrics.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Period:</span>
          <select
            value={daysRange}
            onChange={(e) => setDaysRange(Number(e.target.value))}
            className="form-control"
            style={{ width: 'auto', padding: '0.4rem 0.75rem' }}
          >
            <option value={7}>Last 7 Days</option>
            <option value={14}>Last 14 Days</option>
            <option value={30}>Last 30 Days</option>
          </select>
        </div>
      </div>

      {/* Summary Highlight Cards */}
      <div className="grid-3" style={{ marginBottom: '2rem' }}>
        <SummaryCard
          title="Overall Total Tracked"
          value={summary?.overallTotalHuman || '0m'}
          subtext={`Formatted: ${summary?.overallTotalFormatted || '00:00:00'}`}
          icon={FiClock}
          color="#6366f1"
          bg="rgba(99, 102, 241, 0.15)"
        />
        <SummaryCard
          title="Top Category"
          value={summary?.mostUsedCategory || 'None'}
          subtext="Most time recorded"
          icon={FiAward}
          color="#a855f7"
          bg="rgba(168, 85, 247, 0.15)"
        />
        <SummaryCard
          title="Completed Sessions"
          value={summary?.totalSessions ?? 0}
          subtext="Recorded time logs"
          icon={FiBarChart2}
          color="#10b981"
          bg="rgba(16, 185, 129, 0.15)"
        />
      </div>

      {/* Charts Row */}
      <div className="grid-2" style={{ marginBottom: '2rem' }}>
        <CategoryChart data={categoryData} />
        <DailyChart data={dailyData} />
      </div>

      {/* Category Breakdown Table */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem' }}>Category Statistics</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '0.85rem 1rem' }}>Category</th>
                <th style={{ padding: '0.85rem 1rem' }}>Tracked Time</th>
                <th style={{ padding: '0.85rem 1rem' }}>Formatted (HH:MM:SS)</th>
                <th style={{ padding: '0.85rem 1rem' }}>Share %</th>
                <th style={{ padding: '0.85rem 1rem' }}>Session Count</th>
              </tr>
            </thead>
            <tbody>
              {categoryData.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No category data available.
                  </td>
                </tr>
              ) : (
                categoryData.map((item) => (
                  <tr key={item.category} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem', fontWeight: 600 }}>
                      <span className={`badge badge-${item.category.toLowerCase()}`}>
                        {item.category}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--primary)' }}>
                      {item.humanDuration}
                    </td>
                    <td style={{ padding: '1rem', fontFamily: 'var(--font-mono)' }}>
                      {item.formattedDuration}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ flex: 1, height: '6px', borderRadius: '3px', backgroundColor: 'var(--bg-input)', overflow: 'hidden' }}>
                          <div style={{ width: `${item.percentage}%`, height: '100%', backgroundColor: 'var(--primary)' }} />
                        </div>
                        <span style={{ fontSize: '0.8rem', minWidth: '40px' }}>{item.percentage}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                      {item.sessionCount} sessions
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
