import Image from 'next/image';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchInput({ 
  value, 
  onChange, 
  placeholder = "Recherchez...",
  className = "" 
}: SearchInputProps) {
  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 sm:px-4 py-2 pr-10 rounded-full bg-pure-white placeholder-gray-400 border border-gray-600 focus:border-white focus:outline-none text-deep-black text-sm sm:text-base"
        style={{
          backgroundColor: 'var(--color-pure-white)',
          color: 'var(--color-deep-black)',
          borderColor: 'var(--color-gray-medium)',
          borderWidth: '1px'
        }}
      />
      <div className="absolute right-5 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <Image 
          src="/icons/search.svg" 
          alt="Search" 
          width={14} 
          height={14}
          className="opacity-60"
        />
      </div>
    </div>
  );
} 