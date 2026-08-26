export default function PropertyMap({ property }) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const lat = property?.LMD_MP_Latitude;
  const lng = property?.LMD_MP_Longitude;

  if (!lat || !lng) {
    return <p>No map location available for this property.</p>;
  }

  const src = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${lat},${lng}&zoom=14`;
  
  // Directions URL using Google Maps Universal URLs
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  return (
    <div style={{ width: '100%' }}>
      <iframe
        title={`Map location ${lat}, ${lng}`}
        width="100%"
        height="450px"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={src}
      />

      <div style={{ marginTop: '8px' }}>
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Get Directions
        </a>
      </div>
    </div>
  );
}