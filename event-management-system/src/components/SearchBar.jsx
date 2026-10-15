export default function SearchBar({ value, onChange, onSubmit }) {
  return (
    <form className="search-bar" onSubmit={onSubmit}>
      <label htmlFor="event-search">Search events</label>
      <div className="search-input-wrap">
        <span aria-hidden="true">⌕</span>
        <input
          id="event-search"
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Try concerts, sports, theatre..."
        />
        <button className="button button-primary" type="submit">
          Search
        </button>
      </div>
    </form>
  );
}