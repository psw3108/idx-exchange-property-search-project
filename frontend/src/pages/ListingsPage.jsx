import { useEffect, useState } from 'react';
import { fetchProperties } from '../api/client';
import PropertyCard from '../components/PropertyCard';
import PropertyFilters from '../components/PropertyFilters';
import './ListingsPage.css';


function ListingsPage() {
  const [properties, setProperties] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  // filter handling
  function applyFilters(newFilters) {
    setFilters(newFilters);
  }

  useEffect(() => {
    async function loadProperties() {
      try {
        // Week 5 testing loading state
        // await new Promise((resolve) => setTimeout(resolve, 2000));
        setLoading(true);
        setError(null);

        const data = await fetchProperties(filters);

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
  }, [filters]);

  return (
    <main className="listings-page">
      <h1>Property Listings</h1>

      {/* filters */}
      <PropertyFilters passFilters={applyFilters} />
      
      {loading && (
        <div className="page-message" role="status">
          <p>Loading properties...</p>
        </div>
      )}

      {!loading && error && (
        <div className="page-message">
          <p role="alert">
            Could not load properties: {error}
          </p>
        </div>
      )}

      {/* No results */}
      {!loading && !error && total === 0 && (
        <section className="no-results" role="status">
          <h2>No properties found</h2>
          <p>Try changing or clearing your filters.</p>
        </section>
      )}

      {/* Results found - Display property cards */}
      {!loading && !error && total > 0 && (
        <>
          <p className="listings-count">
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