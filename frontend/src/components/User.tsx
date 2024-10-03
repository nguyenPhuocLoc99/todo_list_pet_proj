import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import Alert from "./Alert";

const User = () => {
  // Input states
  const [user, setUser] = useState("");

  // Redirect to Login
  const [redirect, setRedirect] = useState(false);

  // Get state from navigate for 'Login success' message
  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      const token = sessionStorage.getItem("accessToken");

      const response = await fetch("http://localhost:3333/users/me", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const content = await response.json();
      const stringJson = JSON.stringify(content);

      if (content.id) setUser(stringJson);
      else setRedirect(true);
    };

    fetchUser();
  });

  if (redirect)
    return (
      <Navigate
        to="/login"
        state={{ message: "Token expired", alertType: 3 }}
      />
    );

  return (
    <>
      {location.state && (
        <Alert alertType={location.state.alertType}>
          {location.state.message}
        </Alert>
      )}
      <div>{user}</div>
    </>
  );
};

export default User;
