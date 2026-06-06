export type ProductCategory = 'templates' | 'guides' | 'courses' | 'tools';
export type ProductType = 'digital' | 'affiliate';
export type OrderStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  price: number;
  original_price: number | null;
  category_id: string;
  category?: Category;
  type: ProductType;
  images: string[];
  file_url: string | null;
  affiliate_url: string | null;
  tags: string[];
  is_featured: boolean;
  is_active: boolean;
  stock: number | null;
  download_count: number;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
  reviews?: Review[];
  average_rating?: number;
  review_count?: number;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  title: string | null;
  body: string | null;
  is_verified: boolean;
  created_at: string;
  profile?: Profile;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  is_admin: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string | null;
  email: string;
  status: OrderStatus;
  total: number;
  stripe_payment_intent_id: string | null;
  stripe_session_id: string | null;
  coupon_id: string | null;
  discount_amount: number;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
  profile?: Profile;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
  download_url: string | null;
  download_expires_at: string | null;
  product?: Product;
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_amount: number | null;
  max_uses: number | null;
  used_count: number;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CheckoutFormData {
  email: string;
  full_name: string;
  coupon_code?: string;
}

export interface AffiliateProduct {
  id: string;
  name: string;
  description: string;
  category: string;
  affiliate_url: string;
  image_url: string | null;
  price_info: string | null;
  is_recommended: boolean;
  tags: string[];
}

export interface DashboardStats {
  total_revenue: number;
  total_orders: number;
  total_customers: number;
  total_products: number;
  revenue_this_month: number;
  orders_this_month: number;
}
