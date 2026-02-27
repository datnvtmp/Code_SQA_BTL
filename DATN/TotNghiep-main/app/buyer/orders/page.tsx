
import Header from "@components/Common/Header";
import BuyerOrdersPage from "./BuyerOrdersPage";
import { Suspense } from "react";

export default function CreateRecipePage() {
    return (
        (<>
            <Header />
            <main className="w-full overflow-hidden">
                <Suspense fallback={<div>Loading...</div>}>
                    <BuyerOrdersPage />
                </Suspense>
            </main>
        </>
        ))
}