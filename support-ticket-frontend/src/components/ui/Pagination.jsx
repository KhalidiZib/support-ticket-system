import React from 'react';
import Button from './Button';

export default function Pagination({
  page,
  size,
  totalElements,
  onPageChange,
  onSizeChange,
}) {
  const totalPages =
    totalElements != null ? Math.max(1, Math.ceil(totalElements / size)) : 1;

  const canPrev = page > 0;
  const canNext = page < totalPages - 1;

  return (
    <div className="flex items-center justify-between mt-4">
      <div className="text-xs text-gray-500">
        Page <span className="font-semibold">{page + 1}</span> of{' '}
        <span className="font-semibold">{totalPages}</span>
        {totalElements != null && (
          <>
            {' '}
            · <span className="font-semibold">{totalElements}</span> results
          </>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <select
          value={size}
          onChange={(e) => onSizeChange(Number(e.target.value))}
          className="border border-gray-300 rounded-md text-xs px-2 py-1"
        >
          {[5, 10, 20, 50].map((opt) => (
            <option key={opt} value={opt}>
              {opt} / page
            </option>
          ))}
        </select>

        <Button
          variant="outline"
          size="sm"
          disabled={!canPrev}
          onClick={() => canPrev && onPageChange(page - 1)}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={!canNext}
          onClick={() => canNext && onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
