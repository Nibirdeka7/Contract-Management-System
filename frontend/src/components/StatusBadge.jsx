import { Badge } from './ui/badge';

export const StatusBadge = ({ status }) => {
  const getConfig = (status) => {
    const configs = {
      'CREATED': { label: 'Created', variant: 'outline', className: 'text-blue-600 bg-blue-50 border-blue-200' },
      'APPROVED': { label: 'Approved', variant: 'secondary', className: 'text-green-600 bg-green-50 border-green-200' },
      'SENT': { label: 'Sent', variant: 'warning', className: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
      'SIGNED': { label: 'Signed', variant: 'success', className: 'text-purple-600 bg-purple-50 border-purple-200' },
      'LOCKED': { label: 'Locked', variant: 'default', className: 'text-gray-600 bg-gray-50 border-gray-200' },
      'REVOKED': { label: 'Revoked', variant: 'destructive', className: 'text-red-600 bg-red-50 border-red-200' },
    };
    return configs[status] || { label: status, variant: 'outline', className: '' };
  };

  const config = getConfig(status);

  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
};