import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const User = () => {
  const [user, setUser] = useState("");
  const [redirect, setRedirect] = useState(false);

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

  if (redirect) return <Navigate to="/login" />;

  return <div>{user}</div>;
};

export default User;
