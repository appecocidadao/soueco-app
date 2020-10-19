import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://10.0.2.2:3333',
  baseURL: 'http://206.189.194.249',
  // baseURL: 'https://soueco-api.tce.am.gov.br',
});

export default api;
