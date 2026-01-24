// Selection Dropdown Component for quick selection actions
import { useState } from 'react';
import { Check, X, ArrowUp, ArrowDown, Trophy, Minus } from 'lucide-react';

export const SelectionDropdown = ({ onSelect, selectedCount, totalCount }) => {
  const [isOpen, setIsOpen] = useState(false);

  const options = [
    { id: 'all', label: 'All', icon: Check },
    { id: 'none', label: 'None', icon: X },
    { id: 'top10', label: 'Top 10', icon: ArrowUp },
    { id: 'bottom10', label: 'Bottom 10', icon: ArrowDown },
    { id: 'ranked', label: 'All Ranked', icon: Trophy },
    { id: 'unranked', label: 'All Unranked', icon: Minus },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-5 h-5 rounded border-2 border-neutral-300 dark:border-neutral-600 hover:border-neutral-400 dark:hover:border-neutral-500 transition-colors bg-white dark:bg-neutral-800"
      >
        {selectedCount > 0 && selectedCount < totalCount && (
          <Minus className="w-3 h-3 text-neutral-500" />
        )}
        {selectedCount === totalCount && totalCount > 0 && (
          <Check className="w-3 h-3 text-neutral-700 dark:text-neutral-300" />
        )}
      </button>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 top-full mt-2 z-50 w-44 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 py-1.5 overflow-hidden">
            <div className="px-3 py-2 border-b border-neutral-100 dark:border-neutral-800">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Quick Select</span>
            </div>
            {options.map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  onSelect(option.id);
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-left text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                <option.icon className="w-3.5 h-3.5 text-neutral-400" />
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SelectionDropdown;
