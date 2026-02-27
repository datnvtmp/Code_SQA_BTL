// app/seller/dishes/create/page.tsx
'use client';

import Header from '@/components/Common/Header';
import CreateDishForm from '@/components/seller/CreateDishForm';

export default function CreateDishPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-backgroundV1 py-16">
        <CreateDishForm />
      </main>
    </>
  );
}
