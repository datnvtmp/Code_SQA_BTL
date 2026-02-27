import { Suspense } from 'react';
import RecipesClient from './RecipesClient';

export default function RecipesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RecipesClient />
    </Suspense>
  );
}
