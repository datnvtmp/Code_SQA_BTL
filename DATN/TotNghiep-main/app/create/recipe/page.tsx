'use client';

import Header from '@/components/Common/Header';
import CreateRecipeScreen from '@/components/Screen/Desktop/CreateRecipeScreen';

export default function CreateRecipePage() {

    return (
        (<>
            <Header />
            <main className="w-full pt-16 min-h-screen bg-backgroundV1">
                <CreateRecipeScreen />
            </main>
        </>
        ))
}
