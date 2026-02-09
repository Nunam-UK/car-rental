'use client';

import { useEffect, useState, use } from 'react';
import Image from 'next/image';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import api from '@/services/api';
import { Car } from '@/types/car';
import { CheckIcon } from '@/components/icons/CheckIcon';
import { CalendarIcon } from '@/components/icons/CalendarIcon';
import { CarIcon } from '@/components/icons/CarIcon';
import { FuelIcon } from '@/components/icons/FuelIcon';
import { EngineIcon } from '@/components/icons/EngineIcon';
import { LocationIcon } from '@/components/icons/LocationIcon';
import css from './CarPage.module.css';

interface CarPageProps {
  params: Promise<{ id: string }>;
}

export default function CarPage({ params }: CarPageProps) {
  const { id } = use(params);
  const [car, setCar] = useState<Car | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bookingDate, setBookingDate] = useState<Date | null>(null);
  
  // Стан для успішної відправки
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const { data } = await api.get(`/cars/${id}`);
        setCar(data);
      } catch (error) {
        console.error("Error fetching car:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCar();
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Booking request sent for date:", bookingDate);
    setIsSubmitted(true);
    
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  if (isLoading) return <div className={css.loader}>Loading...</div>;
  if (!car) return <div className={css.error}>Car not found.</div>;

  const conditions = typeof car.rentalConditions === 'string' 
    ? car.rentalConditions.split('\n') 
    : (Array.isArray(car.rentalConditions) ? car.rentalConditions : []);

  const addressParts = car.address?.split(',') || [];
  const city = addressParts[1]?.trim() || '';
  const country = addressParts[2]?.trim() || '';

  return (
    <main className={css.container}>
      <div className={css.wrapper}>
        
        {/* ЛІВА КОЛОНКА */}
        <div className={css.leftSide}>
          <div className={css.imageWrapper}>
            <Image 
              src={car.img} 
              alt={`${car.brand} ${car.model}`} 
              fill 
              className={css.image} 
              priority 
            />
          </div>

          <div className={css.formCard}>
            <h3 className={css.formTitle}>Book your car now</h3>
            <p className={css.formText}>Stay connected! We are always ready to help you.</p>
            
            {isSubmitted ? (
              <div className={css.successMessage}>
                <CheckIcon className={css.successIcon} />
                <p>Thank you! Your booking request has been sent successfully.</p>
              </div>
            ) : (
              <form className={css.form} onSubmit={handleSubmit}>
                <input type="text" placeholder="Name*" required className={css.input} />
                <input type="email" placeholder="Email*" required className={css.input} />
                
                <div className={css.datePickerWrapper}>
                  <DatePicker
                    selected={bookingDate}
                    onChange={(date: Date | null) => setBookingDate(date)}
                    placeholderText="Booking date"
                    className={css.input}
                    dateFormat="MMMM d, yyyy"
                    minDate={new Date()}
                    shouldCloseOnSelect={false}
                    calendarStartDay={1}
                    formatWeekDay={(nameOfDay) => nameOfDay.substr(0, 3)}
                    popperPlacement="bottom"
                    showPopperArrow={true}
                  />
                </div>

                <textarea placeholder="Comment" className={css.textarea}></textarea>
                <button type="submit" className={css.submitBtn}>Send</button>
              </form>
            )}
          </div>
        </div>

        {/* ПРАВА КОЛОНКА */}
        <div className={css.rightSide}>
          <div className={css.header}>
            <h1 className={css.title}>
              {car.brand} {car.model}, {car.year} 
              <span className={css.id}>Id: {car.id.toString().slice(0, 4)}</span>
            </h1>
            <p className={css.location}>
              <LocationIcon className={css.locIcon} />
              {city}, {country} &nbsp; Mileage: {car.mileage.toLocaleString('en-US')} km
            </p>
            <p className={css.price}>${car.rentalPrice}</p>
          </div>

          <p className={css.description}>{car.description}</p>

          <section className={css.section}>
            <h4 className={css.sectionLabel}>Rental Conditions:</h4>
            <ul className={css.iconList}>
              {conditions.map((item, i) => (
                <li key={i} className={css.listItem}>
                  <CheckIcon className={css.listIconBlue} /> {item}
                </li>
              ))}
            </ul>
          </section>

          <section className={css.section}>
            <h4 className={css.sectionLabel}>Car Specifications:</h4>
            <ul className={css.specsList}>
              <li className={css.specItem}>
                <CalendarIcon className={css.specIcon} />
                <span className={css.labelGray}>Year:</span> {car.year}
              </li>
              <li className={css.specItem}>
                <CarIcon className={css.specIcon} />
                <span className={css.labelGray}>Type:</span> {car.type}
              </li>
              <li className={css.specItem}>
                <FuelIcon className={css.specIcon} />
                <span className={css.labelGray}>Fuel Consumption:</span> {car.fuelConsumption}
              </li>
              <li className={css.specItem}>
                <EngineIcon className={css.specIcon} />
                <span className={css.labelGray}>Engine Size:</span> {car.engineSize}
              </li>
            </ul>
          </section>

          <section className={css.section}>
            <h4 className={css.sectionLabel}>Accessories and functionalities:</h4>
            <ul className={css.iconList}>
              {[...car.accessories, ...car.functionalities].map((item, i) => (
                <li key={i} className={css.listItem}>
                  <CheckIcon className={css.listIconBlue} /> {item}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}