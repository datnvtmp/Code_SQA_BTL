import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { userAPI } from '../api/client';
import type { RecipeDetailDTO } from '../types';

export default function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<RecipeDetailDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadRecipe = async () => {
      setLoading(true);
      setError('');
      try {
        if (!id) throw new Error('Không tìm thấy ID công thức');
        const recipeData = await userAPI.getRecipeDetail(Number(id));
        setRecipe(recipeData);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Không thể tải công thức');
      } finally {
        setLoading(false);
      }
    };

    loadRecipe();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ fontSize: '18px', color: '#666' }}>Đang tải...</p>
        </div>
      </Layout>
    );
  }

  if (error || !recipe) {
    return (
      <Layout>
        <div style={{
          padding: '1rem',
          backgroundColor: '#ffe6e6',
          color: '#c0392b',
          borderRadius: '8px',
          margin: '2rem'
        }}>
          {error || 'Không tìm thấy công thức'}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{
        maxWidth: '800px',
        margin: '2rem auto',
        padding: '1rem',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        {/* Header */}
        <h1 style={{ color: '#2c3e50', fontSize: '28px', fontWeight: '600' }}>
          {recipe.title}
        </h1>
        {recipe.imageUrl && (
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            style={{
              width: '100%',
              maxHeight: '400px',
              objectFit: 'cover',
              borderRadius: '8px',
              margin: '1rem 0'
            }}
          />
        )}

        {/* Thông tin tác giả */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <img
            src={recipe.user.avatarUrl || '/default-avatar.png'}
            alt={recipe.user.username}
            style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <div>
            <span style={{ fontSize: '16px', fontWeight: '500' }}>{recipe.user.username}</span>
            <div style={{ fontSize: '14px', color: '#666' }}>
              {new Date(recipe.createdAt).toLocaleDateString('vi-VN')}
            </div>
          </div>
        </div>

        {/* Thông tin cơ bản */}
        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem', color: '#666' }}>
          <span>⏱️ {recipe.prepTime + recipe.cookTime} phút</span>
          <span>🍽️ {recipe.servings} người</span>
          <span>❤️ {recipe.likesCount}</span>
        </div>

        {/* Mô tả */}
        {recipe.description && (
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ color: '#2c3e50', fontSize: '20px' }}>Mô tả</h3>
            <p style={{ color: '#333', lineHeight: '1.6' }}>{recipe.description}</p>
          </div>
        )}

        {/* Nguyên liệu */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ color: '#2c3e50', fontSize: '20px' }}>Nguyên liệu</h3>
          <ul style={{ paddingLeft: '1.5rem', color: '#333' }}>
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>
                {ingredient.quantity} {ingredient.unit} {ingredient.displayName}
              </li>
            ))}
          </ul>
        </div>

        {/* Các bước thực hiện */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ color: '#2c3e50', fontSize: '20px' }}>Các bước thực hiện</h3>
          <ol style={{ paddingLeft: '1.5rem', color: '#333' }}>
            {recipe.steps.map((step) => (
              <li key={step.stepNumber} style={{ marginBottom: '1rem' }}>
                <p style={{ fontWeight: '500' }}>{step.description}</p>
                {step.imageUrls.length > 0 && (
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                    {step.imageUrls.map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt={`Step ${step.stepNumber}`}
                        style={{
                          width: '100px',
                          height: '100px',
                          objectFit: 'cover',
                          borderRadius: '4px'
                        }}
                      />
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ol>
        </div>

        {/* Danh mục và tags */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {recipe.categories.map((cat) => (
            <span
              key={cat.slug}
              style={{
                padding: '0.25rem 0.5rem',
                backgroundColor: '#e7f3ff',
                color: '#0066cc',
                borderRadius: '4px',
                fontSize: '12px'
              }}
            >
              {cat.name}
            </span>
          ))}
          {recipe.tags.map((tag) => (
            <span
              key={tag.slug}
              style={{
                padding: '0.25rem 0.5rem',
                backgroundColor: '#e9ecef',
                color: '#333',
                borderRadius: '4px',
                fontSize: '12px'
              }}
            >
              {tag.name}
            </span>
          ))}
        </div>

        {/* Nút quay lại */}
        <button
          onClick={() => navigate(-1)}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer'
          }}
        >
          Quay lại
        </button>
      </div>
    </Layout>
  );
}