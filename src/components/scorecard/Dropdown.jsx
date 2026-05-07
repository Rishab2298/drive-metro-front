// Dropdown Component
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

export const Dropdown = ({ trigger, children, align = 'right', forceOpen = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState({});
  const triggerRef = useRef(null);
  const effectiveOpen = isOpen || forceOpen;

  useEffect(() => {
    if (!effectiveOpen || !triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const menuWidth = 192; // w-48 = 12rem = 192px
    const menuHeight = 140; // approximate
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - rect.bottom;
    const openUpward = spaceBelow < menuHeight + 8 && rect.top > menuHeight + 8;

    const top = openUpward
      ? rect.top - menuHeight - 8
      : rect.bottom + 8;

    const right = align === 'right'
      ? window.innerWidth - rect.right
      : undefined;
    const left = align === 'left'
      ? rect.left
      : undefined;

    setMenuStyle({ top, right, left, position: 'fixed', width: menuWidth });
  }, [effectiveOpen, align]);

  // Recalculate on scroll/resize
  useEffect(() => {
    if (!effectiveOpen) return;
    const update = () => {
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      const menuWidth = 192;
      const menuHeight = 140;
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom;
      const openUpward = spaceBelow < menuHeight + 8 && rect.top > menuHeight + 8;

      const top = openUpward
        ? rect.top - menuHeight - 8
        : rect.bottom + 8;

      const right = align === 'right' ? window.innerWidth - rect.right : undefined;
      const left = align === 'left' ? rect.left : undefined;

      setMenuStyle({ top, right, left, position: 'fixed', width: menuWidth });
    };

    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [effectiveOpen, align]);

  const menu = effectiveOpen ? (
    <>
      {!forceOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
      <div
        style={menuStyle}
        className={cn(
          'rounded-xl bg-white dark:bg-neutral-900 shadow-lg border border-neutral-200 dark:border-neutral-700 py-1 overflow-hidden',
          forceOpen ? 'z-[200]' : 'z-50'
        )}
      >
        {typeof children === 'function' ? children(() => setIsOpen(false)) : children}
      </div>
    </>
  ) : null;

  return (
    <div className="relative" ref={triggerRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      {createPortal(menu, document.body)}
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
