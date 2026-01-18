import { useState, useEffect } from 'react';
import { useContractStore } from '../../stores/contractStore.js';
import { Button } from '../common/Button.jsx';
import { STATUS_CONFIG } from '../../utils/constants.js';

export const ContractActions = ({ contract }) => {
  const { updateContractStatus, fetchNextStatuses, nextStatuses, loading } = useContractStore();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [localNextStatuses, setLocalNextStatuses] = useState([]);

  useEffect(() => {
    // Fetch available next statuses when component mounts
    fetchNextStatuses(contract._id);
  }, [contract._id]);

  useEffect(() => {
    setLocalNextStatuses(nextStatuses);
  }, [nextStatuses]);

  const handleStatusChange = async (newStatus) => {
    if (!window.confirm(`Change contract status to ${STATUS_CONFIG[newStatus]?.label || newStatus}?`)) {
      return;
    }

    setIsTransitioning(true);
    try {
      await updateContractStatus(contract._id, newStatus);
      // Refresh next statuses after successful transition
      await fetchNextStatuses(contract._id);
    } catch (error) {
      // Error is handled by store
    } finally {
      setIsTransitioning(false);
    }
  };

  const isImmutable = ['LOCKED', 'REVOKED'].includes(contract.status);

  if (isImmutable) {
    return (
      <span className="text-sm text-gray-500 italic">
        Cannot change status from {contract.status}
      </span>
    );
  }

  if (loading || isTransitioning) {
    return <span className="text-sm text-gray-500">Loading...</span>;
  }

  if (localNextStatuses.length === 0) {
    return <span className="text-sm text-gray-500">No further actions</span>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {localNextStatuses.map(status => {
        const config = STATUS_CONFIG[status];
        const variantMap = {
          'APPROVED': 'primary',
          'SENT': 'warning',
          'SIGNED': 'success',
          'LOCKED': 'secondary',
          'REVOKED': 'danger'
        };

        return (
          <Button
            key={status}
            variant={variantMap[status] || 'secondary'}
            onClick={() => handleStatusChange(status)}
            className="px-3 py-1.5 text-xs"
          >
            Mark as {config?.label || status}
          </Button>
        );
      })}
    </div>
  );
};