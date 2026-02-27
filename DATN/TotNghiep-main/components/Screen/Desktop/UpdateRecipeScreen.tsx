'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import BackHeader from '../../Common/BackHeader';
import CustomButton from '../../Common/CustomButton';
import { useAuthStore } from '@/store/useAuthStore';

/* ================= TYPES ================= */
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
    imageUrls?: string[];
}

interface Category {
    id: number;
    name: string;
}

interface UpdateRecipeScreenProps {
    recipeId: number;
}

/* ================= COMPONENT ================= */
const UpdateRecipeScreen = ({ recipeId }: UpdateRecipeScreenProps) => {
    const router = useRouter();
    const token = useAuthStore.getState().token;

    /* ===== Recipe Info ===== */
    const [recipeName, setRecipeName] = useState('');
    const [recipeDescription, setRecipeDescription] = useState('');
    const [portion, setPortion] = useState(1);
    const [prepTime, setPrepTime] = useState('');
    const [cookTime, setCookTime] = useState('');
    const [difficulty, setDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>('EASY');
    const [scope, setScope] = useState<'PUBLIC' | 'PRIVATE'>('PUBLIC');

    const [recipeImageFile, setRecipeImageFile] = useState<File | null>(null);
    const [recipeVideoFile, setRecipeVideoFile] = useState<File | null>(null);
    const [videoUrl, setVideoUrl] = useState('');
    const [uploadingVideo, setUploadingVideo] = useState(false);

    /* ===== Ingredients & Steps ===== */
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [steps, setSteps] = useState<Step[]>([]);

    /* ===== Categories ===== */
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

    const recipeImageRef = useRef<HTMLInputElement>(null);
    const recipeVideoRef = useRef<HTMLInputElement>(null);

    /* ================= FETCH CATEGORY ================= */
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_HOST}/api/categories?page=0&size=50`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const json = await res.json();
                setCategories(json.data?.content || json.data || []);
            } catch {
                setCategories([]);
            }
        };
        fetchCategories();
    }, [token]);

    /* ================= FETCH RECIPE DETAIL ================= */
    useEffect(() => {
        if (!recipeId) return;

        const fetchRecipe = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_HOST}/api/recipes/${recipeId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (!res.ok) throw new Error();

                const { data } = await res.json();

                setRecipeName(data.title || '');
                setRecipeDescription(data.description || '');
                setPortion(data.servings || 1);
                setPrepTime(String(data.prepTime || 0));
                setCookTime(String(data.cookTime || 0));
                setDifficulty(data.difficulty || 'EASY');
                setScope(data.scope || 'PUBLIC');
                setVideoUrl(data.videoUrl || '');

                if (data.categories?.length) {
                    setSelectedCategoryId(data.categories[0].id);
                }

                setIngredients(
                    data.ingredients.map((i: any, idx: number) => ({
                        id: `ing-${idx}`,
                        rawName: i.rawName,
                        note: i.note || '',
                        amount: String(i.quantity),
                        unit: i.unit,
                    }))
                );

                setSteps(
                    data.steps.map((s: any, idx: number) => ({
                        id: `step-${idx}`,
                        step: `Bước ${s.stepNumber}`,
                        description: s.description,
                        stepTime: s.stepTime || 0,
                        imageFiles: [],
                        imageUrls: s.imageUrls || [],
                    }))
                );
            } catch {
                alert('Không tải được dữ liệu công thức');
            }
        };

        fetchRecipe();
    }, [recipeId, token]);

    /* ================= HANDLERS ================= */
    const handleAddIngredient = () =>
        setIngredients([...ingredients, { id: Date.now().toString(), rawName: '', note: '', amount: '', unit: '' }]);

    const handleIngredientChange = (index: number, field: keyof Ingredient, value: string) => {
        const clone = [...ingredients];
        clone[index][field] = value as any;
        setIngredients(clone);
    };

    const handleAddStep = () =>
        setSteps([...steps, { id: Date.now().toString(), step: `Bước ${steps.length + 1}`, description: '', stepTime: 0, imageFiles: [] }]);

    const handleStepChange = <K extends keyof Step>(
        index: number,
        field: K,
        value: Step[K]
    ) => {
        setSteps(prev => {
            const clone = [...prev];
            clone[index] = {
                ...clone[index],
                [field]: value,
            };
            return clone;
        });
    };


    const handleUploadVideo = async () => {
        if (!recipeVideoFile) return;
        setUploadingVideo(true);

        const formData = new FormData();
        formData.append('file', recipeVideoFile);

        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_HOST}/api/upload/video`,
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setVideoUrl(res.data.data);
            alert('Upload video thành công');
        } catch {
            alert('Upload video thất bại');
        } finally {
            setUploadingVideo(false);
        }
    };

    const handleSubmit = async () => {
        const formData = new FormData();

        formData.append('title', recipeName);
        formData.append('description', recipeDescription);
        formData.append('servings', String(portion));
        formData.append('prepTime', prepTime);
        formData.append('cookTime', cookTime);
        formData.append('difficulty', difficulty); // FIX BACKEND
        formData.append('scope', scope);

        if (recipeImageFile) formData.append('image', recipeImageFile);
        if (videoUrl) formData.append('videoUrl', videoUrl);
        if (selectedCategoryId) formData.append('categoryIds', String(selectedCategoryId));

        ingredients.forEach((i, idx) => {
            formData.append(`recipeIngredients[${idx}].rawName`, i.rawName);
            formData.append(`recipeIngredients[${idx}].note`, i.note);
            formData.append(`recipeIngredients[${idx}].quantity`, i.amount);
            formData.append(`recipeIngredients[${idx}].unit`, i.unit);
            formData.append(`recipeIngredients[${idx}].displayOrder`, String(idx + 1));
        });

        steps.forEach((s, idx) => {
            formData.append(`steps[${idx}].stepNumber`, String(idx + 1));
            formData.append(`steps[${idx}].description`, s.description);
            formData.append(`steps[${idx}].stepTime`, String(s.stepTime));
            s.imageFiles.forEach((f, j) => {
                formData.append(`steps[${idx}].images[${j}]`, f);
            });
        });

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_HOST}/api/recipes/${recipeId}`,
                {
                    method: 'PUT',
                    headers: { Authorization: `Bearer ${token}` },
                    body: formData,
                }
            );
            if (!res.ok) throw new Error();
            alert('Cập nhật công thức thành công');
            router.back();
        } catch {
            alert('Cập nhật thất bại');
        }
    };

    /* ================= UI ================= */
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <BackHeader headerTitle="Cập nhật công thức món ăn" onPress={() => router.back()} />

            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">

                {/* Recipe Info */}
                <div className="bg-white p-4 rounded-lg shadow-md space-y-4">
                    <label className="font-bold text-gray-700">Tên món ăn</label>
                    <input value={recipeName} onChange={e => setRecipeName(e.target.value)} className="w-full p-3 border rounded-lg" />

                    <label className="font-bold text-gray-700">Mô tả món ăn</label>
                    <textarea rows={4} value={recipeDescription} onChange={e => setRecipeDescription(e.target.value)} className="w-full p-3 border rounded-lg resize-none" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="font-bold text-gray-700">Thời gian chuẩn bị (phút)</label>
                            <input type="number" value={prepTime} onChange={e => setPrepTime(e.target.value)} className="w-full p-2 border rounded-lg" />
                        </div>
                        <div>
                            <label className="font-bold text-gray-700">Thời gian nấu (phút)</label>
                            <input type="number" value={cookTime} onChange={e => setCookTime(e.target.value)} className="w-full p-2 border rounded-lg" />
                        </div>
                    </div>
                </div>

                {/* Difficulty */}
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <label className="font-bold text-gray-700 block mb-2">Độ khó</label>
                    <select value={difficulty} onChange={e => setDifficulty(e.target.value as any)} className="w-full p-3 border rounded-lg">
                        <option value="EASY">Dễ</option>
                        <option value="MEDIUM">Trung bình</option>
                        <option value="HARD">Khó</option>
                    </select>
                </div>

                {/* Category */}
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <label className="font-bold text-gray-700 block mb-2">Danh mục</label>
                    <select value={selectedCategoryId ?? ''} onChange={e => setSelectedCategoryId(Number(e.target.value))} className="w-full p-3 border rounded-lg">
                        <option value="" disabled>Chọn danh mục</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>

                {/* Ingredients */}
                <div className="bg-white p-4 rounded-lg shadow-md space-y-4">
                    <h3 className="font-bold text-gray-700 text-lg">Nguyên liệu</h3>
                    {ingredients.map((ing, idx) => (
                        <div key={ing.id} className="grid grid-cols-1 md:grid-cols-4 gap-2">
                            <input placeholder="Tên nguyên liệu" value={ing.rawName} onChange={e => handleIngredientChange(idx, 'rawName', e.target.value)} className="p-2 border rounded-lg" />
                            <input placeholder="Ghi chú" value={ing.note} onChange={e => handleIngredientChange(idx, 'note', e.target.value)} className="p-2 border rounded-lg" />
                            <input placeholder="Số lượng" value={ing.amount} onChange={e => handleIngredientChange(idx, 'amount', e.target.value)} className="p-2 border rounded-lg" />
                            <input placeholder="Đơn vị" value={ing.unit} onChange={e => handleIngredientChange(idx, 'unit', e.target.value)} className="p-2 border rounded-lg" />
                        </div>
                    ))}
                    <button onClick={handleAddIngredient} className="px-4 py-2 bg-green-500 text-white rounded-lg">Thêm nguyên liệu</button>
                </div>

                {/* Steps */}
                <div className="bg-white p-4 rounded-lg shadow-md space-y-4">
                    <h3 className="font-bold text-gray-700 text-lg">Cách làm</h3>
                    {steps.map((step, idx) => (
                        <div key={step.id} className="border p-3 rounded space-y-2">
                            <label className="font-bold text-gray-700">Bước {idx + 1}</label>
                            <textarea value={step.description} onChange={e => handleStepChange(idx, 'description', e.target.value)} className="w-full p-2 border rounded-lg resize-none" />
                        </div>
                    ))}
                    <button onClick={handleAddStep} className="px-4 py-2 bg-blue-500 text-white rounded-lg">Thêm bước</button>
                </div>

                {/* Scope */}
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <label className="font-bold text-gray-700 block mb-2">Trạng thái công khai</label>
                    <select value={scope} onChange={e => setScope(e.target.value as any)} className="w-full p-3 border rounded-lg">
                        <option value="PUBLIC">Công khai</option>
                        <option value="PRIVATE">Riêng tư</option>
                    </select>
                </div>

                <CustomButton title="Update" bgVariant="primary" textVariant="primary" onPress={handleSubmit} />
            </div>
        </div>
    );
};

export default UpdateRecipeScreen;
