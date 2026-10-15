import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../features/auth/authSlice";

export default function Navbar() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <header className="site-header">
      <NavLink className="brand" to="/events">
        <span className="brand-mark">EM</span>
        <span>EventMate</span>
      </NavLink>
      <nav className="main-nav" aria-label="Main navigation">
        <NavLink to="/events">Discover</NavLink>
        <NavLink to="/my-events">My events</NavLink>
      </nav>
      <div className="user-menu">
        <span className="user-greeting">Hi, {user.name.split(" ")[0]}</span>
        <button className="button button-ghost" onClick={logout}>
          Log out
        </button>
      </div>
    </header>
  );
}