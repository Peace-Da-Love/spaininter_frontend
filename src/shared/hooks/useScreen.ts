import { useEffect, useState } from 'react';

export const useScreen = (): number => {
	const [screenWidth, setScreenWidth] = useState<number>(0);
	useEffect(() => {
		if (typeof window !== undefined) {
			setScreenWidth(window.innerWidth);
			window.addEventListener('resize', () => {
				setScreenWidth(window.innerWidth);
			});
		}
	}, []);

	return screenWidth;
};
