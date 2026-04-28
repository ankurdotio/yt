export async function fetchImageFromURL(url) {
  const response = await fetch(url);
  const mimeType = response.headers.get('content-type');
  if (!mimeType || !mimeType.startsWith('image/')) {
    throw new Error(`URL does not point to a valid image: ${url}`);
  }
  const imageArrayBuffer = await response.arrayBuffer();
  const base64ImageData = Buffer.from(imageArrayBuffer).toString('base64');
  return {
    mimeType,
    data: base64ImageData
  };
}
