// Restaurant data types based on API response

export interface MenuItem {
  category: string;
  image_link: string;
  item_id: string;
  name: string;
  price: number;
}

export interface Order {
  menu_items: MenuItem[];
}

export interface UserReview {
  review: string;
  stars: number;
  user_id: string;
  username: string;
}

export interface VideoLink {
  link: string;
  subtitle: string;
  title: string;
}

export interface Restaurant {
  description: string;
  image_links: string[];
  location: string;
  menu_image_link: string;
  menu_pdf_link: string;
  name: string;
  order: Order;
  phone_number: string;
  restaurant_id: number;
  thumbnail: string;
  total_reviews: number;
  user_reviews: UserReview[];
  video_links: VideoLink[];
}