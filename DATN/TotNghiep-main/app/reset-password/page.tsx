
import Header from "@components/Common/Header";
import ResetPasswordScreen from "./ResetPasswordScreen";
import { Suspense } from "react";

export default function CreateRecipePage() {
    return (
        (<>
            <Header />
            <main className="w-full overflow-hidden">
                <Suspense fallback={<div>Loading...</div>}>
                    <ResetPasswordScreen />
                </Suspense>

            </main>
        </>
        ))
}