import { STATUS_CONFIG } from '../../utils/constants.js';

export const StatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
  
  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
};