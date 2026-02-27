import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import RecipeCard from '../components/RecipeCard';
import { userAPI } from '../api/client';
import type { RecipeSummaryDTO, UserDTO } from '../types';

export default function Home() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<RecipeSummaryDTO[]>([]);
  const [user, setUser] = useState<UserDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, [page]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [profileData, recipesData] = await Promise.all([
        userAPI.getProfile(),
        userAPI.getMyRecipes(page, 12)
      ]);
      
      setUser(profileData);
      setRecipes(recipesData.content);
      setTotalPages(recipesData.totalPages);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e:any) => {
    e.preventDefault();
    // Placeholder for search functionality
    console.log('Searching for:', searchQuery);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Layout>
      <div style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5'
      }}>
        {/* Sidebar */}
        <div style={{
          width: isSidebarOpen ? '250px' : '60px',
          backgroundColor: '#2c3e50',
          color: 'white',
          padding: '1rem',
          transition: 'width 0.3s ease',
          position: 'fixed',
          height: '100%',
          zIndex: 1000
        }}>
          <button 
            onClick={toggleSidebar}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '24px',
              cursor: 'pointer',
              marginBottom: '1rem'
            }}
          >
            {isSidebarOpen ? '×' : '☰'}
          </button>
          {isSidebarOpen && (
            <div>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '18px' }}>Danh mục</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ padding: '0.5rem 0', cursor: 'pointer', opacity: 0.8, transition: 'opacity 0.2s' }}
                    onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
                    onMouseOut={(e) => e.currentTarget.style.opacity = '0.8'}>
                  Món chính
                </li>
                <li style={{ padding: '0.5rem 0', cursor: 'pointer', opacity: 0.8, transition: 'opacity 0.2s' }}
                    onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
                    onMouseOut={(e) => e.currentTarget.style.opacity = '0.8'}>
                  Món phụ
                </li>
                <li style={{ padding: '0.5rem 0', cursor: 'pointer', opacity: 0.8, transition: 'opacity 0.2s' }}
                    onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
                    onMouseOut={(e) => e.currentTarget.style.opacity = '0.8'}>
                  Tráng miệng
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div style={{
          marginLeft: isSidebarOpen ? '250px' : '60px',
          flex: 1,
          padding: '2rem',
          transition: 'margin-left 0.3s ease'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {/* Search Bar */}
            <div style={{
              marginBottom: '2rem',
              display: 'flex',
              gap: '1rem'
            }}>
              <div style={{
                flex: 1,
                position: 'relative'
              }}>
                <input
                  type="text"
                  placeholder="Tìm kiếm công thức..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 2.5rem 0.75rem 1rem',
                    borderRadius: '20px',
                    border: '1px solid #ddd',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#007bff'}
                  onBlur={(e) => e.target.style.borderColor = '#ddd'}
                />
                <button
                  onClick={handleSearch}
                  style={{
                    position: 'absolute',
                    right: '0.5rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '20px',
                    color: '#666'
                  }}
                >
                  🔍
                </button>
              </div>
              <button
                onClick={() => navigate('/create-recipe')}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '20px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#218838'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#28a745'}
              >
                <span style={{ fontSize: '20px' }}>+</span>
                Tạo công thức
              </button>
            </div>

            {/* Header */}
            <div style={{
              marginBottom: '2rem'
            }}>
              <h2 style={{
                margin: 0,
                color: '#2c3e50',
                fontSize: '28px',
                fontWeight: '600'
              }}>
                Xin chào, {user?.username || 'User'}! 👋
              </h2>
              <p style={{
                color: '#666',
                marginTop: '0.5rem',
                fontSize: '16px'
              }}>
                Khám phá và quản lý các công thức nấu ăn của bạn
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div style={{
                padding: '1rem',
                backgroundColor: '#ffe6e6',
                color: '#c0392b',
                borderRadius: '8px',
                marginBottom: '1rem',
                border: '1px solid #ebccd1'
              }}>
                {error}
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div style={{
                textAlign: 'center',
                padding: '3rem',
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <p style={{ fontSize: '18px', color: '#666' }}>Đang tải...</p>
              </div>
            )}

            {/* Recipes Grid */}
            {!loading && recipes.length > 0 && (
              <>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: '1.5rem',
                  marginBottom: '2rem'
                }}>
                  {recipes.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    marginTop: '2rem'
                  }}>
                    <button
                      onClick={() => setPage(p => Math.max(0, p - 1))}
                      disabled={page === 0}
                      style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: page === 0 ? '#e9ecef' : '#007bff',
                        color: page === 0 ? '#6c757d' : 'white',
                        border: 'none',
                        borderRadius: '20px',
                        cursor: page === 0 ? 'not-allowed' : 'pointer',
                        transition: 'background-color 0.2s'
                      }}
                    >
                      ← Trước
                    </button>
                    <span style={{
                      padding: '0.75rem 1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      color: '#2c3e50',
                      fontWeight: '500'
                    }}>
                      Trang {page + 1} / {totalPages}
                    </span>
                    <button
                      onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                      disabled={page >= totalPages - 1}
                      style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: page >= totalPages - 1 ? '#e9ecef' : '#007bff',
                        color: page >= totalPages - 1 ? '#6c757d' : 'white',
                        border: 'none',
                        borderRadius: '20px',
                        cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer',
                        transition: 'background-color 0.2s'
                      }}
                    >
                      Sau →
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Empty State */}
            {!loading && recipes.length === 0 && (
              <div style={{
                textAlign: 'center',
                padding: '4rem 2rem',
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                marginTop: '2rem'
              }}>
                <p style={{ fontSize: '48px', marginBottom: '1rem', color: '#666' }}>📝</p>
                <h3 style={{ color: '#2c3e50', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Chưa có công thức nào
                </h3>
                <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '16px' }}>
                  Hãy tạo công thức đầu tiên của bạn!
                </p>
                <button
                  onClick={() => navigate('/create-recipe')}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '20px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#218838'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#28a745'}
                >
                  Tạo công thức ngay
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}