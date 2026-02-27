
import Header from "@components/Common/Header";
import { Suspense } from "react";
import EditDishPage from "./EditDishPage";

export default function CreateRecipePage() {
    return (
        (<>
            <Header />
            <main className="w-full overflow-hidden">
                <Suspense fallback={<div>Loading...</div>}>
                    <EditDishPage />
                </Suspense>

            </main>
        </>
        ))
}