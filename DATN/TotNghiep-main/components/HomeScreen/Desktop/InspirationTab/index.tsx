'use client';

import { useEffect, useState } from 'react';
import FeaturedRecipesSection from './FeaturedRecipesSection';
import IngredientsSection, { IngredientItem } from './IngredientsSection';
import PopularTopicsSection from './PopularTopicsSection';
import { useAuthStore } from '@/store/useAuthStore';
import RecipeSearchByIngredient from './RecipeSearchByIngredient';

const InspirationTab = () => {
  const [ingredients, setIngredients] = useState<IngredientItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const token = useAuthStore.getState().token;

  useEffect(() => {
    const fetchIngredients = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/ingredient/top`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Không lấy được danh sách nguyên liệu');

        const response = await res.json();
        const content = Array.isArray(response.data?.content) ? response.data.content : [];
        const mapped: IngredientItem[] = content.map((item: any, index: number) => ({
          id: item.id.toString(),
          name: item.name,
          isSelected: index === 0, // Chọn mặc định item đầu tiên
        }));

        setIngredients(mapped);
      } catch (err: any) {
        setError(err.message || 'Lỗi kết nối server');
      } finally {
        setLoading(false);
      }
    };

    fetchIngredients();
  }, [token]);

  if (loading) return <p className="py-6 text-center">Đang tải nguyên liệu...</p>;
  if (error) return <p className="py-6 text-center text-red-500">{error}</p>;

  return (
    <div className="flex flex-col items-center pt-4 pb-4">
      <IngredientsSection ingredients={ingredients} />
      <RecipeSearchByIngredient />
      <PopularTopicsSection />
      <FeaturedRecipesSection />
    </div>
  );
};

export default InspirationTab;
