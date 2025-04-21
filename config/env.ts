// Environment configuration
export const API_BASE_URL = 'https://yumpdum-backend.vercel.app';
export const API_ENDPOINTS = {
  restaurants: '/api/restaurants',
  restaurantById: (id: string | number) => `/api/restaurants/${id}`,
  restaurantReviews: (id: string | number) => `/api/restaurants/${id}/reviews`,
  restaurantMenu: (id: string | number) => `/api/restaurants/${id}/menu`,
  restaurantSearch: (query: string) => `/api/restaurants/search?q=${query}`,
};