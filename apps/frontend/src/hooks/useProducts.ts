import { useQuery } from '@tanstack/react-query';
import { fallbackProducts, type Product } from '../data/products';
import { api } from '../services/api';

async function fetchProducts(): Promise<Product[]> {
  try {
    const { data } = await api.get<{ success: boolean; data: Product[] }>('/products');
    if (data.success && Array.isArray(data.data) && data.data.length > 0) {
      return data.data;
    }
    return fallbackProducts;
  } catch (error) {
    console.warn('API produits indisponible, affichage des donnees locales.', error);
    return fallbackProducts;
  }
}

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    initialData: fallbackProducts,
    staleTime: 60_000,
  });
}
