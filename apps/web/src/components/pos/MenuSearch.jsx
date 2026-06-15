import React, { useState, useCallback } from 'react';
import { Search } from 'lucide-react';

const MenuSearch = ({ value, onChange }) => {
    const [local, setLocal] = useState(value || '');

    const debouncedOnChange = useCallback(
        (() => {
            let timer;
            return (val) => {
                clearTimeout(timer);
                timer = setTimeout(() => onChange(val), 300);
            };
        })(),
        [onChange]
    );

    const handleChange = (e) => {
        const val = e.target.value;
        setLocal(val);
        debouncedOnChange(val);
    };

    return (
        <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6D4C41]/50" />
            <input
                type="text"
                value={local}
                onChange={handleChange}
                placeholder="Cari menu..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#3E2723]/15 bg-[#F5F0EB] text-sm focus:outline-none focus:ring-2 focus:ring-[#3E2723]/20 focus:border-[#3E2723]/30 transition-all placeholder:text-[#6D4C41]/50"
            />
            {local && (
                <button
                    onClick={() => {
                        setLocal('');
                        onChange('');
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[#6D4C41]/50 hover:text-[#3E2723]"
                >
                    ×
                </button>
            )}
        </div>
    );
};

export default MenuSearch;
