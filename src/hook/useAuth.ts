/* eslint-disable react-hooks/rules-of-hooks */
import axios from 'axios';
import useSWR, { mutate } from 'swr';

const fetcher = (url: string) => axios.get(url).then(res => res.data)

export const useAuth = () => {
    const { data, error, isLoading } = useSWR('/api/user/', url => fetch(url).then(res => res.json()), {
        refreshInterval: 30000,
    });

    return {
        data: error || !data ? [] : data,
        isLoading,
    };
};




