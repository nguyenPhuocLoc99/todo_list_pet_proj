import { SyntheticEvent, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import Alert from "../components/Alert";
import Header from "../components/Header";
import useAuth from "../hooks/useAuth";

const Login = () => {
  // Input states
  const [loginName, setLoginName] = useState("");
  const [password, setPassword] = useState("");

  // Error states
  const [loginNameError, setLoginNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [serverError, setServerError] = useState("");

  // Get state from navigate for 'Token expired' message
  const location = useLocation();

  // Redirect
  const [toUser, setToUser] = useState(false);

  // useAuth to redirect on authenticated
  const { isAuthenticated, isValidating } = useAuth();
  useEffect(() => {
    if (isAuthenticated && !isValidating) setToUser(true);
  }, [isAuthenticated, isValidating]);

  // Submit func
  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    // Set error
    if (!loginName.trim()) setLoginNameError("Login name is required");
    else setLoginNameError("");

    if (!password.trim()) setPasswordError("Password is required");
    else setPasswordError("");

    const response = await fetch("http://localhost:3333/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        loginName,
        password,
      }),
    });
    const data = await response.json();

    if (data.accessToken) {
      document.cookie = `accessToken=${data.accessToken}; path=/; max-age=1800`;
      setToUser(true);
    } else setServerError(data.message);
  };

  if (toUser) {
    return (
      <Navigate to="/user" state={{ message: "Login success", alertType: 2 }} />
    );
  }

  return (
    <>
      <Header />
      {location.state && (
        <Alert alertType={location.state.alertType}>
          {location.state.message}
        </Alert>
      )}
      {serverError && <Alert alertType={3}>{serverError}</Alert>}

      <form onSubmit={handleSubmit} className="form-signin m-auto">
        <h1 className="mb-3 fw-normal">Log in</h1>

        <div className="form-floating">
          <input
            type="login name"
            className="form-control top-field"
            id="floatingInput"
            placeholder="name@example.com"
            onChange={(e) => setLoginName(e.target.value)}
            autoComplete="username"
            required
          />
          <label htmlFor="floatingInput">Login name</label>
        </div>

        <div className="form-floating">
          <input
            type="password"
            className="form-control bottom-field"
            id="floatingPassword"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
          <label htmlFor="floatingPassword">Password</label>
        </div>

        {loginNameError && <div className="text-danger">{loginNameError}</div>}
        {passwordError && <div className="text-danger">{passwordError}</div>}

        <button
          className="btn btn-primary w-100 py-2"
          type="submit"
          onClick={() => setServerError("")}
        >
          Log in
        </button>
      </form>
    </>
  );
};

export default Login;
