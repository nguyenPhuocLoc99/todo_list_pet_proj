import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useRenderContext } from "../context/RenderContext";

function Header() {
  // use useAuth custom hook
  const { isAuthenticated } = useAuth();

  // render context
  const { refreshApp } = useRenderContext();

  // Logout func
  const handleLogout = () => {
    sessionStorage.removeItem("accessToken");
    refreshApp();
  };

  // Not logged in header
  const notLoggedIn = () => {
    return (
      <>
        <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
          <li>
            <Link to="/" className="nav-link px-2 text-secondary">
              Home
            </Link>
          </li>
        </ul>

        <div className="ms-auto">
          <Link to="/login" className="btn btn-outline-light me-2">
            Login
          </Link>
          <Link to="/signup" className="btn btn-warning">
            Sign-up
          </Link>
        </div>
      </>
    );
  };

  // Logged in header
  const loggedIn = () => {
    return (
      <>
        <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
          <li>
            <Link to="/" className="nav-link px-2 text-secondary">
              Home
            </Link>
          </li>
          <li>
            <Link to="/tasks" className="nav-link px-2 text-white">
              Tasks list
            </Link>
          </li>
          <li>
            <Link to="/groups" className="nav-link px-2 text-white">
              Task Groups list
            </Link>
          </li>
        </ul>

        <form className="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3" role="search">
          <input
            type="search"
            className="form-control form-control-dark text-white bg-dark"
            placeholder="Search..."
            aria-label="Search"
          />
        </form>

        <div className="text-end">
          <button className="btn btn-outline-light me-2" onClick={handleLogout}>
            Logout
          </button>
        </div>
        <div>
          <Link to="/user" className="btn bg-light text-dark me-2">
            User
          </Link>
        </div>
      </>
    );
  };

  return (
    <header className="p-3 text-bg-dark">
      <div className="container">
        <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
          <Link
            to="/"
            className="d-flex align-items-center text-white text-decoration-none me-3"
          >
            <img
              src="logo_small.png"
              className="rounded-circle"
              width={50}
              height={50}
            />
          </Link>

          <div className="d-flex flex-grow-1 justify-content-between align-items-center">
            {isAuthenticated ? loggedIn() : notLoggedIn()}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
