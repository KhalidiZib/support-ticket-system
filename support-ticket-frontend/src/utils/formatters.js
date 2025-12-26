import { format } from 'date-fns';

export function formatDate(dateString) {
  if (!dateString) return '-';
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return '-';
  return format(d, 'yyyy-MM-dd HH:mm');
}

export function formatStatus(status) {
  if (!status) return '-';
  return status.replace(/_/g, ' ').toLowerCase().replace(/^\w/, c => c.toUpperCase());
}

export function formatRole(role) {
  if (!role) return '-';
  return role.toLowerCase().replace(/^\w/, c => c.toUpperCase());
}

export function formatPriority(priority) {
  if (!priority) return '-';
  return priority.toLowerCase().replace(/^\w/, c => c.toUpperCase());
}
