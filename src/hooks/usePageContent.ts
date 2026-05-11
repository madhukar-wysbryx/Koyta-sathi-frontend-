import { useEffect, useState } from 'react';

/**
 * Hook to extract readable text content from the current page
 * Filters out navigation, buttons, and other non-content elements
 */
export const usePageContent = () => {
  const [content, setContent] = useState('');

  useEffect(() => {
    const extractContent = () => {
      // Get main content area
      const main = document.querySelector('main');
      if (!main) return '';

      // Clone to avoid modifying DOM
      const clone = main.cloneNode(true) as HTMLElement;

      // Remove elements that shouldn't be read
      const selectorsToRemove = [
        'button',
        'nav',
        'script',
        'style',
        'svg',
        '.tts-ignore',
        '[aria-hidden="true"]',
      ];

      selectorsToRemove.forEach(selector => {
        clone.querySelectorAll(selector).forEach(el => el.remove());
      });

      // Extract text
      let text = clone.innerText || clone.textContent || '';

      // Clean up whitespace
      text = text
        .replace(/\s+/g, ' ')
        .replace(/\n+/g, '. ')
        .trim();

      return text;
    };

    setContent(extractContent());

    // Re-extract when content changes
    const observer = new MutationObserver(() => {
      setContent(extractContent());
    });

    const main = document.querySelector('main');
    if (main) {
      observer.observe(main, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }

    return () => observer.disconnect();
  }, []);

  return content;
};
