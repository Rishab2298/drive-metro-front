// Dropdown Component
import { useState } from 'react';
import { cn } from '@/lib/utils';

export const Dropdown = ({ trigger, children, align = 'right' }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div
            className={cn(
              'absolute z-50 mt-2 w-48 rounded-xl bg-white dark:bg-neutral-900 shadow-lg border border-neutral-200 dark:border-neutral-700 py-1 overflow-hidden',
              align === 'right' ? 'right-0' : 'left-0'
            )}
          >
            {typeof children === 'function' ? children(() => setIsOpen(false)) : children}
          </div>
        </>
      )}
    </div>
  );
};

// Dropdown Item Component
export const DropdownItem = ({ icon: Icon, label, onClick, disabled, iconClassName }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={cn(
      'w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors',
      disabled
        ? 'text-neutral-400 cursor-not-allowed'
        : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800'
    )}
  >
    {Icon && <Icon className={cn("w-4 h-4", iconClassName)} />}
    {label}
  </button>
);

export default Dropdown;
