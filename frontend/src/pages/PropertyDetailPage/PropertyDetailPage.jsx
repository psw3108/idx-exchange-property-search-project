import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchPropertyDetail, fetchPropertyOpenHouses } from '../../api/client';
import { parsePhotos } from '../../utils/parsePhotos';
import PropertyImageGallery from '../../components/PropertyImageGallery/PropertyImageGallery';
import PropertyMap from '../../components/PropertyMap/PropertyMap';
import './PropertyDetailPage.css';

function getOpenHouseRemarks(allData) {
  if (!allData) return 'No remarks available';

  try {
    const parsed = JSON.parse(allData);
    return parsed.OpenHouseRemarks || 'No remarks available';
  } catch {
    return 'No remarks available';
  }
}

function PropertyDetailPage() {
  const { id } = useParams();

  const [property, setProperty] = useState(null);
  const [openHouses, setOpenHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadProperty() {
      try {
        setLoading(true);
        setError(null);

        const detail = await fetchPropertyDetail(id);
        const open = await fetchPropertyOpenHouses(id);

        setProperty(detail);
        setOpenHouses(open);
      } catch (error) {
        console.error('Could not fetch property:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadProperty();
  }, [id]);

  const photos = property ? parsePhotos(property.L_Photos) : [];

  return (
    <main>
      {loading && (
        <div className="page-message">
          <p>Loading property details...</p>
        </div>
      )}

      {!loading && error && (
        <div className="page-message">
          <p role="alert">
            Could not load property detail: {error}
          </p>
        </div>
      )}

      {!loading && !error && property && (
        <div className="property-detail-page">

          {/* Map + Gallery */}
          <div className="property-media">
            <div className="property-map-container">
              <PropertyMap property={property} />
            </div>

            <div className="property-gallery-container">
              <PropertyImageGallery photos={photos} />
            </div>
          </div>

          {/* Property Details */}
          <section className="property-info">
            <h1>${property.L_SystemPrice ? Number(property.L_SystemPrice).toLocaleString() : 'N/A'}</h1>

            <p className="property-address">
              {property.L_Address}, {property.L_City}, {property.L_State}, {property.L_Zip}
            </p>

            <div className="property-stats">
              <p>{property.L_Keyword2} Beds</p>
              <p>{property.LM_Dec_3} Baths</p>
              <p>{property.LM_Int2_3} Sqft</p>
              <p>Built in {property.YearBuilt}</p>
            </div>

            <div className="property-description">
              <h2>Property Details</h2>
              <p>{property.L_Remarks}</p>
            </div>
          </section>

          {/* Open House */}
          {openHouses.length === 0 ? (
            <div className="no-open-house">
              <h2>No open houses scheduled</h2>
            </div>
          ) : (
            <section className="property-open-house">
              <h2>Open Houses</h2>

              {openHouses.map((openHouse, index) => {
                const remarks = getOpenHouseRemarks(openHouse.all_data);

                return (
                  <div className="open-house-card" key={index}>
                    <p>Open house date: {openHouse.OpenHouseDate}</p>

                    <p>
                      Start / end time: {openHouse.OH_StartTime} /{' '}
                      {openHouse.OH_EndTime}
                    </p>

                    <p>Remarks: {remarks}</p>
                  </div>
                );
              })}
            </section>
          )}

        </div>
      )}
    </main>
  );
}

export default PropertyDetailPage;