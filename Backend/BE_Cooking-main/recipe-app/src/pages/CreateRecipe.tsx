import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { userAPI } from '../api/client';
import type { NewRecipeRequest, StepRequestDTO, RecipeIngredientRequestDTO } from '../types';

export default function CreateRecipe() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState<NewRecipeRequest>({
    title: '',
    description: '',
    servings: 1,
    prepTime: 0,
    cookTime: 0,
    scope: 'PUBLIC',
    steps: [{ stepNumber: 1, description: '' }],
    recipeIngredients: [{ rawName: '', quantity: undefined, unit: '', displayOrder: 0 }],
    categoryIds: [],
    tagIds: []
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [stepImages, setStepImages] = useState<(File | null)[]>([null]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [stepImagePreviews, setStepImagePreviews] = useState<(string | null)[]>([null]);

  const addStep = () => {
    setFormData({
      ...formData,
      steps: [...formData.steps, { stepNumber: formData.steps.length + 1, description: '' }],
    });
    setStepImages([...stepImages, null]);
    setStepImagePreviews([...stepImagePreviews, null]);
  };

  const removeStep = (index: number) => {
    const newSteps = formData.steps.filter((_, i) => i !== index)
      .map((step, i) => ({ ...step, stepNumber: i + 1 }));
    setFormData({ ...formData, steps: newSteps });
    setStepImages(stepImages.filter((_, i) => i !== index));
    setStepImagePreviews(stepImagePreviews.filter((_, i) => i !== index));
  };

  const updateStep = (index: number, field: keyof StepRequestDTO, value: any) => {
    const newSteps = [...formData.steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setFormData({ ...formData, steps: newSteps });
  };

  const addIngredient = () => {
    setFormData({
      ...formData,
      recipeIngredients: [...formData.recipeIngredients, { 
        rawName: '', 
        quantity: undefined, 
        unit: '', 
        displayOrder: formData.recipeIngredients.length 
      }],
    });
  };

  const removeIngredient = (index: number) => {
    const newIngredients = formData.recipeIngredients.filter((_, i) => i !== index)
      .map((ing, i) => ({ ...ing, displayOrder: i }));
    setFormData({ ...formData, recipeIngredients: newIngredients });
  };

  const updateIngredient = (index: number, field: keyof RecipeIngredientRequestDTO, value: any) => {
    const newIngredients = [...formData.recipeIngredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setFormData({ ...formData, recipeIngredients: newIngredients });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const handleStepImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newStepImages = [...stepImages];
      const newStepImagePreviews = [...stepImagePreviews];
      newStepImages[index] = file;
      newStepImagePreviews[index] = URL.createObjectURL(file);
      setStepImages(newStepImages);
      setStepImagePreviews(newStepImagePreviews);
    } else {
      const newStepImages = [...stepImages];
      const newStepImagePreviews = [...stepImagePreviews];
      newStepImages[index] = null;
      newStepImagePreviews[index] = null;
      setStepImages(newStepImages);
      setStepImagePreviews(newStepImagePreviews);
    }
  };

  const minutesToHoursMinutes = (totalMinutes: number) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return { hours, minutes };
  };

  const handleTimeChange = (field: 'prepTime' | 'cookTime', type: 'hours' | 'minutes', value: number) => {
    const current = minutesToHoursMinutes(formData[field]);
    const newTime = type === 'hours' 
      ? (value * 60) + current.minutes
      : (current.hours * 60) + value;
    setFormData({ ...formData, [field]: newTime });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!formData.title.trim()) {
        throw new Error('Vui lòng nhập tên công thức');
      }
      if (formData.steps.some(s => !s.description.trim())) {
        throw new Error('Vui lòng điền đầy đủ các bước');
      }
      if (formData.recipeIngredients.some(i => !i.rawName.trim())) {
        throw new Error('Vui lòng điền đầy đủ nguyên liệu');
      }

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description ?? '');
      formDataToSend.append('servings', formData.servings.toString());
      formDataToSend.append('prepTime', formData.prepTime.toString());
      formDataToSend.append('cookTime', formData.cookTime.toString());
      formDataToSend.append('scope', formData.scope);

      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      formData.steps.forEach((step, index) => {
        formDataToSend.append(`steps[${index}].stepNumber`, step.stepNumber.toString());
        formDataToSend.append(`steps[${index}].description`, step.description);
        if (stepImages[index]) {
          formDataToSend.append(`steps[${index}].images[0]`, stepImages[index]!);
        }
      });

      formData.recipeIngredients.forEach((ingredient, index) => {
        formDataToSend.append(`recipeIngredients[${index}].rawName`, ingredient.rawName);
        if (ingredient.quantity !== undefined) {
          formDataToSend.append(`recipeIngredients[${index}].quantity`, ingredient.quantity.toString());
        }
        formDataToSend.append(`recipeIngredients[${index}].unit`, ingredient.unit ?? '');
        formDataToSend.append(`recipeIngredients[${index}].displayOrder`, index.toString());
      });

      formData.categoryIds?.forEach((id, index) => {
        formDataToSend.append(`categoryIds[${index}]`, id.toString());
      });
      formData.tagIds?.forEach((id, index) => {
        formDataToSend.append(`tagIds[${index}]`, id.toString());
      });

      await userAPI.createRecipe(formDataToSend);
      setSuccess('Tạo công thức thành công!');
      setTimeout(() => navigate('/'), 1500);
    } catch (err: any) {
      setError(err.message || err.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>Tạo công thức mới</h2>

        {error && (
          <div style={{
            padding: '1rem',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            borderRadius: '6px',
            marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            padding: '1rem',
            backgroundColor: '#d4edda',
            color: '#155724',
            borderRadius: '6px',
            marginBottom: '1rem'
          }}>
            {success}
          </div>
        )}

        <form encType="multipart/form-data" onSubmit={handleSubmit} style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          {/* Thông tin cơ bản */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem', color: '#333' }}>Thông tin cơ bản</h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Tên công thức <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
                placeholder="Ví dụ: Phở bò Hà Nội"
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Mô tả
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  resize: 'vertical'
                }}
                placeholder="Mô tả ngắn về công thức của bạn..."
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Số người ăn <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="number"
                  value={formData.servings}
                  onChange={(e) => setFormData({ ...formData, servings: parseInt(e.target.value) || 1 })}
                  min="1"
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Ví dụ: 4"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Trạng thái <span style={{ color: 'red' }}>*</span>
                </label>
                <select
                  value={formData.scope}
                  onChange={(e) => setFormData({ ...formData, scope: e.target.value as any })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="PUBLIC">Công khai</option>
                  <option value="PRIVATE">Riêng tư</option>
                  <option value="DRAFT">Nháp</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Thời gian chuẩn bị <span style={{ color: 'red' }}>*</span>
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <select
                    value={minutesToHoursMinutes(formData.prepTime).hours}
                    onChange={(e) => handleTimeChange('prepTime', 'hours', parseInt(e.target.value))}
                    style={{
                      width: '50%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  >
                    {Array.from({ length: 24 }, (_, i) => (
                      <option key={i} value={i}>{i} giờ</option>
                    ))}
                  </select>
                  <select
                    value={minutesToHoursMinutes(formData.prepTime).minutes}
                    onChange={(e) => handleTimeChange('prepTime', 'minutes', parseInt(e.target.value))}
                    style={{
                      width: '50%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  >
                    {Array.from({ length: 60 }, (_, i) => (
                      <option key={i} value={i}>{i} phút</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Thời gian nấu <span style={{ color: 'red' }}>*</span>
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <select
                    value={minutesToHoursMinutes(formData.cookTime).hours}
                    onChange={(e) => handleTimeChange('cookTime', 'hours', parseInt(e.target.value))}
                    style={{
                      width: '50%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  >
                    {Array.from({ length: 24 }, (_, i) => (
                      <option key={i} value={i}>{i} giờ</option>
                    ))}
                  </select>
                  <select
                    value={minutesToHoursMinutes(formData.cookTime).minutes}
                    onChange={(e) => handleTimeChange('cookTime', 'minutes', parseInt(e.target.value))}
                    style={{
                      width: '50%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  >
                    {Array.from({ length: 60 }, (_, i) => (
                      <option key={i} value={i}>{i} phút</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Hình ảnh công thức
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
              {imagePreview && (
                <div style={{ marginTop: '0.5rem' }}>
                  <img
                    src={imagePreview}
                    alt="Recipe preview"
                    style={{
                      maxWidth: '200px',
                      maxHeight: '200px',
                      objectFit: 'cover',
                      borderRadius: '4px',
                      border: '1px solid #ddd'
                    }}
                  />
                </div>
              )}
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Danh mục (ID)
              </label>
              <input
                type="text"
                value={formData.categoryIds?.join(',')}
                onChange={(e) => setFormData({ ...formData, categoryIds: e.target.value.split(',').map(Number).filter(id => !isNaN(id)) })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
                placeholder="Ví dụ: 1,2,3"
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Thẻ (ID)
              </label>
              <input
                type="text"
                value={formData.tagIds?.join(',')}
                onChange={(e) => setFormData({ ...formData, tagIds: e.target.value.split(',').map(Number).filter(id => !isNaN(id)) })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
                placeholder="Ví dụ: 1,2,3"
              />
            </div>
          </div>

          {/* Nguyên liệu */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, color: '#333' }}>Nguyên liệu</h3>
              <button
                type="button"
                onClick={addIngredient}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                + Thêm nguyên liệu
              </button>
            </div>

            {formData.recipeIngredients.map((ingredient, index) => (
              <div key={index} style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr auto',
                gap: '0.5rem',
                marginBottom: '0.75rem',
                alignItems: 'end'
              }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '12px', color: '#666' }}>
                    Tên <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={ingredient.rawName}
                    onChange={(e) => updateIngredient(index, 'rawName', e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                    placeholder="Ví dụ: Thịt bò"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '12px', color: '#666' }}>
                    Số lượng
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={ingredient.quantity || ''}
                    onChange={(e) => updateIngredient(index, 'quantity', parseFloat(e.target.value) || undefined)}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                    placeholder="Ví dụ: 500"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '12px', color: '#666' }}>
                    Đơn vị
                  </label>
                  <input
                    type="text"
                    value={ingredient.unit || ''}
                    onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                    placeholder="Ví dụ: gram"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  disabled={formData.recipeIngredients.length === 1}
                  style={{
                    padding: '0.5rem 0.75rem',
                    backgroundColor: formData.recipeIngredients.length === 1 ? '#e9ecef' : '#dc3545',
                    color: formData.recipeIngredients.length === 1 ? '#6c757d' : 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '14px',
                    cursor: formData.recipeIngredients.length === 1 ? 'not-allowed' : 'pointer'
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Các bước thực hiện */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, color: '#333' }}>Các bước thực hiện</h3>
              <button
                type="button"
                onClick={addStep}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                + Thêm bước
              </button>
            </div>

            {formData.steps.map((step, index) => (
              <div key={index} style={{
                marginBottom: '1rem',
                padding: '1rem',
                backgroundColor: '#f8f9fa',
                borderRadius: '6px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <strong style={{ color: '#333' }}>Bước {step.stepNumber}</strong>
                  <button
                    type="button"
                    onClick={() => removeStep(index)}
                    disabled={formData.steps.length === 1}
                    style={{
                      padding: '0.25rem 0.5rem',
                      backgroundColor: formData.steps.length === 1 ? '#e9ecef' : '#dc3545',
                      color: formData.steps.length === 1 ? '#6c757d' : 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '12px',
                      cursor: formData.steps.length === 1 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    Xóa
                  </button>
                </div>
                <textarea
                  value={step.description}
                  onChange={(e) => updateStep(index, 'description', e.target.value)}
                  required
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    resize: 'vertical'
                  }}
                  placeholder="Mô tả chi tiết bước này, ví dụ: Cắt thịt bò thành lát mỏng..."
                />
                <div style={{ marginTop: '0.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '12px', color: '#666' }}>
                    Hình ảnh bước
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleStepImageChange(index, e)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                  {stepImagePreviews[index] && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <img
                        src={stepImagePreviews[index]!}
                        alt={`Step ${step.stepNumber} preview`}
                        style={{
                          maxWidth: '200px',
                          maxHeight: '200px',
                          objectFit: 'cover',
                          borderRadius: '4px',
                          border: '1px solid #ddd'
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => navigate('/')}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: loading ? '#6c757d' : '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Đang tạo...' : 'Tạo công thức'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}