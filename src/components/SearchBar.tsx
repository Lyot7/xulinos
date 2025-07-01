"use client";

import { ChangeEvent } from "react";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function SearchBar({
  value,
  onChange,
  placeholder = "Rechercher...",
}: SearchBarProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="flex">
      <input
        type="text"
        className="w-80 px-4 py-2 rounded-full border bg-white focus:outline-none text-dark"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
      />
    </div>
  );
}
