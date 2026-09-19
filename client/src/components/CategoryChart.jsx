import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { formatDurationHuman } from '../utils/timeUtils';

const CATEGORY_COLORS = {
  Development: '#2563EB',
  Education: '#0284C7',
  Work: '#7C3AED',
  Personal: '#DB2777',
  Meeting: '#D97706',
  Exercise: '#16A34A',
  Other: '#64748B'
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '6px',
          padding: '8px 12px',
          boxShadow: 'var(--card-shadow)',
          fontSize: '0.85rem'
        }}
      >
        <p style={{ fontWeight: 600, color: data.fill }}>{data.category}</p>
        <p style={{ color: 'var(--text-primary)' }}>Tracked: {formatDurationHuman(data.duration)}</p>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.775rem' }}>Share: {data.percentage}%</p>
      </div>
    );
  }
  return null;
};

const CategoryChart = ({ data = [] }) => {
  const chartData = data.filter((item) => item.duration > 0);

  if (chartData.length === 0) {
    return (
      <div className="card" style={{ height: '340px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.5rem', alignSelf: 'flex-start' }}>Category Breakdown</h3>
        <div style={{ color: 'var(--text-secondary)', textAlign: 'center', margin: 'auto' }}>
          <p style={{ fontSize: '0.875rem' }}>No session data recorded yet.</p>
          <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>Start a timer to see category distribution.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card" style={{ height: '340px', display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.5rem' }}>Category Breakdown</h3>
      <div style={{ flex: 1, width: '100%', minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="48%"
              innerRadius={50}
              outerRadius={85}
              paddingAngle={3}
              dataKey="duration"
              nameKey="category"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={CATEGORY_COLORS[entry.category] || CATEGORY_COLORS.Other}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={32}
              formatter={(value) => <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CategoryChart;
