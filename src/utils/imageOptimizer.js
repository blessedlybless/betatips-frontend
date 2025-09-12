import imageCompression from 'browser-image-compression';

export const optimizeImage = async (file, options = {}) => {
  const defaultOptions = {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: 'image/webp'
  };

  const finalOptions = { ...defaultOptions, ...options };

  try {
    const compressedFile = await imageCompression(file, finalOptions);
    return compressedFile;
  } catch (error) {
    console.error('Image compression error:', error);
    return file; // Return original if compression fails
  }
};
