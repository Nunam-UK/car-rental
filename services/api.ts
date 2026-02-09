import axios from 'axios';

const api = axios.create({
  baseURL: 'https://car-rental-api.goit.global',
});

export const fetchCars = async (page: number, limit: number = 12, filters = {}) => {
  const response = await api.get('/cars', {
    params: {
      page,
      limit,
      ...filters,
    },
  });
  return response.data;
};

export const fetchBrands = async () => {
  const response = await api.get('/brands');
  return response.data; 
};

export default api;