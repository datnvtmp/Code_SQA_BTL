'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { createDish } from '../../services/dish.service';
import { getMyRecipes } from '../../services/recipe.service';

const CreateDishForm = () => {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    remainingServings: '',
    recipeId: '',
    image: null as File | null,
  });

  useEffect(() => {
    getMyRecipes().then(res => {
      setRecipes(res.data.data.content);
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value, files } = e.target;

    if (name === 'image' && files?.[0]) {
      const file = files[0];
      setForm(prev => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('description', form.description);
    formData.append('price', form.price);
    formData.append('remainingServings', form.remainingServings);

    if (form.recipeId) {
      formData.append('recipeId', form.recipeId);
    }

    if (form.image) {
      formData.append('image', form.image);
    }

    try {
      await createDish(formData);
      alert('🎉 Tạo món ăn thành công');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-10 rounded-3xl shadow-xl">
      <h1 className="text-3xl font-extrabold text-center text-emerald-600 mb-10">
        🍽️ Tạo món ăn mới để bán 
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-x-6"
      >
        {/* Tên món */}
        <div className="field md:col-span-2">
          <label className="label">Tên món *</label>
          <input
            name="name"
            placeholder="Ví dụ: Gà sốt teriyaki"
            className="input"
            onChange={handleChange}
            required
          />
        </div>

        {/* Giá */}
        <div className="field">
          <label className="label">Giá bán (VNĐ) *</label>
          <input
            name="price"
            type="number"
            placeholder="45000"
            className="input"
            onChange={handleChange}
            required
          />
        </div>

        {/* Số lượng */}
        <div className="field">
          <label className="label">Số phần còn lại *</label>
          <input
            name="remainingServings"
            type="number"
            placeholder="20"
            className="input"
            onChange={handleChange}
            required
          />
        </div>

        {/* Recipe */}
        <div className="field md:col-span-2">
          <label className="label">Liên kết công thức</label>
          <select
            name="recipeId"
            className="input"
            onChange={handleChange}
          >
            <option value="">— Không liên kết công thức —</option>
            {recipes.map(r => (
              <option key={r.id} value={r.id}>
                {r.title}
              </option>
            ))}
          </select>
        </div>

        {/* Mô tả */}
        <div className="field md:col-span-2">
          <label className="label">Mô tả món ăn</label>
          <textarea
            name="description"
            placeholder="Món ăn được chế biến từ..."
            className="input h-28 resize-none"
            onChange={handleChange}
          />
        </div>

        {/* Ảnh */}
        <div className="field md:col-span-2">
          <label className="label">Ảnh món ăn *</label>

          <div className="flex items-center gap-6">
            <label className="upload-box">
              <input
                type="file"
                name="image"
                accept="image/*"
                hidden
                onChange={handleChange}
              />
              <span className="text-sm font-medium text-gray-600">
                📸 Chọn ảnh
              </span>
            </label>

            {preview && (
              <div className="relative w-36 h-36 rounded-xl overflow-hidden border-2 border-gray-200">
                <Image unoptimized
                  src={preview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="md:col-span-2 pt-6">
          <button
            disabled={loading}
            className="
              w-full py-4 rounded-2xl text-white font-bold
              bg-gradient-to-r from-emerald-500 to-green-600
              hover:scale-[1.02] hover:shadow-xl
              transition-all duration-300
              disabled:opacity-60
            "
          >
            {loading ? '⏳ Đang tạo món...' : '🚀 Tạo món'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateDishForm;
