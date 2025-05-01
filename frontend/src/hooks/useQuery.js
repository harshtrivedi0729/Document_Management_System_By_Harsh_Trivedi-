// // useQuery.js
// import axios from 'axios';
// import { useEffect, useState } from 'react';

// const useQuery = (url, refetchTrigger = 0) => {
//   const [data, setData] = useState([]);
//   const [isLoading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchImages = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const res = await axios.get(url, {
//           headers: {
//             'x-user-id': 'demo-user-id' // ⚠️ required header
//           }
//         });
//         setData(res.data.urls || []);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchImages();
//   }, [url, refetchTrigger]);

//   return { data, isLoading, error };
// };

// export default useQuery;







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
    
    // useEffect(() => {
    //     const fetch = async () => {
    //         console.log("Fetch calles");
    //         axiosClient
    //          .get(url, {
    //            headers: {
    //              'x-user-id': 'harsh-123',
    //            }
    //          })
    //          .then(({data}) => setState({ data, isLoading: false, error: '' }))
    //          .catch( error => setState({ data: null, isLoading: false, error: error.message }));
    //      };
        
    //     fetch();
    // }, [url, refetch]);

    return state;
};

export default useQuery;