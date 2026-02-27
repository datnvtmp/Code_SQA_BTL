import { useNavigate } from 'react-router-dom';
import type { RecipeSummaryDTO } from '../types';

interface RecipeCardProps {
  recipe: RecipeSummaryDTO;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return '#28a745';
      case 'PENDING': return '#ffc107';
      case 'REJECTED': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getScopeLabel = (scope: string) => {
    switch (scope) {
      case 'PUBLIC': return 'Công khai';
      case 'PRIVATE': return 'Riêng tư';
      case 'DRAFT': return 'Nháp';
      default: return scope;
    }
  };

  const DEFAULT_AVATAR = '/default-avatar.png';

  const handleClick = () => {
    navigate(`/recipe/${recipe.id}`);
  };

  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s',
        cursor: 'pointer'
      }}
      onClick={handleClick}
      onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
      onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
    >
      {/* Ảnh món ăn */}
      {recipe.imageUrl && (
        <img
          src={recipe.imageUrl}
          alt={recipe.title}
          style={{
            width: '100%',
            height: '200px',
            objectFit: 'cover'
          }}
        />
      )}

      {/* Nội dung thẻ */}
      <div style={{ padding: '1rem' }}>
        {/* Thông tin tác giả */}
        {recipe.user && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.75rem'
            }}
          >
            <img
              src={recipe.user.avatarUrl || DEFAULT_AVATAR}
              alt={recipe.user.username}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                objectFit: 'cover'
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '14px', color: '#333', fontWeight: 500 }}>
                {recipe.user.username}
              </span>
              <span style={{ fontSize: '12px', color: '#888' }}>
                {new Date(recipe.createdAt).toLocaleDateString('vi-VN')}
              </span>
            </div>
          </div>
        )}

        {/* Tiêu đề và trạng thái */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'start',
            marginBottom: '0.5rem'
          }}
        >
          <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#222' }}>
            {recipe.title}
          </h3>
          <span
            style={{
              padding: '0.25rem 0.5rem',
              backgroundColor: getStatusColor(recipe.status),
              color: 'white',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 'bold'
            }}
          >
            {recipe.status}
          </span>
        </div>

        {/* Mô tả ngắn */}
        {recipe.description && (
          <p
            style={{
              color: '#666',
              fontSize: '14px',
              marginTop: '0.5rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}
          >
            {recipe.description}
          </p>
        )}

        {/* Thông tin phụ (thời gian, khẩu phần, lượt thích) */}
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            marginTop: '1rem',
            fontSize: '14px',
            color: '#666'
          }}
        >
          <span>⏱️ {recipe.prepTime + recipe.cookTime} phút</span>
          <span>🍽️ {recipe.servings} người</span>
          <span>❤️ {recipe.likesCount}</span>
        </div>

        {/* Danh mục + phạm vi */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            marginTop: '0.75rem',
            flexWrap: 'wrap'
          }}
        >
          <span
            style={{
              padding: '0.25rem 0.5rem',
              backgroundColor: '#e9ecef',
              borderRadius: '4px',
              fontSize: '12px'
            }}
          >
            {getScopeLabel(recipe.scope)}
          </span>
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
        </div>
      </div>
    </div>
  );
}
