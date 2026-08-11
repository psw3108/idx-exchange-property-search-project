import { useState } from "react";
import "./PropertyImageCarousel.css";

const PropertyImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const hasImages = Array.isArray(images) && images.length > 0;
  const hasMultipleImages = hasImages && images.length > 1;

  const prevSlide = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const imageUrl = hasImages ? images[currentIndex] : "/placeholder.jpg";

  return (
    <div className="property-image-carousel">

      <img
        className="property-card-image"
        src={imageUrl}
        alt="Property"
        onError={(event) => {
          event.currentTarget.onerror = null;
          event.currentTarget.src = "/placeholder.jpg";
        }}
      />

      {hasMultipleImages && (
        <>
          <button
            type="button"
            className="carousel-btn prev-btn"
            onClick={prevSlide}
          >
            &#10094;
          </button>

          <button
            type="button"
            className="carousel-btn next-btn"
            onClick={nextSlide}
          >
            &#10095;
          </button>

          <div className="image-counter">
            {currentIndex + 1} / {images.length}
          </div>
        </>
      )}

    </div>
  );
};

export default PropertyImageCarousel;
