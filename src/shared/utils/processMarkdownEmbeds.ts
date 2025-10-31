export function processMarkdownEmbeds(markdown: string): string {
  let processed = markdown;

  // <YouTube id="Ej6hnsQgV_c" /> → iframe embed
  processed = processed.replace(
    /<YouTube\s+id=["']([^"']+)["']\s*\/?>(?:<\/YouTube>)?/gi,
    (_match, videoId) => {
      return `<div class="youtube-embed-wrapper" data-video-id="${videoId}">
        <iframe 
          src="https://www.youtube.com/embed/${videoId}" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          allowfullscreen
          loading="lazy"
          style="width: 100%; aspect-ratio: 16/9;"
        ></iframe>
      </div>`;
    }
  );

  // <TikTok url="https://www.tiktok.com/@user/video/1234567890" /> → blockquote (скрипт загружается отдельно клиентом)
  processed = processed.replace(
    /<TikTok\s+url=["']([^"']+)["']\s*\/?>(?:<\/TikTok>)?/gi,
    (_match, tiktokUrl) => {
      const videoId = tiktokUrl.match(/\/video\/(\d+)/)?.[1] || '';
      return `<blockquote 
        class="tiktok-embed" 
        cite="${tiktokUrl}" 
        data-video-id="${videoId}"
        style="max-width: 605px; min-width: 325px; border: none; margin: 0; padding: 0;"
      >
        <section></section>
      </blockquote>`;
    }
  );

  return processed;
}


