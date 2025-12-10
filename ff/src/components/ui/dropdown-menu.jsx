import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const DropdownMenuContext = React.createContext();

const DropdownMenu = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <DropdownMenuContext.Provider value={{ isOpen, setIsOpen }}>
      <div ref={menuRef} className="relative">
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
};

const DropdownMenuTrigger = React.forwardRef(({ children, asChild, ...props }, ref) => {
  const { isOpen, setIsOpen } = React.useContext(DropdownMenuContext);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...props,
      ref,
      onClick: (e) => {
        setIsOpen(!isOpen);
        children.props.onClick?.(e);
      },
      'aria-expanded': isOpen,
      'aria-haspopup': true,
    });
  }

  return (
    <button
      ref={ref}
      {...props}
      onClick={() => setIsOpen(!isOpen)}
      aria-expanded={isOpen}
      aria-haspopup="true"
      className={props.className}
    >
      {children}
    </button>
  );
});

DropdownMenuTrigger.displayName = 'DropdownMenuTrigger';

const DropdownMenuContent = React.forwardRef(({
  children,
  className = '',
  align = 'start',
  ...props
}, ref) => {
  const { isOpen } = React.useContext(DropdownMenuContext);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.15 }}
          className={`absolute z-50 min-w-[8rem] overflow-hidden rounded-md border border-slate-700/50 bg-slate-800/95 backdrop-blur-xl p-1 shadow-lg ${className}`}
          style={{
            [align === 'end' ? 'right' : 'left']: 0,
            top: '100%',
            marginTop: '0.5rem'
          }}
          {...props}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
});

DropdownMenuContent.displayName = 'DropdownMenuContent';

const DropdownMenuItem = React.forwardRef(({
  children,
  className = '',
  onClick,
  ...props
}, ref) => {
  const { setIsOpen } = React.useContext(DropdownMenuContext);

  const handleClick = (e) => {
    setIsOpen(false);
    onClick?.(e);
  };

  return (
    <button
      ref={ref}
      className={`relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-slate-700/50 focus:bg-slate-700/50 text-slate-200 ${className}`}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
});

DropdownMenuItem.displayName = 'DropdownMenuItem';

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
};