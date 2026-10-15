import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EventCard from "../components/EventCard";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import {
  loadClassifications,
  loadEvents,
} from "../features/events/eventsSlice";

const POPULAR_CATEGORIES = ["Music", "Sports", "Arts & Theatre", "Family"];

export default function Events() {
  const dispatch = useDispatch();
  const { items, classifications, status, error } = useSelector(
    (state) => state.events
  );
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    keyword: "",
    category: "",
    city: "",
    startDateTime: "",
  });

  useEffect(() => {
    dispatch(loadEvents());
    dispatch(loadClassifications());
  }, [dispatch]);

  const categories = useMemo(() => {
    const apiCategories = classifications
      .map((classification) => classification.segment?.name)
      .filter(Boolean);
    return [...new Set([...POPULAR_CATEGORIES, ...apiCategories])].slice(0, 12);
  }, [classifications]);

  const searchEvents = (event) => {
    event.preventDefault();
    setFilters((current) => ({ ...current, keyword: search.trim() }));
    dispatch(loadEvents({
      keyword: search.trim(),
      classificationName: filters.category,
      city: filters.city,
      startDateTime: filters.startDateTime,
    }));
  };

  const updateFilter = (name, value) => {
    const nextFilters = { ...filters, [name]: value };
    setFilters(nextFilters);
    dispatch(loadEvents({
      keyword: nextFilters.keyword,
      classificationName: nextFilters.category,
      city: nextFilters.city,
      startDateTime: nextFilters.startDateTime,
    }));
  };

  return (
    <>
      <Navbar />
      <main>
        <section className="hero-section">
          <div className="hero-copy">
            <p className="eyebrow">MAKE TIME FOR WHAT MOVES YOU</p>
            <h1>Find your next <em>unforgettable</em> experience.</h1>
            <p>
              Discover live music, sports, theatre and more happening near you.
            </p>
          </div>
          <SearchBar value={search} onChange={setSearch} onSubmit={searchEvents} />
        </section>

        <section className="content-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">EXPLORE BY INTEREST</p>
              <h2>What are you in the mood for?</h2>
            </div>
          </div>
          <div className="category-list">
            <button
              className={`category-chip ${!filters.category ? "active" : ""}`}
              onClick={() => updateFilter("category", "")}
            >
              All events
            </button>
            {categories.map((category) => (
              <button
                className={`category-chip ${
                  filters.category === category ? "active" : ""
                }`}
                key={category}
                onClick={() => updateFilter("category", category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="filter-row">
            <label>
              City
              <input
                value={filters.city}
                onChange={(event) => updateFilter("city", event.target.value)}
                placeholder="e.g. New York"
              />
            </label>
            <label>
              From
              <input
                type="date"
                value={filters.startDateTime}
                onChange={(event) =>
                  updateFilter(
                    "startDateTime",
                    event.target.value
                      ? `${event.target.value}T00:00:00Z`
                      : ""
                  )
                }
              />
            </label>
          </div>

          <div className="section-heading events-heading">
            <div>
              <p className="eyebrow">LIVE FROM TICKETMASTER</p>
              <h2>Upcoming events</h2>
            </div>
            <span className="result-count">
              {status === "succeeded" ? `${items.length} events` : ""}
            </span>
          </div>

          {status === "loading" && <Loader />}
          {status === "failed" && (
            <div className="alert alert-error">{error}</div>
          )}
          {status === "succeeded" && items.length === 0 && (
            <div className="empty-state">
              <h3>No events found</h3>
              <p>Try a different keyword, city, or category.</p>
            </div>
          )}
          {status === "succeeded" && items.length > 0 && (
            <div className="event-grid">
              {items.map((event) => (
                <EventCard event={event} key={event.id} />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}