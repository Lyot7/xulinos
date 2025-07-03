import React from 'react'

type SwitcherProps = {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

export const Switcher = ({ label, checked, onChange, className = '' }: SwitcherProps) => {
  const handleCheckboxChange = () => {
    onChange(!checked);
  };

  return (
    <label className={`flex items-center gap-4 cursor-pointer select-none ${className}`}>
      {label && <span className="text-white text-base font-medium">{label}</span>}
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={handleCheckboxChange}
          className="sr-only"
        />
        <div
          className={`box block h-8 w-14 rounded-full transition-colors duration-200 ${
            checked ? 'bg-green-500' : 'bg-gray-400'
          }`}
        ></div>
        <div
          className={`absolute top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white transition-transform duration-200 ${
            checked ? 'translate-x-7' : 'translate-x-1'
          }`}
        ></div>
      </div>
    </label>
  );
};