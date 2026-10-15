import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import {
  loadEventById,
} from "../features/events/eventsSlice";
import {
  cancelRegistration,
  clearRegistrationFeedback,
  registerForEvent,
} from "../features/registrations/registrationsSlice";

function eventImage(event) {
  return event.images?.find((image) => image.ratio === "16_9")?.url || event.images?.[0]?.url;
}

function eventDate(event) {
  const date = event.dates?.start?.localDate;
  const time = event.dates?.start?.localTime;
  return date
    ? new Date(`${date}T${time || "00:00"}`).toLocaleString(undefined, {
        dateStyle: "full",
        timeStyle: time ? "short" : undefined,
      })
    : "Date to be announced";
}

export default function EventDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { selectedEvent, detailStatus, detailError } = useSelector(
    (state) => state.events
  );
  const { items: registrations, message, error } = useSelector(
    (state) => state.registrations
  );

  const isRegistered = registrations.some(
    (registration) =>
      registration.userEmail === user.email && registration.event.id === id
  );

  useEffect(() => {
    dispatch(loadEventById(id));
    dispatch(clearRegistrationFeedback());
  }, [dispatch, id]);

  const venue = selectedEvent?._embedded?.venues?.[0];

  const toggleRegistration = () => {
    if (isRegistered) {
      dispatch(cancelRegistration({ email: user.email, eventId: id }));
    } else if (selectedEvent) {
      dispatch(registerForEvent({ email: user.email, event: selectedEvent }));
    }
  };

  return (
    <>
      <Navbar />
      <main className="content-section detail-section">
        <Link className="back-link" to="/events">← Back to discover</Link>
        {detailStatus === "loading" && <Loader label="Loading event details..." />}
        {detailStatus === "failed" && (
          <div className="alert alert-error">{detailError}</div>
        )}
        {selectedEvent && (
          <article className="detail-card">
            {eventImage(selectedEvent) && (
              <img className="detail-image" src={eventImage(selectedEvent)} alt="" />
            )}
            <div className="detail-content">
              <p className="eyebrow">
                {selectedEvent.classifications?.[0]?.segment?.name || "EVENT"}
              </p>
              <h1>{selectedEvent.name}</h1>
              <div className="detail-facts">
                <p><strong>When</strong>{eventDate(selectedEvent)}</p>
                <p><strong>Where</strong>{venue?.name || "Venue to be announced"}<br />{venue?.city?.name}{venue?.state?.stateCode ? `, ${venue.state.stateCode}` : ""}</p>
                <p><strong>Category</strong>{selectedEvent.classifications?.[0]?.genre?.name || "General admission"}</p>
              </div>
              {selectedEvent.info && <p className="event-description">{selectedEvent.info}</p>}
              <button className={`button ${isRegistered ? "button-secondary" : "button-primary"}`} onClick={toggleRegistration}>
                {isRegistered ? "Cancel registration" : "Register for this event"}
              </button>
              {selectedEvent.url && (
                <a className="text-link external-link" href={selectedEvent.url} target="_blank" rel="noreferrer">
                  View on Ticketmaster ↗
                </a>
              )}
              {message && <p className="alert alert-success">{message}</p>}
              {error && <p className="alert alert-error">{error}</p>}
            </div>
          </article>
        )}
      </main>
    </>
  );
}