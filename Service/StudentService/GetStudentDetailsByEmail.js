import axios from "axios"
import { getBaseUrl } from "../../constants/url/url"

export const GetStudenDetailsByEmail = async (email) => {
    try {
        const studentDetailsByEmail = await axios.get(`${getBaseUrl()}/api/student/byEmail?email=${email}`)
        console.log(studentDetailsByEmail.data)
        return studentDetailsByEmail.data

    } catch (err) {
        console.log(err)

    }

}