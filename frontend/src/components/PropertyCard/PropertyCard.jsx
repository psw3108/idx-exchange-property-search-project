import PropTypes from 'prop-types';
import { parsePhotos } from '../../utils/parsePhotos';
import { formatAddress } from '../../utils/formatAddress';
import './PropertyCard.css';
import PropertyImageCarousel from "../PropertyImageCarousel/PropertyImageCarousel";

function formatBaths(baths) {
  if (baths == null || baths === '') return null;

  const value = Number(baths);

  return Number.isInteger(value)
    ? value.toString()
    : value.toString();
}

function PropertyCard({ property }) {
  const photos = parsePhotos(property.L_Photos);

  return (
    <article className="property-card">
      <div className="property-card-image-container">
        <PropertyImageCarousel images={photos} />
      </div>

      <h2>
        {property.L_SystemPrice
          ? `$${Number(property.L_SystemPrice).toLocaleString()}`
          : 'Price unavailable'}
      </h2>

      <div className="property-card-details">
        {property.L_Keyword2 != null && (
          <span>{property.L_Keyword2} bds</span>
        )}

        {property.LM_Dec_3 != null && (
          <>
            {property.L_Keyword2 != null && (
              <span className="property-card-divider">|</span>
            )}
            <span>{formatBaths(property.LM_Dec_3)} ba</span>
          </>
        )}

        {property.LM_Int2_3 != null && (
          <>
            {(property.L_Keyword2 != null || property.LM_Dec_3 != null) && (
              <span className="property-card-divider">|</span>
            )}
            <span>{Number(property.LM_Int2_3).toLocaleString()} sqft</span>
          </>
        )}
      </div>

      <p>{formatAddress(property)}</p>
    </article>
  );
}

PropertyCard.propTypes = {
  property: PropTypes.shape({
    L_Photos: PropTypes.string,
    L_SystemPrice: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    L_Keyword2: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    LM_Dec_3: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    LM_Int2_3: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    L_Address: PropTypes.string,
    L_City: PropTypes.string,
    L_State: PropTypes.string,
    L_Zip: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
  }).isRequired,
};


export default PropertyCard;