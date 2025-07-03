/**
 * Utility functions to handle UTF-8 encoding issues from WordPress
 */

/**
 * Safely decode HTML entities on both client and server side
 * @param text - The text to decode
 * @returns The decoded text
 */
function decodeHtmlEntities(text: string): string {
  // Use regex-based decoding for both client and server
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/&#x60;/g, '`')
    .replace(/&#x3D;/g, '=')
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
    .replace(/&bull;/g, '•');
}

/**
 * Decode HTML entities and fix UTF-8 encoding issues
 * @param text - The text to process
 * @returns The cleaned text
 */
export function decodeWordPressText(text: string): string {
  if (!text || typeof text !== 'string') {
    return text;
  }

  try {
    // First, decode HTML entities
    let decodedText = decodeHtmlEntities(text);

    // Fix common UTF-8 encoding issues
    decodedText = decodedText
      // Fix common encoding issues
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
      .replace(/Ã /g, 'à')
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
      .replace(/â€"/g, '"')
      .replace(/â€¦/g, '…')
      .replace(/â€"|â€"/g, '—')
      .replace(/â€¢/g, '•')
      // Fix additional encoding issues
      .replace(/Ã‰/g, 'É')
      .replace(/Ã€/g, 'À')
      .replace(/Ã‚/g, 'Â')
      .replace(/ÃŠ/g, 'Ê')
      .replace(/ÃŽ/g, 'Î')
      .replace(/Ã"|Ã"/g, 'Ô')
      .replace(/Ã™/g, 'Ù')
      .replace(/Ã›/g, 'Û')
      .replace(/Ã‡/g, 'Ç')
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
      .replace(/Ã¦/g, 'æ');

    return decodedText;
  } catch (error) {
    console.warn('Error in decodeWordPressText:', error);
    return text; // Return original text if processing fails
  }
}

/**
 * Process WordPress data recursively to fix encoding issues
 * @param data - The data to process (can be any type)
 * @returns The processed data
 */
export function processWordPressData(data: any): any {
  try {
    if (data === null || data === undefined) {
      return data;
    }

    if (typeof data === 'string') {
      return decodeWordPressText(data);
    }

    if (Array.isArray(data)) {
      return data.map(item => processWordPressData(item));
    }

    if (typeof data === 'object') {
      const processed: any = {};
      for (const [key, value] of Object.entries(data)) {
        processed[key] = processWordPressData(value);
      }
      return processed;
    }

    return data;
  } catch (error) {
    console.warn('Error processing WordPress data:', error);
    // Return original data if processing fails
    return data;
  }
}

/**
 * Clean WordPress content by removing HTML tags and fixing encoding
 * @param content - The WordPress content
 * @returns Clean text content
 */
export function cleanWordPressContent(content: string): string {
  if (!content || typeof content !== 'string') {
    return '';
  }

  // First decode the text
  let cleaned = decodeWordPressText(content);

  // Remove HTML tags
  cleaned = cleaned.replace(/<[^>]*>/g, '');

  // Remove extra whitespace
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  return cleaned;
}

/**
 * Extract text content from WordPress HTML content
 * @param htmlContent - The HTML content from WordPress
 * @returns Clean text without HTML tags
 */
export function extractTextFromWordPress(htmlContent: string): string {
  if (!htmlContent || typeof htmlContent !== 'string') {
    return '';
  }

  // First decode any encoding issues
  let text = decodeWordPressText(htmlContent);

  // Remove HTML tags but preserve line breaks
  text = text
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ');

  // Clean up whitespace
  text = text
    .replace(/\n\s*\n/g, '\n') // Remove empty lines
    .replace(/^\s+|\s+$/g, '') // Trim start and end
    .replace(/\n\s+|\s+\n/g, '\n'); // Clean up line breaks

  return text;
}

/**
 * Safe text processing for display (handles both client and server side)
 * @param text - The text to process
 * @returns The processed text safe for display
 */
export function safeTextDisplay(text: string): string {
  if (!text || typeof text !== 'string') {
    return '';
  }

  try {
    // Always decode HTML entities first
    let processed = decodeHtmlEntities(text);

    // Then fix UTF-8 encoding issues
    processed = decodeWordPressText(processed);

    return processed;
  } catch (error) {
    console.warn('Error processing WordPress text:', error);
    // Return original text if processing fails
    return text;
  }
} 