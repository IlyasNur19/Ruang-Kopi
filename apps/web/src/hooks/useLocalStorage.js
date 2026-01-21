import { useState, useEffect } from 'react';

/**
 * Hook custom untuk mengelola state yang tersimpan di localStorage
 * Mendukung sinkronisasi antar tab/window
 */
function useLocalStorage(key, initialValue) {
    // Get from local storage then
    // parse stored json or if none return initialValue
    const readValue = () => {
        if (typeof window === 'undefined') {
            return initialValue;
        }

        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    };

    const [storedValue, setStoredValue] = useState(readValue);

    const setValue = (value) => {
        try {
            // Allow value to be a function so we have same API as useState
            const valueToStore = value instanceof Function ? value(storedValue) : value;

            setStoredValue(valueToStore);

            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));

                // Dispatch custom event untuk update real-time di komponen lain
                window.dispatchEvent(new Event('local-storage'));
            }
        } catch (error) {
            console.warn(`Error setting localStorage key "${key}":`, error);
        }
    };

    useEffect(() => {
        const handleStorageChange = () => {
            setStoredValue(readValue());
        };

        // Listen to changes
        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('local-storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('local-storage', handleStorageChange);
        };
    }, []);

    return [storedValue, setValue];
}

export default useLocalStorage;
