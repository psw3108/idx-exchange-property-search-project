function PropertyCard({ property }) {
  let photoUrl = null;

  try {
    const photos = JSON.parse(property.L_Photos);

    if (Array.isArray(photos) && photos.length > 0) {
      photoUrl = photos[0];
    }
  } catch (error) {
    console.error('Could not parse property photos:', error);
  }

  return (
    <article className="property-card">
      <div className="property-card-image-container">
        <img
          className="property-card-image"
          src={photoUrl || '/placeholder.jpg'}
          alt={property.L_Address || 'Property photo'}
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = '/placeholder.jpg';
          }}
        />
      </div>

      <h2>{property.L_Address}</h2>

      <p>
        {property.L_City}, {property.L_State}
      </p>

      <p>${property.L_SystemPrice ? Number(property.L_SystemPrice).toLocaleString() : 'N/A'}</p>
      <p>{property.L_Keyword2} Beds</p>
      <p>{property.LM_Dec_3} Baths</p>
      <p>{property.LM_Int2_3} Sqft</p>
    </article>
  );
}

export default PropertyCard;