
'use client';

import Image from 'next/image';
import Link from 'next/link'; 
import { Heart } from 'lucide-react';
import { Car } from '@/types/car';
import { useCarStore } from '@/store/useCarStore';
import css from './CarCard.module.css';

interface Props {
  car: Car;
  isPriority?: boolean;
}

export const CarCard = ({ car, isPriority = false }: Props) => {
  const { favorites, toggleFavorite } = useCarStore();
  const isFavorite = favorites.includes(car.id);

  const formatMileage = (num: number) => 
    num.toLocaleString('en-US').replace(/,/g, ' ');

  const addressParts = car.address?.split(',') || [];
  const city = addressParts[1]?.trim() || '';
  const country = addressParts[2]?.trim() || '';

  return (
    <article className={css.card}>
      <div className={css.imageWrapper}>
        <Image 
          src={car.img} 
          alt={`${car.brand} ${car.model}`} 
          fill
          sizes="(max-width: 768px) 100vw, 274px"
          className={css.image}
          priority={isPriority} 
        />
        
        <button 
          className={css.favoriteBtn} 
          onClick={() => toggleFavorite(car.id)}
          type="button"
        >
          <Heart 
            className={css.heartIcon} 
            fill={isFavorite ? "#3470ff" : "transparent"} 
            stroke={isFavorite ? "#3470ff" : "#ffffff"} 
          />
        </button>
      </div>

      <div className={css.content}>
        <div className={css.mainInfo}>
          <h3 className={css.title}>
            {car.brand} <span className={css.accent}>{car.model}</span>, {car.year}
          </h3>
          <span className={css.price}>${car.rentalPrice}</span>
        </div>

        <div className={css.detailsList}>
          <span>{city}</span>
          <span>{country}</span>
          <span>{car.rentalCompany}</span>
          <div className={css.lineBreak} />
          <span>{car.type}</span>
          <span>{formatMileage(car.mileage)} km</span>
        </div>
      </div>
      <Link href={`/catalog/${car.id}`} className={css.readMoreBtn}>
        Read more
      </Link>
    </article>
  );
};