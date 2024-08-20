import AsyncStorage from '@react-native-async-storage/async-storage';

export const getAdminToken = async () => {
  try {
    const token = await AsyncStorage.getItem('jwt_token');
    if (token !== null) {
      // Token found, return it
      return token;
    } else {
      // No token found, handle accordingly
      return null;
    }
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
};
