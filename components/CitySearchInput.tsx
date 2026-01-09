
import React, { useState, useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';

interface City {
  name: string;
  code: string;
  country: string;
}

const COMMON_CITIES: City[] = [
  { name: 'Goiânia', code: 'GYN', country: 'Brasil' },
  { name: 'Brasília', code: 'BSB', country: 'Brasil' },
  { name: 'São Paulo - Guarulhos', code: 'GRU', country: 'Brasil' },
  { name: 'São Paulo - Congonhas', code: 'CGH', country: 'Brasil' },
  { name: 'Rio de Janeiro - Galeão', code: 'GIG', country: 'Brasil' },
  { name: 'Rio de Janeiro - Santos Dumont', code: 'SDU', country: 'Brasil' },
  { name: 'Belo Horizonte', code: 'CNF', country: 'Brasil' },
  { name: 'Atlanta', code: 'ATL', country: 'EUA' },
  { name: 'Miami', code: 'MIA', country: 'EUA' },
  { name: 'Orlando', code: 'MCO', country: 'EUA' },
  { name: 'New York - JFK', code: 'JFK', country: 'EUA' },
  { name: 'New York - LaGuardia', code: 'LGA', country: 'EUA' },
  { name: 'Doha', code: 'DOH', country: 'Catar' },
  { name: 'Paris', code: 'CDG', country: 'França' },
  { name: 'Londres - Heathrow', code: 'LHR', country: 'Reino Unido' },
  { name: 'Madrid', code: 'MAD', country: 'Espanha' },
  { name: 'Lisboa', code: 'LIS', country: 'Portugal' },
  { name: 'Buenos Aires', code: 'EZE', country: 'Argentina' },
  { name: 'Santiago', code: 'SCL', country: 'Chile' },
  { name: 'Montevidéu', code: 'MVD', country: 'Uruguai' },
  { name: 'Cidade do México', code: 'MEX', country: 'México' },
];

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label?: string;
  className?: string;
  icon?: React.ReactNode;
}

export const CitySearchInput: React.FC<Props> = ({ value, onChange, placeholder, label, className, icon }) => {
  const [suggestions, setSuggestions] = useState<City[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val);
    if (val.length > 1) {
      const filtered = COMMON_CITIES.filter(c => 
        c.name.toLowerCase().includes(val.toLowerCase()) || 
        c.code.toLowerCase().includes(val.toLowerCase())
      );
      setSuggestions(filtered);
      setShowDropdown(true);
    } else {
      setSuggestions([]);
      setShowDropdown(false);
    }
  };

  const selectCity = (city: City) => {
    onChange(`${city.name} (${city.code})`);
    setShowDropdown(false);
  };

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      {label && <label className="block text-xs font-medium text-slate-700 mb-1">{label}</label>}
      <div className="relative">
        {icon || <MapPin className="absolute left-2 top-2 h-4 w-4 text-slate-400" />}
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => value.length > 1 && setShowDropdown(true)}
          placeholder={placeholder}
          className="w-full pl-8 pr-2 py-1.5 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none transition-all"
        />
      </div>

      {showDropdown && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-xl max-h-60 overflow-y-auto">
          {suggestions.map((city, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => selectCity(city)}
              className="w-full text-left px-4 py-2 hover:bg-blue-50 flex items-center justify-between border-b border-slate-50 last:border-0"
            >
              <div>
                <span className="text-sm font-semibold text-slate-700">{city.name}</span>
                <span className="text-xs text-slate-400 ml-2">{city.country}</span>
              </div>
              <span className="text-xs font-mono bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">{city.code}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
