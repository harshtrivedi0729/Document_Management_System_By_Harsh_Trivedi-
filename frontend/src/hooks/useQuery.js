import { useEffect, useState } from "react"
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:4000',
});


const useQuery = (url,refetch) => {
    const [state, setState] = useState({
        data: null,
        isLoading: true,
        error: '',

    });

    useEffect(() => {
        const fetch = async () => {
            axiosClient
             .get(url, {
               headers: {
                 'x-user-id': 'harsh-123',
               }
             })
             .then(({data}) => setState({ data, isLoading: false, error: '' }))
             .catch( error => setState({ data: null, isLoading: false, error: error.message }));
         };
        
        fetch();
    }, [url, refetch]);

    return state;
};

export default useQuery;