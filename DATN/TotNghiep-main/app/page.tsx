'use client';

import Header from '@/components/Common/Header';
import HomeScreen from '@/components/Screen/Desktop/HomeScreen';
import MobileHomeScreen from '@/components/Screen/Mobile/MobileHomeScreen';
import Loading from '@/components/Common/Loading';
import useMobile from '@/hooks/useMobile';

export default function HomePage() {
	const { isMobile, isLoading } = useMobile();
	if (isLoading) {
		return <Loading />;
	}

	return (
		isMobile ? (<MobileHomeScreen />) : (<>
			<Header />
			<main className="w-full pt-16 min-h-screen">
				<HomeScreen />
			</main>
		</>
		))
}
