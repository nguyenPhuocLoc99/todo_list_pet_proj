import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

function useAuth(getUser: boolean = false) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkToken = () => {
        const accessToken = sessionStorage.getItem("accessToken");
        if (accessToken) {
            try {
                const decodedToken = jwtDecode(accessToken);
                if (decodedToken.exp && decodedToken.exp > Date.now() / 1000) {
                    setIsAuthenticated(true);
                    setUser(decodedToken);
                } else {
                    sessionStorage.removeItem("accessToken");
                    setIsAuthenticated(false);
                    setUser(null);
                }
            } catch (error) {
                console.error(error);
                setIsAuthenticated(false);
                setUser(null);
            }
        } else {
            setIsAuthenticated(false);
            setUser(null);
        }
    }

    checkToken(); // Check access token

    const interval = setInterval(checkToken, 1000 * 60 * 5); // Check every 5 minutes
    return () => clearInterval(interval);
  }, []);

  return getUser ? { isAuthenticated, user } : { isAuthenticated };
}

export default useAuth