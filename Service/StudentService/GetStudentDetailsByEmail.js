import axios from "axios";
import { getBaseUrl } from "../../constants/url/url";

export const GetStudenDetailsByEmail = async (email) => {
    try {
        const response = await axios.get(`${getBaseUrl()}/api/student/byEmail?email=${email}`);
        console.log(response.data);
        return {
            success: true,
            data: response.data,
            status: response.status
        };
    } catch (err) {
        // console.log("service error:", err.response?.data?.message || err.message);
        return {
            success: false,
            data: err.response?.data || null,
            status: err.response?.status || 500 // Default to 500 if status is not available
        };
    }
};
