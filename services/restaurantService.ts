import { API_BASE_URL, API_ENDPOINTS } from '@/config/env';
import { Restaurant } from '@/types/restaurant';

export async function fetchRestaurants(): Promise<Restaurant[]> {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.restaurants}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data as Restaurant[];
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    return [];
  }
}

export async function fetchRestaurantById(id: string | number): Promise<Restaurant | null> {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.restaurantById(id)}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data as Restaurant;
  } catch (error) {
    console.error(`Error fetching restaurant with id ${id}:`, error);
    return null;
  }
}

export async function searchRestaurants(query: string): Promise<Restaurant[]> {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.restaurantSearch(query)}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data as Restaurant[];
  } catch (error) {
    console.error('Error searching restaurants:', error);
    return [];
  }
}