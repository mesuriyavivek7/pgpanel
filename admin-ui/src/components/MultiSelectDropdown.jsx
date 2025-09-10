import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

const MultiSelectDropdown = ({ options, selected, onChange, placeholder = "Select options" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Toggle option by value
  const toggleOption = (option) => {
    if (selected.includes(option.value)) {
      onChange(selected.filter((val) => val !== option.value));
    } else {
      onChange([...selected, option.value]);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get labels of selected values
  const selectedLabels = options
    .filter((opt) => selected.includes(opt.value))
    .map((opt) => opt.label);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Dropdown button */}
      <div
        className="flex items-center justify-between border border-neutral-300  rounded-lg px-3 py-2 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-sm text-gray-700 truncate">
          {selectedLabels.length > 0 ? selectedLabels.join(", ") : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute mt-2 w-full bg-white border rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => toggleOption(option)}
              className={`flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                selected.includes(option.value) ? "bg-gray-50" : ""
              }`}
            >
              <Check
                className={`w-4 h-4 mr-2 ${
                  selected.includes(option.value) ? "opacity-100 text-blue-600" : "opacity-0"
                }`}
              />
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
