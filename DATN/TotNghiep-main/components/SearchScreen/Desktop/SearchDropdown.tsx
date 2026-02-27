'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import SearchSuggestionItem from './SearchSuggestionItem';

interface StoredSearch {
  id: string;
  name: string;
  searched: boolean;
}

interface SearchDropdownProps {
  searchText: string;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (value: string) => void;
  recentSearches: StoredSearch[];
}

const SearchDropdown: React.FC<SearchDropdownProps> = ({
  searchText,
  isOpen,
  onClose,
  onSelect,
  recentSearches,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredData = searchText.trim()
    ? recentSearches.filter(s =>
        s.name.toLowerCase().includes(searchText.toLowerCase())
      )
    : recentSearches;

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full left-0 right-0 z-50 bg-white mt-2 rounded-lg shadow-lg max-h-[400px] overflow-y-auto"
    >
      <div className="flex flex-col py-2 px-4">
        {filteredData.map(item => (
          <div key={item.id} onClick={() => onSelect(item.name)}>
            <SearchSuggestionItem item={item} />
          </div>
        ))}
      </div>

    </div>
  );
};

export default SearchDropdown;
