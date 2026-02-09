'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation'; 
import api from '@/services/api';
import { Car } from '@/types/car';
import { CarCard } from '@/components/CarCard/CarCard';
import { Filters } from '@/components/Filters/Filters';
import { useCarStore } from '@/store/useCarStore';
import css from './CatalogPage.module.css';

export default function CatalogPage() {
  const searchParams = useSearchParams(); 
  const [cars, setCars] = useState<Car[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  const filters = useCarStore((state) => state.filters);
  const resetFilters = useCarStore((state) => state.resetFilters);
  const isInitialResetDone = useRef(false);

  useEffect(() => {
    resetFilters();
    isInitialResetDone.current = true;
  }, [resetFilters, searchParams]); 

  const loadCars = useCallback(async (currentPage: number, isNewSearch = false) => {
    if (!isInitialResetDone.current && isNewSearch) return;

    setIsLoading(true);
    try {
      const { data } = await api.get('/cars', {
        params: {
          page: currentPage,
          limit: 12,
          brand: filters.brand,
        }
      });

      let fetchedCars = Array.isArray(data) ? data : (data.cars || []);
      
      if (filters.price) {
        fetchedCars = fetchedCars.filter((car: Car) => car.rentalPrice <= parseInt(filters.price));
      }
      if (filters.minMileage) {
        fetchedCars = fetchedCars.filter((car: Car) => car.mileage >= parseInt(filters.minMileage));
      }
      if (filters.maxMileage) {
        fetchedCars = fetchedCars.filter((car: Car) => car.mileage <= parseInt(filters.maxMileage));
      }
      
      setCars(prev => isNewSearch ? fetchedCars : [...prev, ...fetchedCars]);
      setHasMore(fetchedCars.length === 12);
    } catch (error) {
      console.error("Помилка завантаження:", error);
      if (isNewSearch) setCars([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    setPage(1);
    loadCars(1, true);
  }, [loadCars]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadCars(nextPage);
  };

  return (
    <div className={css.container}>
      <Filters />
      <section className={css.carGrid}>
        {cars.length > 0 ? (
          cars.map((car, index) => (
            <CarCard key={car.id} car={car} isPriority={index < 4} />
          ))
        ) : (
          !isLoading && <p className={css.empty}>No cars found matching your criteria.</p>
        )}
      </section>
      {isLoading && <div className={css.loader}>Loading cars...</div>}
      {hasMore && !isLoading && cars.length > 0 && (
        <button type="button" className={css.loadMoreBtn} onClick={handleLoadMore}>
          Load more
        </button>
      )}
    </div>
  );
}