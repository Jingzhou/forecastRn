import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Axios = axios.create({
  timeout: 120000,
  baseURL: 'your baseURL',
});

Axios.interceptors.request.use(async config => {
  // header 中添加 token
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `${token}`;
  }
  return config;
});

Axios.interceptors.response.use(
  response => {
    if (response.data.code !== '0') {
      return Promise.reject(response.data);
    }
    return response.data;
  },
  error => {
    console.log('error', error);
    return Promise.reject(error);
  },
);

export const $http = Axios;
