'use client';

import Image from 'next/image';
import { addToCart } from '../../services/cart.service';

const DishCard = ({ dish }: any) => (
  <div className="bg-white rounded-xl shadow hover:shadow-lg">
    <Image unoptimized
      src={dish.imageUrl}
      alt={dish.name}
      width={400}
      height={300}
      className="rounded-t-xl object-cover"
    />

    <div className="p-4">
      <h3 className="font-bold">{dish.name}</h3>
      <p className="text-sm text-gray-500">{dish.description}</p>

      <div className="flex justify-between mt-3">
        <span className="font-semibold">{dish.price} đ</span>
        <button
          onClick={() => addToCart(dish.id)}
          className="px-3 py-1 bg-black text-white rounded-lg"
        >
          Thêm
        </button>
      </div>
    </div>
  </div>
);

export default DishCard;
