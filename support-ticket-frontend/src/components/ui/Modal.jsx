import React from 'react';
import { X } from 'lucide-react';
import Button from './Button';

export default function Modal({
  isOpen,
  title,
  children,
  onClose,
  footer,
  size = 'md',
}) {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
      <div
        className={`w-full ${sizes[size]} bg-white rounded-lg shadow-lg overflow-hidden`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
          <button
            className="text-gray-400 hover:text-gray-600"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-4 py-4">{children}</div>
        <div className="px-4 py-3 border-t flex justify-end space-x-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          {footer}
        </div>
      </div>
    </div>
  );
}
