export function parsePhotos(photoData) {
  if (!photoData) {
    return [];
  }

  let photos = [];

  try {
    const parsedPhotos = JSON.parse(photoData);

    if (Array.isArray(parsedPhotos)) {
      photos = parsedPhotos;
    }
  } catch (error) {
    console.error('Could not parse property photos:', error);
  }

  return photos;
}