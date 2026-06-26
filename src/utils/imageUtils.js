/**
 * Robust Image/Video URL Construction
 * @param {string} path - The relative or absolute path to the media file.
 * @returns {string} - The complete URL to the media file.
 */
export const getImageUrl = (path) => {
  if (!path) return "/products/default.jpg";
  
  // If it's already a full URL or a blob preview, return as is
  if (path.startsWith("http") || path.startsWith("blob:")) return path;
  
  // Get base URL from environment or fallback to Render backend
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://backend-60eg.onrender.com";
  
  // Normalize path: replace backslashes (Windows) with forward slashes
  let normalizedPath = path.replace(/\\/g, "/");
  
  // Ensure exactly one slash between baseUrl and normalizedPath
  const cleanBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const cleanPath = normalizedPath.startsWith("/") ? normalizedPath : `/${normalizedPath}`;
  
  return `${cleanBase}${cleanPath}`;
};
