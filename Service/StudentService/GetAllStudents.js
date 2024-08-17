import axios from 'axios';
import { getBaseUrl } from '../../constants/url/url';

 const GetAllStudents=async()=>{

    try{
       const response= await axios.get(`${getBaseUrl()}/api/student/all`)
       console.log(response.data)
       return response.data
    }catch(err){
        console.log(err)
        console.log(err.message)
    }
 }

 export default GetAllStudents;