import axios from 'axios';
import { getBaseUrl } from '../../constants/url/url';

export const issueBookService = async (payload, token, roll) => {
  try {
    const url = `${getBaseUrl()}/api/admin/issue?roll=${roll}`;
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return {
      success: true,
      data: response.data,
      status: response.status
    };
  } catch (err) {
    console.log("error in admin issuing book service:", err.response.data, "response code is", err.response.status);
    return {
      success: false,
      data: err.response.data,
      status: err.response.status,
      
    };
  }
};