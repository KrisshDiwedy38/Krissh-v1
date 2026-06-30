import { useState, useEffect } from 'react';
import api from '../api';

export interface ApiDataState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

export function useApiData<T>(endpoint: string): ApiDataState<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        setError(null);

        api.get(endpoint)
            .then((res) => {
                if (isMounted) {
                    setData(res.data);
                    setLoading(false);
                }
            })
            .catch((err) => {
                if (isMounted) {
                    // error silenced
                    setError(err.response?.data?.error || err.message || 'An error occurred while fetching data.');
                    setLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [endpoint]);

    return { data, loading, error };
}
