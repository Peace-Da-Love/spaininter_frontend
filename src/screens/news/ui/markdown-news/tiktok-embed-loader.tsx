'use client'

import { useEffect } from 'react'

export const TikTokEmbedLoader = () => {
	useEffect(() => {
		const src = 'https://www.tiktok.com/embed.js'
		if (document.querySelector(`script[src="${src}"]`)) return
		const script = document.createElement('script')
		script.src = src
		script.async = true
		document.body.appendChild(script)
	}, [])
	return null
}
