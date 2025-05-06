import { Box, Button, Text, CircularProgress, SimpleGrid,Image } from '@chakra-ui/react';
import { useState } from "react";
import useMutation from '../hooks/useMutation';
import useQuery from '../hooks/useQuery';


const validFileTypes = ['image/jpg', 'image/jpeg', 'image/png'];
const URL = "/images";

const ErrorText = ({ children, ...props }) => (
  <Text fontSize="lg" color="red.300" {...props}>
    {children}
  </Text>
);

const Posts = () => {
  const [refetch, setRefetch] = useState(0);
  const { mutate: uploadImage, isLoading: uploading, error: uploadError } = useMutation({ url: URL });
  
  const { data: imageUrls = [], isLoading: imagesLoading, error: fetchError } = useQuery(URL, refetch);
  
  const [error, setError] = useState('');

  const handleUpload = e => {
    const file = e.target.files[0];
    // console.log(file);
  
    if (!validFileTypes.find(type => type === file.type)) {
      setError("File Must be in JPG/PNG Format.");
      return;
    }

    const form = new FormData();
    form.append('image', file);

    uploadImage(form);
    
    setTimeout(() => {
      setRefetch(s => s + 1);
    }, 1000);
  };

  function extractS3KeyFromUrl(url) {
    const match = url.match(/amazonaws\.com\/([^?]+)/);
    return match ? match[1] : null;
  }

  const handleDelete = async (key) => {
    try {
      key = extractS3KeyFromUrl(key);
      console.log(key);
      await fetch(`http://localhost:4000/images/${encodeURIComponent(key)}`, {
        method: "DELETE",
        headers: {
    "x-user-id": 'harsh-123'
  }
      });
      setRefetch(s => s + 1); 
    } catch (err) {
      console.error("Delete failed", err);
    }
  };
  

  return (
    <Box mt={6}>
      <input id="imageInput" type="file" hidden onChange={handleUpload} />
      <Button as="label" htmlFor="imageInput" colorScheme="blue" variant="outline" mb={4} cursor="pointer" isLoading={uploading}>
        Upload
      </Button>

      {error && <ErrorText>{error}</ErrorText>}
      {uploadError && <ErrorText>{uploadError}</ErrorText>}

      <Text textAlign="left" mb={4}>
        Posts
      </Text>

      {imagesLoading && (
        <CircularProgress color="gray.600" trackColor="blue.300" size={7} thickness={10} isIndeterminate />
      )}

      {fetchError && (
        <ErrorText textAlign="left">
          Failed to load images
        </ErrorText>
      )}

      {!fetchError && Array.isArray(imageUrls) && imageUrls.length === 0 && (
        <Text textAlign="left" fontSize="lg" color="gray.500">
          No images found
        </Text>
      )}

      <SimpleGrid columns={[1, 2, 3]} spacing={4}>
        {Array.isArray(imageUrls) && imageUrls.length > 0 &&
          imageUrls.map(url => (
            <Box key={url} position="relative">
              <Image src={url} alt="Uploaded file" borderRadius="md" />

              <Button
                size="xs"
                colorScheme="red"
                position="absolute"
                top={2}
                right={2}
                onClick={() => handleDelete(url)}
              >
                Delete
              </Button>

              <Button
                size="xs"
                colorScheme="blue"
                position="absolute"
                top={2}
                left={2}
                onClick={() => window.open(url, '_blank')}
              >
                View
              </Button>
            </Box>
          ))}
      </SimpleGrid>
    </Box>
  );
};

export default Posts;
