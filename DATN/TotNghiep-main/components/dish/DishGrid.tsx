'use client';

import { useEffect, useState } from 'react';
import DishCard from './DishCard';
import { getActiveDishes } from '../../services/dish.service';

const DishGrid = () => {
  const [dishes, setDishes] = useState([]);

  useEffect(() => {
    getActiveDishes().then(res => setDishes(res.data.data));
  }, []);

  return (
    <div className="grid grid-cols-4 gap-6">
      {dishes.map((dish: any) => (
        <DishCard key={dish.id} dish={dish} />
      ))}
    </div>
  );
};

export default DishGrid;
