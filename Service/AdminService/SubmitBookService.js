import axios from 'axios';
import { getBaseUrl } from '../../constants/url/url';

const submitBookService = async (bookId, roll, token) => {
    const url = `${getBaseUrl()}/api/admin/submit/book`;

    try {
        const response = await axios.post(url, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            params: {
                bookId: bookId,
                roll: roll,
            },
        }
        );
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

export default submitBookService;
