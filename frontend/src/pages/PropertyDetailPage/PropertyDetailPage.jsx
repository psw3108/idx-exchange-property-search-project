import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchPropertyDetail, fetchPropertyOpenHouses } from '../../api/client';
import { parsePhotos } from '../../utils/parsePhotos';
import { formatAddress } from '../../utils/formatAddress';
import PropertyImageGallery from '../../components/PropertyImageGallery/PropertyImageGallery';
import PropertyMap from '../../components/PropertyMap/PropertyMap';
import './PropertyDetailPage.css';

function formatDate(dateString) {
  if (!dateString) return '';

  const date = new Date(dateString);

  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

function formatTime(timeString) {
  if (!timeString) return '';

  const [hours, minutes] = timeString.split(':');

  const date = new Date();
  date.setHours(Number(hours), Number(minutes));

  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatBaths(baths) {
  if (baths == null || baths === '') return null;

  const value = Number(baths);

  return Number.isInteger(value)
    ? value.toString()
    : value.toString();
}

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
          {/* Gallery and right cards */}
          <section className="property-hero">

            <div className="property-gallery-section">
              <PropertyImageGallery photos={photos} />
            </div>


            <div className="property-side-column">

              <div className="property-summary">

                <h1>
                  {property.L_SystemPrice
                    ? `$${Number(property.L_SystemPrice).toLocaleString()}`
                    : 'Price unavailable'}
                </h1>

                <p className="property-address">
                  {formatAddress(property)}
                </p>

                <div className="property-stats">
                  {property.L_Keyword2 != null && (
                    <p>{property.L_Keyword2} Beds</p>
                  )}

                  {property.LM_Dec_3 != null && (
                    <p>{formatBaths(property.LM_Dec_3)} Baths</p>
                  )}

                  {property.LM_Int2_3 != null &&
                    property.LM_Int2_3 !== 0 && (
                      <p>
                        {Number(property.LM_Int2_3).toLocaleString()} Sqft
                      </p>
                    )}

                  {property.YearBuilt != null &&
                    property.YearBuilt !== 0 && (
                      <p>Built in {property.YearBuilt}</p>
                    )}
                </div>

              </div>


              <div className="property-side-map">
                <h2>Location</h2>

                <PropertyMap property={property} />
              </div>

            </div>

          </section>

          {/* Description */}
          <section className="property-description-section">
            <div className="property-description">
              <h2>Property Details</h2>
              <p>{property.L_Remarks}</p>
            </div>
          </section>

          {/* Open House */}
          <section className="property-open-house-section">
            {openHouses.length === 0 ? (
              <div className="no-open-house">
                <h2>No open houses scheduled</h2>
              </div>
            ) : (
              <>
                <h2>Open Houses</h2>

                {openHouses.map((openHouse, index) => {
                  const remarks = getOpenHouseRemarks(openHouse.all_data);

                  return (
                    <div className="open-house-card" key={index}>
                      <p>
                        Open house date: {formatDate(openHouse.OpenHouseDate)}
                      </p>

                      <p>
                        Start / End time: {formatTime(openHouse.OH_StartTime)} /{' '}
                        {formatTime(openHouse.OH_EndTime)}
                      </p>

                      <p>Remarks: {remarks}</p>
                    </div>
                  );
                })}
              </>
            )}
          </section>

        </div>
      )}
    </main>
  );
}

export default PropertyDetailPage;