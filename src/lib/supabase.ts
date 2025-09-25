import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Product {
  id: number;
  name: string;
  price: number;
  original_price?: number;
  image_url?: string;
  rating: number;
  reviews: number;
  category: string;
  description?: string;
  features?: string[];
  specifications?: { [key: string]: string };
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  phone: string;
  name?: string;
  address?: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: string;
  items: any[];
  created_at: string;
  updated_at: string;
}

// Auth functions
export const signInWithPhone = async (phone: string) => {
  const { data, error } = await supabase.auth.signInWithOtp({
    phone: phone,
  });
  return { data, error };
};

export const signInAdmin = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signUpAdmin = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

// Product functions
export const getProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });
  return { data, error };
};

export const createProduct = async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select()
    .single();
  return { data, error };
};

export const updateProduct = async (id: string, product: Partial<Product>) => {
  const { data, error } = await supabase
    .from('products')
    .update(product)
    .eq('id', id)
    .select()
    .single();
  return { data, error };
};

export const deleteProduct = async (id: string) => {
  const { data, error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);
  return { data, error };
};

// File upload function
export const uploadProductImage = async (file: File, productId: string) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${productId}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(fileName, file, {
      upsert: true,
    });

  if (error) return { data: null, error };

  const { data: { publicUrl } } = supabase.storage
    .from('product-images')
    .getPublicUrl(fileName);

  return { data: { path: data.path, publicUrl }, error: null };
};

// User profile functions
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
};

export const updateUserProfile = async (userId: string, profile: Partial<UserProfile>) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(profile)
    .eq('id', userId)
    .select()
    .single();
  return { data, error };
};

// Order functions
export const getOrders = async () => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      user_profiles (
        name,
        phone
      )
    `)
    .order('created_at', { ascending: false });
  return { data, error };
};

export const createOrder = async (order: Omit<Order, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('orders')
    .insert([order])
    .select()
    .single();
  return { data, error };
};