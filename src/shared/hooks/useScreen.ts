import { useState } from 'react'

export const useScreen = (): number => {
	const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth)
	window.addEventListener('resize', () => {
		setScreenWidth(window.innerWidth)
	})
	return screenWidth
}
