import { useMemo } from 'react';

/**
 * Hook to process WordPress text content with proper encoding
 */
export function useWordPressText(text: string | null | undefined, options?: {
  removeHtml?: boolean;
  cleanContent?: boolean;
}) {
  return useMemo(() => {
    if (!text || typeof text !== 'string') {
      return '';
    }

    try {
      const { removeHtml = false, cleanContent = false } = options || {};

      let processed = text
        // Decode HTML entities
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&nbsp;/g, ' ')
        .replace(/&copy;/g, '©')
        .replace(/&reg;/g, '®')
        .replace(/&trade;/g, '™')
        .replace(/&euro;/g, '€')
        .replace(/&pound;/g, '£')
        .replace(/&cent;/g, '¢')
        .replace(/&deg;/g, '°')
        .replace(/&apos;/g, "'")
        .replace(/&ldquo;/g, '"')
        .replace(/&rdquo;/g, '"')
        .replace(/&lsquo;/g, "'")
        .replace(/&rsquo;/g, "'")
        .replace(/&mdash;/g, '—')
        .replace(/&ndash;/g, '–')
        .replace(/&hellip;/g, '…')
        .replace(/&bull;/g, '•')
        // Fix common UTF-8 encoding issues
        .replace(/Ã©/g, 'é')
        .replace(/Ã¨/g, 'è')
        .replace(/Ã /g, 'à')
        .replace(/Ã¢/g, 'â')
        .replace(/Ãª/g, 'ê')
        .replace(/Ã®/g, 'î')
        .replace(/Ã´/g, 'ô')
        .replace(/Ã¹/g, 'ù')
        .replace(/Ã»/g, 'û')
        .replace(/Ã§/g, 'ç')
        .replace(/Ã¡/g, 'á')
        .replace(/Ã­/g, 'í')
        .replace(/Ã³/g, 'ó')
        .replace(/Ãº/g, 'ú')
        .replace(/Ã±/g, 'ñ')
        .replace(/Ã¼/g, 'ü')
        .replace(/Ã¶/g, 'ö')
        .replace(/Ã¤/g, 'ä')
        .replace(/Ã¥/g, 'å')
        .replace(/Ã¸/g, 'ø')
        .replace(/Ã¦/g, 'æ')
        .replace(/Ã†/g, 'Æ')
        .replace(/Ã˜/g, 'Ø')
        .replace(/Ã…/g, 'Å')
        .replace(/Ã‰/g, 'É')
        .replace(/Ã€/g, 'À')
        .replace(/Ã‚/g, 'Â')
        .replace(/ÃŠ/g, 'Ê')
        .replace(/ÃŽ/g, 'Î')
        .replace(/Ã"|Ã"/g, 'Ô')
        .replace(/Ã™/g, 'Ù')
        .replace(/Ã›/g, 'Û')
        .replace(/Ã‡/g, 'Ç')
        // Fix other common issues
        .replace(/â€™/g, "'")
        .replace(/â€œ/g, '"')
        .replace(/â€/g, '"')
        .replace(/â€"|â€"/g, '—')
        .replace(/â€¦/g, '…')
        .replace(/â€¢/g, '•')
        .replace(/â€"/g, '"')
        .replace(/â€"/g, '"')
        .replace(/â€˜/g, "'")
        .replace(/â€™/g, "'")
        .replace(/â€"/g, '"')
        .replace(/â€"/g, '"');

      if (cleanContent) {
        // Remove HTML tags and clean up
        processed = processed
          .replace(/<[^>]*>/g, '')
          .replace(/\s+/g, ' ')
          .trim();
      }

      if (removeHtml) {
        // Remove HTML tags but preserve line breaks
        processed = processed
          .replace(/<br\s*\/?>/gi, '\n')
          .replace(/<\/p>/gi, '\n')
          .replace(/<[^>]*>/g, '')
          .replace(/&nbsp;/g, ' ')
          .replace(/\n\s*\n/g, '\n')
          .replace(/^\s+|\s+$/g, '')
          .replace(/\n\s+|\s+\n/g, '\n');
      }

      return processed;
    } catch (error) {
      console.error('Error processing WordPress text:', error);
      return text || '';
    }
  }, [text, options]);
}

/**
 * Hook to process WordPress HTML content and extract clean text
 */
export function useWordPressContent(content: string | null | undefined) {
  return useMemo(() => {
    if (!content || typeof content !== 'string') {
      return '';
    }

    try {
      let processed = content
        // Decode HTML entities
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&nbsp;/g, ' ')
        .replace(/&copy;/g, '©')
        .replace(/&reg;/g, '®')
        .replace(/&trade;/g, '™')
        .replace(/&euro;/g, '€')
        .replace(/&pound;/g, '£')
        .replace(/&cent;/g, '¢')
        .replace(/&deg;/g, '°')
        .replace(/&apos;/g, "'")
        .replace(/&ldquo;/g, '"')
        .replace(/&rdquo;/g, '"')
        .replace(/&lsquo;/g, "'")
        .replace(/&rsquo;/g, "'")
        .replace(/&mdash;/g, '—')
        .replace(/&ndash;/g, '–')
        .replace(/&hellip;/g, '…')
        .replace(/&bull;/g, '•')
        // Fix common UTF-8 encoding issues
        .replace(/Ã©/g, 'é')
        .replace(/Ã¨/g, 'è')
        .replace(/Ã /g, 'à')
        .replace(/Ã¢/g, 'â')
        .replace(/Ãª/g, 'ê')
        .replace(/Ã®/g, 'î')
        .replace(/Ã´/g, 'ô')
        .replace(/Ã¹/g, 'ù')
        .replace(/Ã»/g, 'û')
        .replace(/Ã§/g, 'ç')
        .replace(/Ã¡/g, 'á')
        .replace(/Ã­/g, 'í')
        .replace(/Ã³/g, 'ó')
        .replace(/Ãº/g, 'ú')
        .replace(/Ã±/g, 'ñ')
        .replace(/Ã¼/g, 'ü')
        .replace(/Ã¶/g, 'ö')
        .replace(/Ã¤/g, 'ä')
        .replace(/Ã¥/g, 'å')
        .replace(/Ã¸/g, 'ø')
        .replace(/Ã¦/g, 'æ')
        .replace(/Ã†/g, 'Æ')
        .replace(/Ã˜/g, 'Ø')
        .replace(/Ã…/g, 'Å')
        .replace(/Ã‰/g, 'É')
        .replace(/Ã€/g, 'À')
        .replace(/Ã‚/g, 'Â')
        .replace(/ÃŠ/g, 'Ê')
        .replace(/ÃŽ/g, 'Î')
        .replace(/Ã"|Ã"/g, 'Ô')
        .replace(/Ã™/g, 'Ù')
        .replace(/Ã›/g, 'Û')
        .replace(/Ã‡/g, 'Ç')
        // Fix other common issues
        .replace(/â€™/g, "'")
        .replace(/â€œ/g, '"')
        .replace(/â€/g, '"')
        .replace(/â€"|â€"/g, '—')
        .replace(/â€¦/g, '…')
        .replace(/â€¢/g, '•')
        .replace(/â€"/g, '"')
        .replace(/â€"/g, '"')
        .replace(/â€˜/g, "'")
        .replace(/â€™/g, "'")
        .replace(/â€"/g, '"')
        .replace(/â€"/g, '"');

      // Remove HTML tags but preserve line breaks
      processed = processed
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/p>/gi, '\n')
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/\n\s*\n/g, '\n')
        .replace(/^\s+|\s+$/g, '')
        .replace(/\n\s+|\s+\n/g, '\n');

      return processed;
    } catch (error) {
      console.error('Error processing WordPress content:', error);
      return content || '';
    }
  }, [content]);
}

/**
 * Hook to safely display WordPress text (handles encoding issues)
 */
export function useSafeWordPressText(text: string | null | undefined) {
  return useMemo(() => {
    // Early return for falsy values
    if (!text || typeof text !== 'string') {
      return '';
    }

    try {
      // Inline processing to avoid function call issues
      return text
        // Decode HTML entities
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&nbsp;/g, ' ')
        .replace(/&copy;/g, '©')
        .replace(/&reg;/g, '®')
        .replace(/&trade;/g, '™')
        .replace(/&euro;/g, '€')
        .replace(/&pound;/g, '£')
        .replace(/&cent;/g, '¢')
        .replace(/&deg;/g, '°')
        .replace(/&apos;/g, "'")
        .replace(/&ldquo;/g, '"')
        .replace(/&rdquo;/g, '"')
        .replace(/&lsquo;/g, "'")
        .replace(/&rsquo;/g, "'")
        .replace(/&mdash;/g, '—')
        .replace(/&ndash;/g, '–')
        .replace(/&hellip;/g, '…')
        .replace(/&bull;/g, '•')
        // Fix common UTF-8 encoding issues
        .replace(/Ã©/g, 'é')
        .replace(/Ã¨/g, 'è')
        .replace(/Ã /g, 'à')
        .replace(/Ã¢/g, 'â')
        .replace(/Ãª/g, 'ê')
        .replace(/Ã®/g, 'î')
        .replace(/Ã´/g, 'ô')
        .replace(/Ã¹/g, 'ù')
        .replace(/Ã»/g, 'û')
        .replace(/Ã§/g, 'ç')
        .replace(/Ã¡/g, 'á')
        .replace(/Ã­/g, 'í')
        .replace(/Ã³/g, 'ó')
        .replace(/Ãº/g, 'ú')
        .replace(/Ã±/g, 'ñ')
        .replace(/Ã¼/g, 'ü')
        .replace(/Ã¶/g, 'ö')
        .replace(/Ã¤/g, 'ä')
        .replace(/Ã¥/g, 'å')
        .replace(/Ã¸/g, 'ø')
        .replace(/Ã¦/g, 'æ')
        .replace(/Ã†/g, 'Æ')
        .replace(/Ã˜/g, 'Ø')
        .replace(/Ã…/g, 'Å')
        .replace(/Ã‰/g, 'É')
        .replace(/Ã€/g, 'À')
        .replace(/Ã‚/g, 'Â')
        .replace(/ÃŠ/g, 'Ê')
        .replace(/ÃŽ/g, 'Î')
        .replace(/Ã"|Ã"/g, 'Ô')
        .replace(/Ã™/g, 'Ù')
        .replace(/Ã›/g, 'Û')
        .replace(/Ã‡/g, 'Ç')
        // Fix other common issues
        .replace(/â€™/g, "'")
        .replace(/â€œ/g, '"')
        .replace(/â€/g, '"')
        .replace(/â€"|â€"/g, '—')
        .replace(/â€¦/g, '…')
        .replace(/â€¢/g, '•')
        .replace(/â€"/g, '"')
        .replace(/â€"/g, '"')
        .replace(/â€˜/g, "'")
        .replace(/â€™/g, "'")
        .replace(/â€"/g, '"')
        .replace(/â€"/g, '"');
    } catch (error) {
      console.error('Error processing WordPress text:', error);
      return text || '';
    }
  }, [text]);
} 