import { Link } from "react-router-dom";

function getImage(event) {
  return (
    event.images?.find((image) => image.ratio === "16_9")?.url ||
    event.images?.[0]?.url
  );
}

export default function EventCard({ event }) {
  const venue = event._embedded?.venues?.[0];
  const date = event.dates?.start?.localDate;

  return (
    <article className="event-card">
      <div className="event-image-wrap">
        {getImage(event) ? (
          <img src={getImage(event)} alt="" className="event-image" />
        ) : (
          <div className="event-image event-image-fallback">EVENT</div>
        )}
        {event.classifications?.[0]?.segment?.name && (
          <span className="event-badge">{event.classifications[0].segment.name}</span>
        )}
      </div>
      <div className="event-card-content">
        <p className="event-date">
          {date
            ? new Date(`${date}T${event.dates?.start?.localTime || "00:00"}`).toLocaleDateString(
                undefined,
                { month: "short", day: "numeric", year: "numeric" }
              )
            : "Date to be announced"}
        </p>
        <h3>{event.name}</h3>
        <p className="event-location">
          {venue?.name || "Venue to be announced"}
          {venue?.city?.name ? ` · ${venue.city.name}` : ""}
        </p>
        <Link className="text-link" to={`/events/${event.id}`}>
          View event details <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}