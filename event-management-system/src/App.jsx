import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "./features/auth/authSlice";
import Login from "./pages/Login";
import Register from "./pages/Register";

function Home() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Home (temporary)</h2>
        {user ? (
          <>
            <p>Welcome, {user.name}!</p>
            <button className="btn" onClick={() => dispatch(logoutUser())}>
              Logout
            </button>
          </>
        ) : (
          <p>You are not logged in.</p>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}