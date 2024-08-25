import axios from 'axios';
import { getBaseUrl } from '../../constants/url/url';

export const createUser = async (payload) => {
  const url = `${getBaseUrl()}/api/users/create`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      // You can add more headers here if needed, e.g. Authorization
    },
  };

  try {
    const response = await axios.post(url, payload, config);
    console.log('User created successfully for chatting:', response.data);
    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    console.log("error in creating user for chatting ", error?.response?.data?.message)
    return {
      success: false,
      data: error?.response?.data || 'An error occurred',
      status: error?.response?.status || 500,
    };
  }
};
