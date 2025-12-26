import React from 'react';

export default function StatCard({ label, value, icon, trend, className = '', color = 'blue' }) {
  // Determine gradient/color styles based on prop (default to primary)
  const iconBg = {
    blue: 'bg-primary-50 text-primary-600',
    green: 'bg-success-50 text-success-600',
    red: 'bg-danger-50 text-danger-600',
    purple: 'bg-indigo-50 text-indigo-600',
  }[color] || 'bg-primary-50 text-primary-600';

  return (
    <div
      className={`bg-white border border-secondary-100 rounded-2xl p-5 flex items-start justify-between shadow-card hover:shadow-soft transition-all duration-300 ${className}`}
    >
      <div>
        <p className="text-sm font-medium text-secondary-500">{label}</p>
        <p className="text-2xl font-bold text-secondary-900 mt-2 tracking-tight">{value}</p>
        {trend && (
          <div className="flex items-center mt-2.5">
            <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${trend.startsWith('+') ? 'bg-success-50 text-success-600' : 'bg-danger-50 text-danger-600'}`}>
              {trend}
            </span>
            <span className="text-xs text-secondary-400 ml-2">vs last month</span>
          </div>
        )}
      </div>
      {icon && (
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg}`}>
          {React.cloneElement(icon, { size: 22 })}
        </div>
      )}
    </div>
  );
}
