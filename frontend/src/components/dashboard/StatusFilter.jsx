import { DASHBOARD_FILTERS } from '../../utils/constants.js';
import { Button } from '../common/Button.jsx';

export const StatusFilter = ({ currentFilter, onFilterChange }) => {
  const filters = [
    { id: DASHBOARD_FILTERS.ALL, label: 'All Contracts' },
    { id: DASHBOARD_FILTERS.ACTIVE, label: 'Active' },
    { id: DASHBOARD_FILTERS.PENDING, label: 'Pending' },
    { id: DASHBOARD_FILTERS.SIGNED, label: 'Signed' }
  ];

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">Filter by:</span>
        <div className="flex flex-wrap gap-2">
          {filters.map(filter => (
            <Button
              key={filter.id}
              variant={currentFilter === filter.id ? 'primary' : 'secondary'}
              onClick={() => onFilterChange(filter.id)}
              className="px-3 py-1.5 text-sm"
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};