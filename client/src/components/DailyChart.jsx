import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { formatDurationHuman } from '../utils/timeUtils';

const CustomBarTooltip = ({ active, payload }) => {
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
        <p style={{ fontWeight: 600, color: 'var(--primary)' }}>{data.dayName} ({data.date})</p>
        <p style={{ color: 'var(--text-primary)' }}>Tracked: {formatDurationHuman(data.duration)}</p>
      </div>
    );
  }
  return null;
};

const DailyChart = ({ data = [] }) => {
  return (
    <div className="card" style={{ height: '340px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>Daily Activity</h3>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Last 7 Days</span>
      </div>
      <div style={{ flex: 1, width: '100%', minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
            <XAxis
              dataKey="dayName"
              stroke="var(--text-muted)"
              fontSize={12}
              tickLine={false}
            />
            <YAxis
              stroke="var(--text-muted)"
              fontSize={12}
              tickLine={false}
              unit="h"
            />
            <Tooltip content={<CustomBarTooltip />} />
            <Bar
              dataKey="hours"
              fill="var(--primary)"
              radius={[4, 4, 0, 0]}
              barSize={24}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DailyChart;
