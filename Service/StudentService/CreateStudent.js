import axios from 'axios';

// Define the function to create a student
const createStudent = async (studentData) => {
    console.log(studentData)
    
  try {
    // Replace 'https://your-api-url.com/api/student/' with your actual API endpoint
    const response = await axios.post('http://192.168.0.189:8283/api/student/', studentData, {
      headers: {
        'Content-Type': 'application/json',
        // Add other headers if needed (e.g., Authorization)
      }
    });

    // Handle the successful response
    console.log('Success:', response.data);
    // You can also return response.data or handle it as needed
    return response.data;

  } catch (error) {
    // Handle errors
    if (error.response) {
      // Request made and server responded with a status code outside the range of 2xx
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
    } else if (error.request) {
      // Request was made but no response was received
      console.error('Error request:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
    }
    // You can also return or throw the error as needed
    throw error;
  }
};

export default createStudent;
