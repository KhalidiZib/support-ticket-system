import React from 'react';

export default function Table({ columns, data, renderEmpty }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-secondary-200 shadow-sm bg-white">
      <table className="min-w-full text-sm text-left border-collapse">
        <thead className="bg-secondary-50/80 border-b border-secondary-200">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-6 py-4 font-semibold text-secondary-600 uppercase tracking-wider text-xs first:pl-6 last:pr-6"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-secondary-100">
          {(!data || data.length === 0) && (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-12 text-center text-secondary-400"
              >
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="w-12 h-12 bg-secondary-50 rounded-full flex items-center justify-center text-secondary-300 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                  </div>
                  <p className="text-secondary-500 font-medium">{renderEmpty ? renderEmpty() : 'No data found'}</p>
                </div>
              </td>
            </tr>
          )}
          {data &&
            data.map((row) => (
              <tr
                key={row.id || row.key}
                className="hover:bg-primary-50/30 transition-colors duration-150 group"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4 text-secondary-700 whitespace-nowrap first:pl-6 last:pr-6">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
