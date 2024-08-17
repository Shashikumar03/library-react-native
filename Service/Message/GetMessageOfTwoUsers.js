import axios from 'axios';
import { getBaseUrl } from '../../constants/url/url';

const getMessageOfTwoUser=async(senderEmail,receiverEmail)=>{

        try{
            
            const response= await axios.get(`${getBaseUrl()}/api/messages/chat?senderId=${senderEmail}&receiverId=${receiverEmail}`)
            
            return response.data
        }catch(err){
            if (err.response) {
                console.error('Error response:', err.response.data);
                console.error('Status code:', err.response.status);
                console.error('Headers:', err.response.headers);
        
                // You can return or throw the error message from the response
                throw new Error(err.response.data.message || 'An error occurred');
            } else if (err.request) {
                // The request was made but no response was received
                console.error('Error request:', err.request);
                throw new Error('No response received from server');
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Error message:', err.message);
                throw new Error(err.message);
            }
        }
  }
 
  export default getMessageOfTwoUser;