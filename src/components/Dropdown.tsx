import React, {useState, useRef, useEffect, useMemo, FC} from 'react';
import { SelectOption } from '@lib/types';

interface DropdownProps {
  data: SelectOption[];
  selected?: SelectOption | null;
  onChange?: (option: SelectOption) => void;
  customEl?: FC<SelectOption>;
  isDisabled?: boolean;
  placeholder?: string;
}

const ChevronDownIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-60">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

export const Dropdown: React.FC<DropdownProps> = ({
  data,
  selected,
  onChange,
  customEl,
  isDisabled = false,
  placeholder = "Select an option...",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Focus input when opening
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter(item =>
      item.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const handleSelect = (option: SelectOption) => {
    if (onChange) {
      onChange(option);
    }
    setIsOpen(false);
    setSearchTerm('');
  };

  const toggleDropdown = () => {
    if (!isDisabled) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="relative flex flex-col gap-2" ref={dropdownRef}>
      {/* Trigger Button */}
      <div
        onClick={toggleDropdown}
        className={`
          relative w-full cursor-pointer overflow-hidden
          rounded-lg border border-gray-200 dark:border-slate-700
          bg-white/60 dark:bg-transparent backdrop-blur-md
          transition-all duration-300 ease-out
          active:scale-[0.99]
          group
          ${isDisabled ? 'opacity-50 cursor-not-allowed grayscale' : ''}
        `}
      >
        <div className="relative z-10 flex items-center justify-between px-4 py-2 text-slate-700 dark:text-slate-200">
          <span className={`truncate ${!selected ? 'text-white/50' : ''}`}>
            {selected ? selected.label : placeholder}
          </span>
          <span className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
            <ChevronDownIcon />
          </span>
        </div>
      </div>

      {/* Dropdown Menu */}
      <div
        className={`
          absolute top-full left-0 right-0 mt-2 z-[100]
          flex flex-col
          overflow-hidden rounded-xl border border-slate-200 dark:border-white/20 text-black-1c
          bg-gray-50 dark:bg-slate-800
          origin-top transition-all duration-200 ease-out
          ${isOpen 
            ? 'opacity-100 translate-y-0 scale-100 visible' 
            : 'opacity-0 -translate-y-2 scale-95 invisible pointer-events-none'}
        `}
      >
        {/* Search Bar */}
        <div className="p-2 border-b border-slate-200 dark:border-white/10 bg-white/5">
            <div className="relative flex items-center">
                <div className="absolute left-3  text-black-1c dark:text-white/50">
                    <SearchIcon />
                </div>
                <input
                    ref={inputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search..."
                    className="w-full bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg py-2 pl-9 pr-3 text-sm text-black-1c dark:text-white placeholder-black-1c dark:placeholder-white/30 focus:outline-none focus:ring-1  focus:ring-gray-500 dark:focus:ring-white/30 transition-all"
                    onClick={(e) => e.stopPropagation()}
                />
            </div>
        </div>

        {/* Options List */}
        <div className="glass-scrollbar max-h-60 overflow-y-auto p-1">
          {filteredData.length > 0 ? (
            filteredData.map((option) => {
              const isSelected = selected?.value === option.value;

              if (customEl) return customEl({ ...option, isSelected, onClick: () => handleSelect(option) });

              return (
                <div
                  key={option.value}
                  onClick={() => handleSelect(option)}
                  className={`
                    flex items-center justify-between
                    px-3 py-2.5 cursor-pointer
                    transition-all duration-150
                    text-sm text-black-1c dark:text-white
                    hover:bg-gray-300 dark:hover:bg-white/10
                    ${isSelected ? 'font-bold' : ''}
                  `}
                >
                  <div className="flex items-center gap-2">
                    {option.icon && <span className="opacity-70 group-hover:opacity-100 transition-opacity">{option.icon}</span>}
                    <span>{option.label}</span>
                  </div>
                  {isSelected && <CheckIcon />}
                </div>
              );
            })
          ) : (
            <div className="px-4 py-8 text-center dark:text-white/40 text-sm">
              No results found
            </div>
          )}
        </div>

        {/* Footer info (optional visual flair) */}
        <div className="dark:bg-white/5 px-3 py-1.5 text-[10px] dark:text-white/30 text-right font-mono border-t border-slate-200 dark:border-white/5">
            {filteredData.length} options
        </div>
      </div>
    </div>
  );
};
