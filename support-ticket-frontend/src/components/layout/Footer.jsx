import React from 'react';

export default function Footer() {
  return (
    <footer className="h-10 px-6 flex items-center justify-between text-xs text-gray-400 bg-white border-t border-gray-100">
      <span>© {new Date().getFullYear()} SupportHub</span>
      <span>AUCA WebTech Project · Support Ticket System</span>
    </footer>
  );
}
