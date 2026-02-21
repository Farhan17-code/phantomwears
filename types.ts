
export interface ProductVariant {
  color_name: string;
  thumbnail_url: string;
  images: string[];
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image_url: string; // Base image
  category: string;
  variants: ProductVariant[];
  sizes: string[];
  specs?: { label: string; value: string }[];
  material?: string;
  care?: string;
  origin?: string;
  size_and_fit?: string;
  subcategory_id?: string;
  scarcity_status?: string;
}

export interface Category {
  id: string;
  name: string;
  image_url?: string;
  show_on_home?: boolean;
  created_at: string;
}

export interface Subcategory {
  id: string;
  name: string;
  parent_category: string;
  created_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  rating: number;
  fit: number; // 0-100
  size_ordered: string;
  title: string;
  content: string;
  nickname: string;
  email: string;
  height?: string;
  weight?: string;
  photo_url?: string;
  is_verified: boolean;
  helpful_count: number;
  created_at: string;
}

export interface CartItem extends Product {
  cartItemId: string; // Composite key (id-size-color)
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface Message {
  role: 'user' | 'model';
  content: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  value: number;
  is_active: boolean;
  expires_at?: string | null;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price_at_time: number;
  color?: string;
  size?: string;
  product?: Product;
}

export interface Order {
  id: string;
  user_id: string;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  shipping_amount: number;
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  coupon_id?: string;
  created_at: string;
  items?: OrderItem[];
}
