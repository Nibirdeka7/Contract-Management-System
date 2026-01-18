import { format } from 'date-fns';

/**
 * Format date for display
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date
 */
export const formatDate = (date) => {
  if (!date) return 'N/A';
  try {
    return format(new Date(date), 'MMM dd, yyyy HH:mm');
  } catch (error) {
    return 'Invalid date';
  }
};

/**
 * Format status for display
 * @param {string} status - Contract status
 * @returns {string} Formatted status label
 */
export const formatStatus = (status) => {
  const statusConfig = {
    CREATED: 'Created',
    APPROVED: 'Approved',
    SENT: 'Sent',
    SIGNED: 'Signed',
    LOCKED: 'Locked',
    REVOKED: 'Revoked'
  };
  
  return statusConfig[status] || status;
};

/**
 * Truncate long text
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};