import { useState } from 'react';
import './PropertyFilters.css';

const bedOptions = [0, 1, 2, 3, 4, 5, 6];
const bathOptions = [0, 1, 2, 3, 4, 5, 6];

const initialFilters = {
  city: '',
  zipcode: '',
  minPrice: '',
  maxPrice: '',
  beds: '',
  baths: '',
};

function PropertyFilters({ onApply }) {
  const [filters, setFilters] = useState(initialFilters);

  function handleChange(event) {
    const { name, value } = event.target;

    setFilters((previousFilters) => ({
      ...previousFilters,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onApply(filters);
  }

function handleClear() {
  const clearedFilters = { ...initialFilters };

  setFilters(clearedFilters);
  onApply(clearedFilters);
}

  return (
    <form className="property-filters" onSubmit={handleSubmit}>
      <div className="filter-field">
        <label htmlFor="city">City</label>
        <input
          id="city"
          name="city"
          type="search"
          placeholder="Search by city"
          value={filters.city}
          onChange={handleChange}
        />
      </div>

      <div className="filter-field">
        <label htmlFor="zipcode">ZIP Code</label>
        <input
          id="zipcode"
          name="zipcode"
          type="search"
          placeholder="Search by ZIP code"
          value={filters.zipcode}
          onChange={handleChange}
        />
      </div>

      <div className="filter-field">
        <label htmlFor="minPrice">Min Price</label>
        <input
          id="minPrice"
          name="minPrice"
          type="number"
          min="0"
          step="10000"
          placeholder="Min price"
          value={filters.minPrice}
          onChange={handleChange}
        />
      </div>

      <div className="filter-field">
        <label htmlFor="maxPrice">Max Price</label>
        <input
          id="maxPrice"
          name="maxPrice"
          type="number"
          min="0"
          step="10000"
          placeholder="Max price"
          value={filters.maxPrice}
          onChange={handleChange}
        />
      </div>

      <div className="filter-field">
        <label htmlFor="beds">Beds</label>

        <select
          id="beds"
          name="beds"
          value={filters.beds}
          onChange={handleChange}
          className={filters.beds !== '' ? 'has-value' : ''}
        >
          <option value="">Any beds</option>

          {bedOptions.map((bed) => (
            <option key={bed} value={bed}>
              {bed} {bed === 1 ? 'bed' : 'beds'}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-field">
        <label htmlFor="baths">Baths</label>

        <select
          id="baths"
          name="baths"
          value={filters.baths}
          onChange={handleChange}
          className={filters.baths !== '' ? 'has-value' : ''}
        >
          <option value="">Any baths</option>

          {bathOptions.map((bath) => (
            <option key={bath} value={bath}>
              {bath} {bath === 1 ? 'bath' : 'baths'}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-actions">
        <button type="submit">Search</button>

        <button type="button" onClick={handleClear}>
          Clear
        </button>
      </div>
    </form>
  );
}

export default PropertyFilters;