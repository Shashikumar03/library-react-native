import axios from 'axios';
import { getBaseUrl } from '../../constants/url/url';

export const submitBookService=async(payload,token, roll)=>{
    console.log(payload)
    console.log(roll)
   try{
    url=   `${getBaseUrl()}/api/admin/issue?roll=${roll}`
    const response =await axios.post(url ,payload,{
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },

    })
    console.log("submit response ,",response.data);
    console.log(response.status)
    return response;
 

   }catch(err){
    // console.log("error in admin issuing book service    sss",err.response.data, "response code is ",err.response.status)
    // console.log()
    const msg=err.response.data
    // console.log("msg",err.response.status)
    // alert(msg.message)
    // alert(err.response.status)
    return err;

   }
}