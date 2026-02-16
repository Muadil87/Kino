export const tmdbImage = (path, size = "w500") => {
  if (!path) return "https://via.placeholder.com/500x750?text=No+Image";
  
  // If it's already a full URL, return it
  if (String(path).startsWith('http')) return path;
  
  return `https://image.tmdb.org/t/p/${size}${path}`;
};
