import './PropertySort.css';

export default function PropertySort({ value, onSortChange }) {
  function handleChange(event) {
    onSortChange(event.target.value);
  }

  return (
    <div className="property-sort">
      <label htmlFor="sort-options">
        Sort By:
      </label>

      <select
        id="sort-options"
        value={value}
        onChange={handleChange}
      >
        <option value="">Default</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="dateListed-desc">Date Listed: Newest</option>
        <option value="dateListed-asc">Date Listed: Oldest</option>
        <option value="sqft-desc">Sqft: Biggest</option>
        <option value="sqft-asc">Sqft: Smallest</option>
        <option value="beds-desc">Beds: Most Beds</option>
        <option value="beds-asc">Beds: Least Beds</option>
      </select>
    </div>
  );
}