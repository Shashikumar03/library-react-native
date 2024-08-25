import axios from 'axios';
import { getBaseUrl } from '../../constants/url/url';

export const issueAvailableBookService = async (bookId, roll, token) => {
  try {
    const url = `${getBaseUrl()}/api/admin/available-book?bookId=${bookId}&roll=${roll}`;
    
    
    const response = await axios.post(url, null, {
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
    console.log("Error in admin issuing available book service:", err.response.data, "Response code is", err.response.status);
    
    return {
      success: false,
      data: err.response.data,
      status: err.response.status,
    };
  }
};
