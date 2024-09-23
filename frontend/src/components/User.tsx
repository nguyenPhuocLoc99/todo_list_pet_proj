import { useEffect, useState } from "react";

const User = () => {
  const [user, setUser] = useState("");

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

      setUser(JSON.stringify(content));
    };

    fetchUser();
  });

  return <div>{user}</div>;
};

export default User;
