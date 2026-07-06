import { useState, useEffect, useCallback } from 'react';

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

    }, dependencies);

    return { data, loading, error, refetch, execute };
};

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
