import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for API calls with loading, error, and data states
 * @param {Function} apiFunction - The API function to call
 * @param {Array} dependencies - Dependencies array for useEffect
 * @param {boolean} immediate - Whether to call immediately on mount
 */
export const useApi = (apiFunction, dependencies = [], immediate = true) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(immediate);
    const [error, setError] = useState(null);

    const execute = useCallback(async (...args) => {
        setLoading(true);
        setError(null);
        try {
            const result = await apiFunction(...args);
            setData(result);
            return result;
        } catch (err) {
            setError(err.message || 'Something went wrong');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [apiFunction]);

    const refetch = useCallback(() => {
        return execute();
    }, [execute]);

    useEffect(() => {
        if (immediate) {
            execute();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, dependencies);

    return { data, loading, error, refetch, execute };
};

/**
 * Hook for mutation operations (POST, PUT, DELETE)
 * Does not execute immediately
 */
export const useMutation = (apiFunction) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const mutate = useCallback(async (...args) => {
        setLoading(true);
        setError(null);
        try {
            const result = await apiFunction(...args);
            setData(result);
            return result;
        } catch (err) {
            setError(err.message || 'Something went wrong');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [apiFunction]);

    const reset = useCallback(() => {
        setLoading(false);
        setError(null);
        setData(null);
    }, []);

    return { mutate, loading, error, data, reset };
};

export default useApi;
