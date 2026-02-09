
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CarFilters {
  brand: string;
  price: string;
  minMileage: string;
  maxMileage: string;
}

interface CarState {
  favorites: string[];
  filters: CarFilters;
  toggleFavorite: (carId: string) => void;
  setFilters: (newFilters: Partial<CarFilters>) => void;
  resetFilters: () => void;
}

export const useCarStore = create<CarState>()(
  persist(
    (set) => ({
      favorites: [],
      filters: {
        brand: '',
        price: '',
        minMileage: '',
        maxMileage: '',
      },
      toggleFavorite: (carId) =>
        set((state) => ({
          favorites: state.favorites.includes(carId)
            ? state.favorites.filter((id) => id !== carId)
            : [...state.favorites, carId],
        })),
      setFilters: (newFilters) => 
        set((state) => ({ 
          filters: { ...state.filters, ...newFilters } 
        })),
      resetFilters: () => set({ 
        filters: { brand: '', price: '', minMileage: '', maxMileage: '' } 
      }),
    }),
    { 
      name: 'favorites-storage',
      partialize: (state) => ({ favorites: state.favorites }),
    }
  )
);