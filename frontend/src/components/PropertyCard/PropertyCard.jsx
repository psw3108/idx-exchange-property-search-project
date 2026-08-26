import PropTypes from 'prop-types';
import { parsePhotos } from '../../utils/parsePhotos';
import './PropertyCard.css';
import PropertyImageCarousel from "../PropertyImageCarousel/PropertyImageCarousel";

function PropertyCard({ property }) {
  const photos = parsePhotos(property.L_Photos);

  return (
    <article className="property-card">
      <div className="property-card-image-container">
        <PropertyImageCarousel images={photos} />
      </div>

      <h2>${property.L_SystemPrice ? Number(property.L_SystemPrice).toLocaleString() : 'N/A'}</h2>

      <div className="property-card-details">
        <span>{property.L_Keyword2} bds</span>
        <span className="property-card-divider">|</span>
        <span>{property.LM_Dec_3} ba</span>
        <span className="property-card-divider">|</span>
        <span>{Number(property.LM_Int2_3).toLocaleString()} sqft</span>
      </div>

      <p>{property.L_Address}</p>
      <p>
        {property.L_City}, {property.L_State}, {property.L_Zip}
      </p>
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