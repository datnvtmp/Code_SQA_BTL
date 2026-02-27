'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import {
  getDishsByUser,
  getDishsByRecipe,
} from '../../services/dish.service';
import { addToCart } from '../../services/cart.service';

interface Dish {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  remainingServings: number;
  status: string;
}

interface Props {
  userId?: number;
  recipeId?: number;
}

const PAGE_SIZE = 5;

const DishMarketplace = ({ userId, recipeId }: Props) => {
  const router = useRouter();

  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState<number | null>(null);
  const [showGoCart, setShowGoCart] = useState(false);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!userId && !recipeId) return;

    const fetchAll = async () => {
      setLoading(true);
      try {
        const requests: Promise<any>[] = [];

        if (userId) {
          requests.push(
            getDishsByUser(userId, page, PAGE_SIZE)
          );
        }

        if (recipeId) {
          requests.push(
            getDishsByRecipe(recipeId, page, PAGE_SIZE)
          );
        }

        const responses = await Promise.all(requests);

        const merged = responses.flatMap(
          r => r.data.data.content ?? []
        );

        const unique = Array.from(
          new Map(merged.map((d: Dish) => [d.id, d])).values()
        ).filter(d => d.status === 'ACTIVE');

        setDishes(unique);

        // lấy totalPages lớn nhất
        const maxTotal = Math.max(
          ...responses.map(r => r.data.data.totalPages ?? 1)
        );
        setTotalPages(maxTotal);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [userId, recipeId, page]);

  const handleAddToCart = async (dishId: number) => {
    try {
      setAddingId(dishId);
      await addToCart(dishId, 1);
      setShowGoCart(true);
    } catch {
      alert('Không thể thêm món vào giỏ hàng');
    } finally {
      setAddingId(null);
    }
  };

  if (loading) {
    return (
      <p className="text-center text-gray-400">
        Đang tải món ăn…
      </p>
    );
  }

  if (!dishes.length) {
    return (
      <p className="text-center text-gray-400">
        Chưa có món ăn
      </p>
    );
  }

  return (
    <section className="w-full px-4 md:px-10 pb-10">
      {/* HEADER */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          Bạn có muốn đầu bếp nấu cho bạn không?
        </h2>
        <p className="text-gray-500 mt-2">
          Đặt món ngay – nấu nóng – giao tận tay 🍳
        </p>
      </div>

      {/* GO CART */}
      {showGoCart && (
        <div className="flex justify-center mb-6">
          <button
            onClick={() => router.push('/cart')}
            className="px-6 py-2 rounded-xl bg-black text-white hover:bg-gray-800"
          >
            Xem giỏ hàng 🛒
          </button>
        </div>
      )}

      {/* GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {dishes.map(dish => (
          <div
            key={dish.id}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
          >
            <div className="relative w-full h-28">
              <Image
                unoptimized
                src={dish.imageUrl}
                alt={dish.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="p-3">
              <h3 className="text-sm font-semibold line-clamp-1">
                {dish.name}
              </h3>

              <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                {dish.description}
              </p>

              <div className="flex justify-between items-center mt-2">
                <span className="text-emerald-600 font-bold text-sm">
                  {dish.price.toLocaleString()}đ
                </span>
                <span className="text-[11px] text-gray-400">
                  Còn {dish.remainingServings}
                </span>
              </div>

              <button
                onClick={() => handleAddToCart(dish.id)}
                disabled={addingId === dish.id}
                className="
                  w-full mt-3 py-1.5 text-xs rounded-lg
                  bg-emerald-500 text-white
                  hover:bg-emerald-600
                  disabled:opacity-60
                "
              >
                {addingId === dish.id ? 'Đang thêm...' : 'Đặt ngay'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          disabled={page === 0}
          onClick={() => setPage(p => Math.max(p - 1, 0))}
          className="px-4 py-2 text-sm rounded-lg border disabled:opacity-50"
        >
          ← Trước
        </button>

        <span className="text-sm text-gray-600">
          Trang <b>{page + 1}</b> / {totalPages}
        </span>

        <button
          disabled={page + 1 >= totalPages}
          onClick={() => setPage(p => p + 1)}
          className="px-4 py-2 text-sm rounded-lg border disabled:opacity-50"
        >
          Sau →
        </button>
      </div>
    </section>
  );
};

export default DishMarketplace;
