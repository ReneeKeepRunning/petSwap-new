// utils/cloudinary.js
export const getOptimizedImage = (url, width) => {
  // 在 /upload/ 后面插入 f_auto,q_auto,w_x,h_y
  // 例如：https://res.cloudinary.com/demo/image/upload/v123/file.png
  // → https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_176,h_264/v123/file.png
  return url.replace(
    '/upload/',
    `/upload/f_auto,q_auto,w_${width}/`
  );
};