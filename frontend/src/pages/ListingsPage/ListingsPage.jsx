import { useEffect, useState } from 'react';
import { fetchProperties } from '../../api/client';
import { Link } from 'react-router-dom';
import PropertyCard from '../../components/PropertyCard/PropertyCard';
import PropertyFilters from '../../components/PropertyFilters/PropertyFilters';
import Pagination from '../../components/Pagination/Pagination';
import './ListingsPage.css';


function ListingsPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  const [filters, setFilters] = useState({});

  // filter handling
  function applyFilters(newFilters) {
    setFilters(newFilters);
    setPage(1);
  }

  // page handling
  const [currentPage, setPage] = useState(1);
  const listingPerPage = 20;

  // calculate total pages
  const totalPages = Math.ceil(total / listingPerPage);
  
  // calculate offset, 
  const offset = (currentPage - 1) * listingPerPage;

  // page switching handling
  function handlePageChange(newPageNumber) {
    setPage(newPageNumber);
    window.scrollTo(0, 0)
  }


  useEffect(() => {
    async function loadProperties() {
      try {
        setLoading(true);
        setError(null);

      const data = await fetchProperties({
        ...filters,
        limit: listingPerPage,
        offset,
      });

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
  }, [filters, currentPage]);

  return (
    <main className="listings-page">
      <h1>Property Listings</h1>

      {/* filters */}
      <PropertyFilters onApply={applyFilters} />
      
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
            Showing {offset + 1} - {Math.min(total, offset + listingPerPage)} of {total.toLocaleString()} properties
          </p>

          <div className="property-grid">
            {properties.map((property) => (
              <Link
                className="property-card-link"
                key={property.id}
                to={`/properties/${property.id}`}
              >
                <PropertyCard property={property} />
              </Link>
            ))}
          </div>
        </>
      )}

      {/* Render Pagination Controls */}
      {!loading && !error && totalPages > 1 && (
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </main>
  );
}

export default ListingsPage;