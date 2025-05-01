// // useMutation.js
// import axios from 'axios';
// import { useState } from 'react';

// const useMutation = ({ url }) => {
//   const [isLoading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const mutate = async (body) => {
//     setLoading(true);
//     setError(null);
//     try {
//       await axios.post(url, body, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           'x-user-id': 'demo-user-id' // ⚠️ required header
//         }
//       });
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { mutate, isLoading, error };
// };

// export default useMutation;




import { useState } from "react";
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:4000', 
});

const useMutation = ({url, method = "POST"}) => {
    // const toast = useState()
    const [state, setState] = useState({
        isLoading: false,
        error: '',
    });

    const fn = async (data) => {
        setState(prev => ({
            ...prev, isLoading: true,
        }));
    
        axiosClient({
          url,
          method,
          data,
          headers: {
            'x-user-id': 'harsh-123', 
            'Content-Type': 'multipart/form-data',
          },
        }).then(() => {
            setState({ isLoading: false, error: ''});
            // toast({
            //     title: 'Successfully Added Image',
            //     status: 'success',
            //     duration: 2000,
            //     position: 'top',
            // })
        }).catch((error) => {
            setState({isLoading: false, error: error.message});
        });
    };
    return {mutate: fn, ...state};
};

export default useMutation;