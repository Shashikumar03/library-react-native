import axios from "axios"
import { getBaseUrl } from "../../constants/url/url"

const GetStudentById = async () => {
    try {
        const getStudentDetails = await axios.get(`${getBaseUrl}/api/student/14`)
        // console.log(getStudentDetails.data.booksDto)
        return  getStudentDetails.data

    } catch (err) {
        console.log(err.message)
    }
}

// const getStudentAllBooksByStudentId=()=>{

// }

export default GetStudentById;
