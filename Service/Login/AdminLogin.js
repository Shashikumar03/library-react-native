import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getBaseUrl } from '../../constants/url/url';

export const Adminlogin = async (email, password, setMessage) => {
    try {
        const payload = {
            "email": email,
            "password": password
        };
        const response = await axios.post(`${getBaseUrl()}/auth/login`, payload);
        console.log("printing response",response.data)
        if (response.data && response.data.jwtToken) {
            const token = response.data.jwtToken;
            await AsyncStorage.setItem('jwt_token', token);
            setMessage('Login successful! from springboot');
        } else {
            setMessage('Login failed. No token received.');
        }
    } catch (error) {
        console.error('Login error:', error);
        if (error.response && error.response.data && error.response.data.message) {
            setMessage(`Login failed: ${error.response.data.message}`);
        } else {
            setMessage('Login failed. Please check your credentials.');
        }
    }
};
