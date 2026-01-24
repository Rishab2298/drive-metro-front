// Sortable Header Component for table columns
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export const SortableHeader = ({ label, sortKey, currentSort, onSort, className = '' }) => {
  const isActive = currentSort.key === sortKey;
  const direction = isActive ? currentSort.direction : null;

  return (
    <button
      onClick={() => onSort(sortKey)}
      className={cn(
        'group flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider transition-colors',
        isActive ? 'text-neutral-900 dark:text-white' : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300',
        className
      )}
    >
      {label}
      <span className={cn(
        'transition-opacity',
        isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
      )}>
        {direction === 'asc' ? (
          <ArrowUp className="w-3 h-3" />
        ) : direction === 'desc' ? (
          <ArrowDown className="w-3 h-3" />
        ) : (
          <ArrowUpDown className="w-3 h-3" />
        )}
      </span>
    </button>
  );
};

export default SortableHeader;
