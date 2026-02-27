'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import BackHeader from '../../Common/BackHeader';
import CustomButton from '../../Common/CustomButton';
import { useAuthStore } from '@/store/useAuthStore';

interface Ingredient {
    id: string;
    rawName: string;
    note: string;
    amount: string;
    unit: string;
}

interface Step {
    id: string;
    step: string;
    description: string;
    stepTime: number;
    imageFiles: File[];
}

interface Category {
    id: number;
    name: string;
}

const initialIngredients: Ingredient[] = [{ id: '1', rawName: '', note: '', amount: '', unit: '' }];
const initialSteps: Step[] = [{ id: '1', step: 'Bước 1', description: '', imageFiles: [], stepTime: 0 }];

const CreateRecipeScreen = () => {
    const router = useRouter();
    const token = useAuthStore.getState().token;

    // Recipe info
    const [recipeName, setRecipeName] = useState('');
    const [recipeDescription, setRecipeDescription] = useState('');
    const [portion, setPortion] = useState(2);
    const [prepTime, setPrepTime] = useState('20');
    const [cookTime, setCookTime] = useState('30');
    const [scope, setScope] = useState('PUBLIC');
    const [recipeImageFile, setRecipeImageFile] = useState<File | null>(null);
    const [recipeVideoFile, setRecipeVideoFile] = useState<File | null>(null);
    const [videoUrl, setVideoUrl] = useState(''); // Link trả về từ server
    const [uploadingVideo, setUploadingVideo] = useState(false);

    // Ingredients & Steps
    const [ingredients, setIngredients] = useState<Ingredient[]>(initialIngredients);
    const [steps, setSteps] = useState<Step[]>(initialSteps);

    // Categories
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

    const recipeImageRef = useRef<HTMLInputElement>(null);
    const recipeVideoRef = useRef<HTMLInputElement>(null);

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/categories?page=0&size=10`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error('Failed to fetch categories');
                const json = await res.json();
                const dataArray = Array.isArray(json.data)
                    ? json.data
                    : Array.isArray(json.data?.content)
                        ? json.data.content
                        : [];
                setCategories(dataArray);
            } catch (err) {
                console.error(err);
                setCategories([]);
            }
        };
        fetchCategories();
    }, [token]);

    // Handlers for Ingredients
    const handleAddIngredient = () => setIngredients([...ingredients, { id: Date.now().toString(), rawName: '', note: '', amount: '', unit: '' }]);
    const handleIngredientChange = (index: number, field: 'rawName' | 'note' | 'amount' | 'unit', value: string) => {
        const newIngredients = [...ingredients];
        newIngredients[index][field] = value;
        setIngredients(newIngredients);
    };

    // Handlers for Steps
    const handleAddStep = () =>
        setSteps([...steps, { id: Date.now().toString(), step: `Bước ${steps.length + 1}`, description: '', imageFiles: [], stepTime: 0 }]);
    const handleStepChange = (index: number, field: 'description' | 'imageFiles' | 'stepTime', value: string | File[] | number) => {
        const newSteps = [...steps];
        if (field === 'description' && typeof value === 'string') newSteps[index].description = value;
        if (field === 'imageFiles' && Array.isArray(value)) newSteps[index].imageFiles = value;
        if (field === 'stepTime' && typeof value === 'number') newSteps[index].stepTime = value;
        setSteps(newSteps);
    };

    // Upload video trước khi submit
    const handleUploadVideo = async () => {
        if (!recipeVideoFile) return;
        setUploadingVideo(true);
        const formData = new FormData();
        formData.append('file', recipeVideoFile);

        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_HOST}/api/upload/video`, formData, {
                headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` },
            });
            setVideoUrl(res.data.data);
            alert('Upload video thành công!');
        } catch (err) {
            console.error(err);
            alert('Upload video thất bại');
        } finally {
            setUploadingVideo(false);
        }
    };

    // Submit recipe
    const handleSubmit = async () => {
        if (!recipeName.trim()) return alert('Vui lòng nhập tên món ăn');
        if (!selectedCategoryId) return alert('Vui lòng chọn danh mục');

        const formData = new FormData();
        formData.append('title', recipeName);
        formData.append('description', recipeDescription);
        formData.append('servings', String(portion));
        formData.append('prepTime', prepTime);
        formData.append('cookTime', cookTime);
        formData.append('scope', scope);

        if (recipeImageFile) formData.append('image', recipeImageFile);
        if (videoUrl) formData.append('videoUrl', videoUrl); // dùng link video đã upload

        formData.append('categoryIds', String(selectedCategoryId));

        ingredients.forEach((ing, i) => {
            formData.append(`recipeIngredients[${i}].rawName`, ing.rawName);
            formData.append(`recipeIngredients[${i}].note`, ing.note);
            formData.append(`recipeIngredients[${i}].quantity`, ing.amount);
            formData.append(`recipeIngredients[${i}].unit`, ing.unit);
            formData.append(`recipeIngredients[${i}].displayOrder`, String(i + 1));
        });

        steps.forEach((step, i) => {
            formData.append(`steps[${i}].stepNumber`, String(i + 1));
            formData.append(`steps[${i}].description`, step.description);
            formData.append(`steps[${i}].stepTime`, String(step.stepTime));
            step.imageFiles.forEach((file, j) => formData.append(`steps[${i}].images[${j}]`, file));
        });

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/recipes`, {
                method: 'POST',
                body: formData,
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error('Failed to create recipe');
            alert('Tạo công thức thành công!');
            router.replace('/create/recipe/success');
        } catch (err) {
            console.error(err);
            alert('Lỗi khi tạo công thức!');
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <BackHeader headerTitle="Chỉnh sửa công thức món ăn" onPress={() => router.back()} />

            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-8">

                {/* ================= Recipe Info ================= */}
                <section className="bg-white/90 backdrop-blur rounded-2xl shadow-lg border border-gray-100 p-5 space-y-5">
                    <h2 className="text-lg font-bold text-gray-800 border-l-4 border-orange-400 pl-3">
                        Thông tin món ăn
                    </h2>

                    <div className="space-y-2">
                        <label className="font-semibold text-gray-700">Tên món ăn</label>
                        <input
                            type="text"
                            placeholder="Nhập tên món ăn"
                            value={recipeName}
                            onChange={e => setRecipeName(e.target.value)}
                            className="w-full p-3 rounded-xl border border-gray-300
                                   focus:ring-2 focus:ring-orange-400 focus:border-orange-400
                                   transition"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="font-semibold text-gray-700">Mô tả món ăn</label>
                        <textarea
                            rows={4}
                            placeholder="Mô tả món ăn"
                            value={recipeDescription}
                            onChange={e => setRecipeDescription(e.target.value)}
                            className="w-full p-3 rounded-xl border border-gray-300 resize-none
                                   focus:ring-2 focus:ring-orange-400 focus:border-orange-400
                                   transition"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="font-semibold text-gray-700">Chuẩn bị (phút)</label>
                            <input
                                type="number"
                                value={prepTime}
                                onChange={e => setPrepTime(e.target.value)}
                                className="w-full p-3 rounded-xl border border-gray-300
                                       focus:ring-2 focus:ring-orange-400"
                            />
                        </div>
                        <div>
                            <label className="font-semibold text-gray-700">Nấu (phút)</label>
                            <input
                                type="number"
                                value={cookTime}
                                onChange={e => setCookTime(e.target.value)}
                                className="w-full p-3 rounded-xl border border-gray-300
                                       focus:ring-2 focus:ring-orange-400"
                            />
                        </div>
                    </div>

                    {/* Media */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Image */}
                        <div className="space-y-2">
                            <label className="font-semibold text-gray-700">Ảnh món ăn</label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="file"
                                    ref={recipeImageRef}
                                    onChange={e => setRecipeImageFile(e.target.files?.[0] || null)}
                                    hidden
                                />
                                <button
                                    type="button"
                                    onClick={() => recipeImageRef.current?.click()}
                                    className="px-4 py-2 rounded-xl bg-orange-400 text-white
                                           hover:bg-orange-500 transition"
                                >
                                    Chọn ảnh
                                </button>
                                {recipeImageFile && (
                                    <span className="text-sm text-gray-600 truncate">
                                        {recipeImageFile.name}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Video */}
                        <div className="space-y-2">
                            <label className="font-semibold text-gray-700">Video món ăn</label>
                            <div className="flex flex-wrap items-center gap-3">
                                <input
                                    type="file"
                                    ref={recipeVideoRef}
                                    accept="video/*"
                                    onChange={e => setRecipeVideoFile(e.target.files?.[0] || null)}
                                    hidden
                                />
                                <button
                                    type="button"
                                    onClick={() => recipeVideoRef.current?.click()}
                                    className="px-4 py-2 rounded-xl bg-orange-400 text-white
                                           hover:bg-orange-500 transition"
                                >
                                    Chọn video
                                </button>

                                {recipeVideoFile && (
                                    <>
                                        <span className="text-sm text-gray-600 truncate max-w-[120px]">
                                            {recipeVideoFile.name}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={handleUploadVideo}
                                            disabled={uploadingVideo}
                                            className="px-4 py-2 rounded-xl bg-green-500 text-white
                                                   hover:bg-green-600 disabled:opacity-50 transition"
                                        >
                                            {uploadingVideo ? 'Đang upload...' : 'Upload'}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ================= Category ================= */}
                <section className="bg-white rounded-2xl shadow-lg p-5">
                    <label className="font-bold text-gray-700 mb-2 block">
                        Danh mục
                    </label>
                    <select
                        value={selectedCategoryId ?? ''}
                        onChange={e => setSelectedCategoryId(Number(e.target.value))}
                        className="w-full p-3 rounded-xl border border-gray-300
                               focus:ring-2 focus:ring-orange-400"
                    >
                        <option value="" disabled>Chọn danh mục</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </section>

                {/* ================= Ingredients ================= */}
                <section className="bg-white rounded-2xl shadow-lg p-5 space-y-4">
                    <h3 className="text-lg font-bold text-gray-800 border-l-4 border-green-500 pl-3">
                        Nguyên liệu
                    </h3>

                    {ingredients.map((ing, idx) => (
                        <div
                            key={ing.id}
                            className="grid grid-cols-1 md:grid-cols-4 gap-2
                                   bg-gray-50 p-3 rounded-xl border"
                        >
                            <input
                                placeholder="Tên nguyên liệu"
                                value={ing.rawName}
                                onChange={e => handleIngredientChange(idx, 'rawName', e.target.value)}
                                className="p-2 rounded-lg border"
                            />
                            <input
                                placeholder="Ghi chú"
                                value={ing.note}
                                onChange={e => handleIngredientChange(idx, 'note', e.target.value)}
                                className="p-2 rounded-lg border"
                            />
                            <input
                                placeholder="Lượng"
                                value={ing.amount}
                                onChange={e => handleIngredientChange(idx, 'amount', e.target.value)}
                                className="p-2 rounded-lg border"
                            />
                            <input
                                placeholder="Đơn vị"
                                value={ing.unit}
                                onChange={e => handleIngredientChange(idx, 'unit', e.target.value)}
                                className="p-2 rounded-lg border"
                            />
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={handleAddIngredient}
                        className="px-4 py-2 rounded-xl bg-green-500 text-white
                               hover:bg-green-600 transition"
                    >
                        + Thêm nguyên liệu
                    </button>
                </section>

                {/* ================= Steps ================= */}
                <section className="bg-white rounded-2xl shadow-lg p-5 space-y-4">
                    <h3 className="text-lg font-bold text-gray-800 border-l-4 border-blue-500 pl-3">
                        Cách làm
                    </h3>

                    {steps.map((step, idx) => (
                        <div
                            key={step.id}
                            className="space-y-3 bg-gray-50 p-4 rounded-xl border"
                        >
                            <textarea
                                rows={2}
                                placeholder={`Bước ${idx + 1}`}
                                value={step.description}
                                onChange={e => handleStepChange(idx, 'description', e.target.value)}
                                className="w-full p-3 rounded-lg border resize-none"
                            />

                            <div>
                                <label className="font-semibold text-gray-700">Thời gian (phút)</label>
                                <input
                                    type="number"
                                    value={step.stepTime}
                                    onChange={e => handleStepChange(idx, "stepTime", Number(e.target.value))}
                                    className="w-full p-2 rounded-lg border"
                                />
                            </div>

                            <input
                                type="file"
                                multiple
                                className="text-sm"
                                onChange={e =>
                                    handleStepChange(idx, 'imageFiles', Array.from(e.target.files || []))
                                }
                            />
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={handleAddStep}
                        className="px-4 py-2 rounded-xl bg-blue-500 text-white
                               hover:bg-blue-600 transition"
                    >
                        + Thêm bước
                    </button>
                </section>

                {/* ================= Status ================= */}
                <section className="bg-white rounded-2xl shadow-lg p-5">
                    <label className="font-bold text-gray-700 mb-2 block">
                        Trạng thái công khai
                    </label>
                    <select
                        value={scope}
                        onChange={e => setScope(e.target.value)}
                        className="w-full p-3 rounded-xl border border-gray-300
                               focus:ring-2 focus:ring-orange-400"
                    >
                        <option value="PUBLIC">Công khai</option>
                        <option value="PRIVATE">Riêng tư</option>
                    </select>
                </section>

                <div className="pt-4">
                    <CustomButton
                        title="Đăng tải"
                        bgVariant="primary"
                        textVariant="primary"
                        onPress={handleSubmit}
                    />
                </div>
            </div>
        </div>
    );

};

export default CreateRecipeScreen;
