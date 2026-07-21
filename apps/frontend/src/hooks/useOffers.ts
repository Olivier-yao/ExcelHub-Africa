import { useQuery } from '@tanstack/react-query';
import { fallbackOffers, type Offer } from '../data/offers';
import { api } from '../services/api';

async function fetchOffers(): Promise<Offer[]> {
  try {
    const { data } = await api.get<{ success: boolean; data: Offer[] }>('/offers');
    if (data.success && Array.isArray(data.data) && data.data.length > 0) {
      return data.data;
    }
    return fallbackOffers;
  } catch (error) {
    console.warn('API offres indisponible, affichage des donnees locales.', error);
    return fallbackOffers;
  }
}

export function useOffers() {
  return useQuery({
    queryKey: ['offers'],
    queryFn: fetchOffers,
    initialData: fallbackOffers,
    staleTime: 60_000,
  });
}

async function fetchOffer(slug: string): Promise<Offer | undefined> {
  try {
    const { data } = await api.get<{ success: boolean; data: Offer }>(`/offers/${slug}`);
    if (data.success && data.data) {
      return data.data;
    }
  } catch (error) {
    console.warn('API offre indisponible, affichage des donnees locales.', error);
  }
  return fallbackOffers.find((offer) => offer.slug === slug);
}

export function useOffer(slug: string | undefined) {
  return useQuery({
    queryKey: ['offer', slug],
    queryFn: () => fetchOffer(slug ?? ''),
    enabled: Boolean(slug),
    placeholderData: () => fallbackOffers.find((offer) => offer.slug === slug),
    staleTime: 60_000,
  });
}
