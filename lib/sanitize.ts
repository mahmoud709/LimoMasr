/**
 * Basic HTML sanitizer.
 * 
 * WARNING: This is a fallback regex-based sanitizer because we couldn't install
 * `isomorphic-dompurify` in the automated environment. Regex-based sanitization
 * is NOT fully secure against advanced XSS. 
 * 
 * PLEASE RUN: `npm install isomorphic-dompurify`
 * and update this file to use it for real production security.
 */

export function sanitizeHtml(html: string): string {
  if (!html) return "";
  
  let clean = html;
  
  // Remove <script> tags and their content
  clean = clean.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  
  // Remove inline event handlers (onclick, onload, etc.)
  clean = clean.replace(/\bon\w+\s*=\s*(['"])(?:(?!\1).)*\1/gi, "");
  clean = clean.replace(/\bon\w+\s*=\s*[^>\s]+/gi, "");
  
  // Remove javascript: URIs
  clean = clean.replace(/href\s*=\s*(['"])javascript:.*?\1/gi, "href=\"#\"");
  
  return clean;
}
