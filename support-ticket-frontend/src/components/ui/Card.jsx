import React from 'react';

export default function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-100 ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, actions, className = '' }) {
  return (
    <div
      className={`px-4 py-3 border-b border-gray-100 flex items-center justify-between ${className}`}
    >
      <div>
        <h2 className="text-sm font-semibold text-gray-800">{title}</h2>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center space-x-2">{actions}</div>}
    </div>
  );
}

export function CardBody({ children, className = '' }) {
  return <div className={`px-4 py-4 ${className}`}>{children}</div>;
}
