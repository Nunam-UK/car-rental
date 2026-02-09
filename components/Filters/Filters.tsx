
'use client';

import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useCarStore } from '@/store/useCarStore';
import { fetchBrands } from '@/services/api';
import css from './Filters.module.css';

const formatDisplayValue = (value: string) => {
  if (!value) return '';
  return Number(value).toLocaleString('en-US');
};

export const Filters = () => {
  const { setFilters, filters } = useCarStore();
  
  const [brands, setBrands] = useState<string[]>([]);
  const [prices, setPrices] = useState<number[]>([]);
  const [isOpen, setIsOpen] = useState({ brand: false, price: false });
  const [localFilters, setLocalFilters] = useState({ 
    brand: '', 
    price: '', 
    min: '', 
    max: '' 
  });

  useEffect(() => {
    const isDifferent = 
      localFilters.brand !== filters.brand || 
      localFilters.price !== filters.price ||
      localFilters.min !== filters.minMileage ||
      localFilters.max !== filters.maxMileage;

    if (isDifferent) {
      setLocalFilters({
        brand: filters.brand,
        price: filters.price,
        min: filters.minMileage,
        max: filters.maxMileage
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  useEffect(() => {
    const getMetadata = async () => {
      try {
        const brandsData = await fetchBrands();
        setBrands(brandsData);
        const priceOptions = Array.from({ length: 13 }, (_, i) => (i + 3) * 10);
        setPrices(priceOptions);
      } catch (error) {
        console.error("Failed to load filters data:", error);
      }
    };
    getMetadata();
  }, []);

  const handleSearch = () => {
    setFilters({
      brand: localFilters.brand,
      price: localFilters.price,
      minMileage: localFilters.min,
      maxMileage: localFilters.max
    });
  };

  const selectOption = (type: 'brand' | 'price', value: string) => {
    setLocalFilters(prev => ({ ...prev, [type]: value }));
    setIsOpen(prev => ({ ...prev, [type]: false }));
  };

  return (
    <div className={css.form}>
      <div className={css.field}>
        <label className={css.label}>Car brand</label>
        <div className={css.selectWrapper}>
          <div className={css.selectBrand} onClick={() => setIsOpen({ ...isOpen, brand: !isOpen.brand })}>
            <span>{localFilters.brand || "Choose a brand"}</span>
            <ChevronDown className={`${css.chevron} ${isOpen.brand ? css.isOpen : ''}`} size={20} />
          </div>
          {isOpen.brand && (
            <ul className={`${css.optionsList} ${css.brandsList}`}>
              {brands.map(b => (
                <li key={b} className={css.optionItem} onClick={() => selectOption('brand', b)}>{b}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className={css.field}>
        <label className={css.label}>Price / 1 hour</label>
        <div className={css.selectWrapper}>
          <div className={css.selectPrice} onClick={() => setIsOpen({ ...isOpen, price: !isOpen.price })}>
            <span>{localFilters.price ? `To ${localFilters.price}$` : "Choose a price"}</span>
            <ChevronDown className={`${css.chevron} ${isOpen.price ? css.isOpen : ''}`} size={20} />
          </div>
          {isOpen.price && (
            <ul className={`${css.optionsList} ${css.priceList}`}>
              {prices.map(p => (
                <li key={p} className={css.optionItem} onClick={() => selectOption('price', p.toString())}>{p}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className={css.field}>
        <label className={css.label}>Car mileage / km</label>
        <div className={css.mileageInputs}>
          <div className={css.inputWrapper}>
            <span className={css.inputPrefix}>From</span>
            <input
              className={css.inputFrom}
              type="text"
              value={formatDisplayValue(localFilters.min)}
              onChange={e => setLocalFilters({...localFilters, min: e.target.value.replace(/\D/g, '')})}
            />
          </div>
          <div className={css.inputWrapper}>
            <span className={css.inputPrefix}>To</span>
            <input
              className={css.inputTo}
              type="text"
              value={formatDisplayValue(localFilters.max)}
              onChange={e => setLocalFilters({...localFilters, max: e.target.value.replace(/\D/g, '')})}
            />
          </div>
        </div>
      </div>

      <button className={css.searchBtn} onClick={handleSearch}>Search</button>
    </div>
  );
};