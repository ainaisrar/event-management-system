import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import { cancelRegistration } from "../features/registrations/registrationsSlice";

function eventDate(event) {
  const date = event.dates?.start?.localDate;
  return date
    ? new Date(`${date}T${event.dates?.start?.localTime || "00:00"}`)
    : null;
}

function RegistrationCard({ registration, onCancel }) {
  const date = eventDate(registration.event);
  return (
    <article className="registered-card">
      <div>
        <p className="event-date">{date?.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) || "Date to be announced"}</p>
        <h3>{registration.event.name}</h3>
        <p className="event-location">{registration.event._embedded?.venues?.[0]?.name || "Venue to be announced"}</p>
      </div>
      <div className="registered-actions">
        <Link className="text-link" to={`/events/${registration.event.id}`}>Details</Link>
        <button className="button button-danger" onClick={() => onCancel(registration.event.id)}>Cancel</button>
      </div>
    </article>
  );
}

export default function MyEvents() {
  const user = useSelector((state) => state.auth.user);
  const registrations = useSelector((state) =>
    state.registrations.items.filter(
      (registration) => registration.userEmail === user.email
    )
  );
  const dispatch = useDispatch();
  const { upcoming, completed } = useMemo(() => ({
    upcoming: registrations.filter((registration) => {
      const date = eventDate(registration.event);
      return !date || date >= new Date();
    }),
    completed: registrations.filter((registration) => {
      const date = eventDate(registration.event);
      return date && date < new Date();
    }),
  }), [registrations]);

  const cancel = (eventId) =>
    dispatch(cancelRegistration({ email: user.email, eventId }));

  return (
    <>
      <Navbar />
      <main className="content-section my-events-page">
        <div className="page-intro">
          <p className="eyebrow">YOUR PERSONAL CALENDAR</p>
          <h1>My events</h1>
          <p>Keep track of the experiences you have planned.</p>
        </div>
        <section className="registered-section">
          <div className="section-heading"><h2>Upcoming <span>{upcoming.length}</span></h2></div>
          {upcoming.length === 0 ? (
            <div className="empty-state"><h3>Your calendar is clear</h3><p>Discover something new and register to see it here.</p><Link className="button button-primary" to="/events">Explore events</Link></div>
          ) : upcoming.map((registration) => <RegistrationCard key={registration.id} registration={registration} onCancel={cancel} />)}
        </section>
        {completed.length > 0 && (
          <section className="registered-section completed-section">
            <div className="section-heading"><h2>Completed <span>{completed.length}</span></h2></div>
            {completed.map((registration) => <RegistrationCard key={registration.id} registration={registration} onCancel={cancel} />)}
          </section>
        )}
      </main>
    </>
  );
}