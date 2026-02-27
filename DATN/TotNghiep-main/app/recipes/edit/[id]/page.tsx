'use client';

import { useParams } from 'next/navigation';
import Header from '@/components/Common/Header';
import UpdateRecipeScreen from '@components/Screen/Desktop/UpdateRecipeScreen';

export default function EditRecipePage() {
    const params = useParams();
    const recipeId = Number(params.id); // id = 1

    return (
        <>
            <Header />
            <main className="w-full pt-16 min-h-screen bg-backgroundV1">
                <UpdateRecipeScreen recipeId={recipeId} />
            </main>
        </>
    );
}
