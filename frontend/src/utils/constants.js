export const CONTRACT_STATUS = {
  CREATED: 'CREATED',
  APPROVED: 'APPROVED',
  SENT: 'SENT',
  SIGNED: 'SIGNED',
  LOCKED: 'LOCKED',
  REVOKED: 'REVOKED'
};

export const STATUS_CONFIG = {
  CREATED: { label: 'Created', color: 'bg-gray-100 text-gray-800' },
  APPROVED: { label: 'Approved', color: 'bg-blue-100 text-blue-800' },
  SENT: { label: 'Sent', color: 'bg-yellow-100 text-yellow-800' },
  SIGNED: { label: 'Signed', color: 'bg-green-100 text-green-800' },
  LOCKED: { label: 'Locked', color: 'bg-purple-100 text-purple-800' },
  REVOKED: { label: 'Revoked', color: 'bg-red-100 text-red-800' }
};

export const DASHBOARD_FILTERS = {
  ALL: 'all',
  ACTIVE: 'active',
  PENDING: 'pending',
  SIGNED: 'signed'
};

// API configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';