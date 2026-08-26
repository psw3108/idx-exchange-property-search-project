import { useEffect, useRef, useState } from 'react';
import './PropertyImageGallery.css';

function PropertyImageGallery({ photos }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const thumbnailRef = useRef(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Lightbox escape key, left/right key handler
  useEffect(() => {
    if (!lightboxOpen || !photos || photos.length === 0) {
      return;
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setLightboxOpen(false);
      }

      if (event.key === 'ArrowLeft') {
        setSelectedIndex((prevIndex) =>
          prevIndex === 0 ? photos.length - 1 : prevIndex - 1
        );
      }

      if (event.key === 'ArrowRight') {
        setSelectedIndex((prevIndex) =>
          prevIndex === photos.length - 1 ? 0 : prevIndex + 1
        );
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxOpen, photos]);

  if (!photos || photos.length === 0) {
    return (
      <div className="property-gallery">
        <img
          className="property-gallery-main"
          src="/placeholder.jpg"
          alt="Property"
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

  return (
    <div className="property-gallery">
      {/* Main image */}
      <div className="property-gallery-main-container">
        <img
          className="property-gallery-main"
          src={selectedPhoto}
          alt={`Property photo ${selectedIndex + 1}`}
          onClick={() => setLightboxOpen(true)}
        />
      </div>

      {/* Thumbnail strip */}
      <div className="property-gallery-thumbnail-container">
        <button
          className="thumbnail-scroll-button thumbnail-scroll-left"
          onClick={() => scrollThumbnails(-1)}
        >
          ‹
        </button>

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
              />
            </button>
          ))}
        </div>

        <button
          className="thumbnail-scroll-button thumbnail-scroll-right"
          onClick={() => scrollThumbnails(1)}
        >
          ›
        </button>
      </div>

      {/* Lightbox on click */}
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