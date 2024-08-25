import axios from 'axios';
import { getBaseUrl } from '../../constants/url/url';

// Define the function to create a student
const createStudent = async (studentData) => {
  

  try {

    const response = await axios.post(`${getBaseUrl()}/api/student/`, studentData, {
      headers: {
        'Content-Type': 'application/json',

      }
    });


    console.log('Success:', response.data);

    return {
      success: true,
      data: response?.data,
      status: response?.status
    }

  } catch (error) {
    console.log("error in filling student form", error)
    console.log(error?.response?.data)
    return {
      success: false,
      data: error?.response?.data,
      status: error?.response?.status
    }
  }
};

export default createStudent;
