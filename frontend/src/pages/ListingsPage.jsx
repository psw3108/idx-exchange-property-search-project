import { useEffect, useState } from 'react';
import { fetchProperties } from '../api/client';
import PropertyCard from '../components/PropertyCard';

function ListingsPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function loadProperties() {
      try {
        // testing loading state
        // await new Promise((resolve) => setTimeout(resolve, 2000));

        const data = await fetchProperties();

        setProperties(data.results);
        setTotal(data.total);
      } catch (error) {
        console.error('Could not fetch properties:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadProperties();
  }, []);

  return (
    <main className="listings-page">
      <h1>Property Listings</h1>

      {loading && <p>Loading properties...</p>}

      {error && (
        <p role="alert">
          Could not load properties: {error}
        </p>
      )}

      {!loading && !error && (
        <>
          <p>
            Showing {properties.length} of {total.toLocaleString()} properties
          </p>

          <div className="property-grid">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
              />
            ))}
          </div>
        </>
      )}
    </main>
  );
}

export default ListingsPage;