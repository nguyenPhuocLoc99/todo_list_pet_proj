import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import getAccessToken from "./getAccessToken";

function useAuth(getUser: boolean = false, dependencies: any = []) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    const checkToken = () => {
      const accessToken = getAccessToken();
      if (accessToken) {
        try {
          const decodedToken = jwtDecode(accessToken);
          if (decodedToken.exp && decodedToken.exp > Date.now() / 1000) {
            setIsAuthenticated(true);
            setUser(decodedToken);
          } else {
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
      setIsValidating(false);
    };

    checkToken(); // Check access token

    const interval = setInterval(checkToken, 1000 * 60 * 1); // Check every 10 minutes
    return () => clearInterval(interval);
  }, dependencies);

  return getUser
    ? { isAuthenticated, isValidating, user }
    : { isAuthenticated, isValidating };
}

export default useAuth;
