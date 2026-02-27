"use client";

import { useEffect, useState } from 'react';

const DEFAULT_BREAKPOINT = 431;

export default function useMobile(breakpoint: number = DEFAULT_BREAKPOINT) {
	const [isMobile, setIsMobile] = useState(() =>
		typeof window === 'undefined' ? false : window.innerWidth <= breakpoint
	);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		function handleResize() {
			setIsMobile(window.innerWidth <= breakpoint);
		}

		handleResize();
		setIsLoading(false);
		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, [breakpoint]);

	return { isMobile, isLoading };
}

