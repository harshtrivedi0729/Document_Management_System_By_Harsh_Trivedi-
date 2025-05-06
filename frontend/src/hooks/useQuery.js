import { useEffect, useState } from "react"
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:4000',
});


const useQuery = (url,refetch) => {
  const [state, setState] = useState({
     data: null,
     isLoading: true,
     error: ''
  });

  useEffect(() => {
      const fetchData = async () => {
          console.log("Fetch called");
          try {
              const response = await axiosClient.get(url, {
                  headers: {
                      'x-user-id': 'harsh-123',
                  }
              });
              console.log('x-user-id:', response.headers['x-user-id']);

              console.log("Full response:", response);
              setState({ data: response.data.urls, isLoading: false, error: '' });
          } catch (error) {
              console.error("Fetch error:", error.message);
              setState({ data: null, isLoading: false, error: error.message });
          }
      };
    
        fetchData();
  }, [url, refetch]);

    return state;
};

export default useQuery;