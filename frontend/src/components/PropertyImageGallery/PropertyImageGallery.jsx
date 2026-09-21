import { useEffect, useRef, useState } from 'react';
import './PropertyImageGallery.css';

function PropertyImageGallery({ photos }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const thumbnailRef = useRef(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  function handleImageError(event) {
    event.currentTarget.onerror = null;
    event.currentTarget.src = '/placeholder.jpg';
  }

  if (!photos || photos.length === 0) {
    return (
      <div className="property-gallery">
        <img
          className="property-gallery-main"
          src="/noimage.jpg"
          alt="No property image available"
        />
      </div>
    );
  }

  const selectedPhoto = photos[selectedIndex];

  function scrollThumbnails(direction) {
    const amount = 400;

    thumbnailRef.current?.scrollBy({
      left: direction * amount,
      behavior: 'smooth',
    });
  }

  function showPreviousImage() {
    setSelectedIndex((prevIndex) =>
      prevIndex === 0 ? photos.length - 1 : prevIndex - 1
    );
  }

  function showNextImage() {
    setSelectedIndex((prevIndex) =>
      prevIndex === photos.length - 1 ? 0 : prevIndex + 1
    );
  }

  useEffect(() => {
    if (!lightboxOpen) {
      return;
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setLightboxOpen(false);
      }

      if (event.key === 'ArrowLeft') {
        showPreviousImage();
      }

      if (event.key === 'ArrowRight') {
        showNextImage();
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxOpen, photos.length]);

  return (
    <div className="property-gallery">
      {/* Main image */}
      <div className="property-gallery-main-container">
        <img
          className={`property-gallery-main ${
            selectedPhoto === '/placeholder.jpg' || selectedPhoto === '/noimage.jpg'
              ? 'placeholder-image'
              : ''
          }`}
          src={selectedPhoto}
          alt={`Property photo ${selectedIndex + 1}`}
          onClick={() => setLightboxOpen(true)}
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = '/placeholder.jpg';
            event.currentTarget.classList.add('placeholder-image');
          }}
        />
      </div>

      {/* Thumbnail strip */}
      {photos.length > 1 && (
        <div className="property-gallery-thumbnail-container">

          {photos.length > 6 && (
            <button
              className="thumbnail-scroll-button thumbnail-scroll-left"
              onClick={() => scrollThumbnails(-1)}
            >
              ‹
            </button>
          )}

          <div
            className="property-gallery-thumbnails"
            ref={thumbnailRef}
          >
            {photos.map((photo, index) => (
              <button
                key={index}
                className={`property-gallery-thumbnail-button ${
                  index === selectedIndex ? 'active' : ''
                }`}
                onClick={() => setSelectedIndex(index)}
              >
                <img
                  className="property-gallery-thumbnail"
                  src={photo}
                  alt={`Property thumbnail ${index + 1}`}
                  onError={handleImageError}
                />
              </button>
            ))}
          </div>

          {photos.length > 6 && (
            <button
              className="thumbnail-scroll-button thumbnail-scroll-right"
              onClick={() => scrollThumbnails(1)}
            >
              ›
            </button>
          )}

        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="property-lightbox">
          <button
            className="property-lightbox-close"
            onClick={() => setLightboxOpen(false)}
          >
            ×
          </button>

          {photos.length > 1 && (
            <button
              className="property-lightbox-nav property-lightbox-prev"
              onClick={showPreviousImage}
            >
              ‹
            </button>
          )}

          <img
            className="property-lightbox-image"
            src={selectedPhoto}
            alt={`Property photo ${selectedIndex + 1}`}
            onError={handleImageError}
          />

          {photos.length > 1 && (
            <button
              className="property-lightbox-nav property-lightbox-next"
              onClick={showNextImage}
            >
              ›
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default PropertyImageGallery;