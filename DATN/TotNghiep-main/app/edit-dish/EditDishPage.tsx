'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/axios';
import Header from '@components/Common/Header';

interface Dish {
  name: string;
  description: string;
  price: number;
  remainingServings: number;
  recipeId: number;
  imageUrl: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export default function EditDishPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const dishId = searchParams.get('id') ?? '';

  // Query dish
  const { data: dish, isLoading, isError, error } = useQuery<Dish, Error>({
    queryKey: ['dish', dishId],
    queryFn: async () => {
      const res = await api.get(`/api/dishs/${dishId}`);
      return res.data.data;
    },
    enabled: !!dishId,
  });

  const mutation = useMutation({
    mutationFn: (updatedDish: Partial<Dish>) =>
      api.put(`/api/dishs/${dishId}`, { ...dish, ...updatedDish }),
    onSuccess: (res) => {
      queryClient.setQueryData(['dish', dishId], res.data.data);
      router.push('/dishes');
    },
  });

  const toggleMutation = useMutation({
    mutationFn: () => api.put(`/api/dishs/${dishId}/toggle-status`),
    onSuccess: (res) => {
      queryClient.setQueryData(['dish', dishId], (prev: any) => ({
        ...prev,
        status: res.data.data.status,
      }));
    },
  });

  const isMutating = mutation.status === 'pending';
  const isToggling = toggleMutation.status === 'pending';

  if (!dishId) return <div className="text-red-500 font-semibold">Dish ID not found.</div>;
  if (isLoading) return <div className="text-gray-500 animate-pulse">Loading dish...</div>;
  if (isError) return <div className="text-red-500 font-semibold">Error: {error?.message}</div>;

  return (
    <>
      <Header />

      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-purple-700">Edit Dish</h1>

        <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col md:flex-row gap-6">
          {/* Image preview */}
          <div className="flex-shrink-0 w-full md:w-1/3">
            {dish?.imageUrl ? (
              <img
                src={dish.imageUrl}
                alt={dish.name}
                className="w-full h-64 object-cover rounded-xl shadow-md"
              />
            ) : (
              <div className="w-full h-64 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}

            {/* Status toggle */}
            <button
              type="button"
              onClick={() => toggleMutation.mutate()}
              disabled={isToggling}
              className={`mt-3 inline-block px-3 py-1 rounded-full text-white font-semibold transition-all ${
                dish?.status === 'ACTIVE'
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-gray-400 hover:bg-gray-500'
              } ${isToggling ? 'opacity-50 cursor-not-allowed animate-pulse' : ''}`}
            >
              {isToggling ? 'Toggling...' : dish?.status}
            </button>
          </div>

          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as typeof e.target & {
                name: { value: string };
                description: { value: string };
                price: { value: string };
                remainingServings: { value: string };
              };
              mutation.mutate({
                name: form.name.value,
                description: form.description.value,
                price: Number(form.price.value),
                remainingServings: Number(form.remainingServings.value),
              });
            }}
            className="flex-1 space-y-4"
          >
            <div>
              <label className="block font-medium text-gray-700">Name</label>
              <input
                name="name"
                defaultValue={dish?.name}
                className="border p-2 w-full rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                defaultValue={dish?.description}
                className="border p-2 w-full rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-gray-700">Price</label>
                <input
                  type="number"
                  name="price"
                  defaultValue={dish?.price}
                  className="border p-2 w-full rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700">Remaining Servings</label>
                <input
                  type="number"
                  name="remainingServings"
                  defaultValue={dish?.remainingServings}
                  className="border p-2 w-full rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className={`w-full py-3 rounded-lg text-white font-semibold transition-all ${
                isMutating ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'
              }`}
              disabled={isMutating}
            >
              {isMutating ? 'Updating...' : 'Update Dish'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
