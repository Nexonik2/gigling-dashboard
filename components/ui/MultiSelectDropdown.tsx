import React, { useState, useRef, useEffect } from 'react';

interface MultiSelectDropdownProps {
  label: string;
  options: string[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  formatOption?: (val: string) => string;
  getOptionColor?: (val: string) => string; // 1. Added optional color mapping prop
}

export default function MultiSelectDropdown({
  label,
  options,
  selectedValues,
  onChange,
  formatOption = (val) => val,
  getOptionColor
}: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (option: string) => {
    if (selectedValues.includes(option)) {
      onChange(selectedValues.filter(v => v !== option));
    } else {
      onChange([...selectedValues, option]);
    }
  };

  const isAllSelected = selectedValues.length === 0;
  const hasSelection = selectedValues.length > 0;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`bg-app-bg text-text-main text-sm rounded-lg px-4 py-2 border focus:outline-none flex items-center justify-between min-w-[150px] transition-colors ${
          hasSelection 
            ? 'border-interactive hover:opacity-80' 
            : 'border-app-border hover:border-text-muted focus:border-interactive'
        }`}
      >
        <span className="truncate pr-3 font-medium">
          {label}
        </span>
        <span className={`text-text-muted text-xs transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-20 top-full left-0 mt-2 w-56 bg-app-surface border border-app-border rounded-lg shadow-xl overflow-hidden">
          {/* 2. Added flex-col and gap-1 for internal element spacing */}
          <div className="max-h-60 overflow-y-auto py-2 flex flex-col gap-1">
            <label className="flex items-center px-4 py-2 hover:bg-app-bg cursor-pointer transition-colors group rounded-md mx-1">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={() => onChange([])}
                className="mr-3 accent-interactive w-4 h-4 bg-app-bg border-app-border rounded cursor-pointer"
              />
              <span className="text-sm text-text-main font-bold group-hover:text-interactive transition-colors">
                {label}
              </span>
            </label>
            
            <div className="h-px bg-app-border mx-3 my-1 shrink-0"></div>
            
            {options.map((opt) => (
              <label key={opt} className="flex items-center px-4 py-2 hover:bg-app-bg cursor-pointer transition-colors group rounded-md mx-1">
                <input
                  type="checkbox"
                  checked={selectedValues.includes(opt)}
                  onChange={() => toggleOption(opt)}
                  className="mr-3 accent-interactive w-4 h-4 bg-app-bg border-app-border rounded cursor-pointer"
                />
                <span 
                  className="text-sm capitalize transition-colors"
                  style={{ 
                    // 3. Dynamically apply the color if the function is provided
                    color: getOptionColor ? getOptionColor(opt) : 'var(--color-text-muted)',
                    fontWeight: selectedValues.includes(opt) ? '600' : '400'
                  }}
                >
                  {formatOption(opt)}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}