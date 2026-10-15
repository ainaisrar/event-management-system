export default function Loader({ label = "Loading events..." }) {
  return (
    <div className="loader" role="status">
      <span className="spinner" />
      {label}
    </div>
  );
}