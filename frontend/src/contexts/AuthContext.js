import { useState, createContext, useContext, useEffect } from "react";
import { fetchLogout, fetchMe } from "../api";
import { Flex, Spinner } from "@chakra-ui/react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const me = await fetchMe();
        console.log("Fetched user:", me);

        if (me && Object.keys(me).length > 0) {
          setUser(me);
          setLoggedIn(true);
        } else {
          setUser(null);
          setLoggedIn(false);
        }
      } catch (e) {
        console.error("Error fetching user:", e);
        setUser(null);
        setLoggedIn(false);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = (data) => {
    setUser(data.user);
    setLoggedIn(true);

    console.log("User logged in:", data);
    console.log(data.user._id);
    localStorage.setItem("userId",data.user._id);
    localStorage.setItem("access-token", data.accessToken);
    localStorage.setItem("refresh-token", data.refreshToken);
  };

  const logout = async () => {
    await fetchLogout();
    localStorage.removeItem("access-token");
    localStorage.removeItem("refresh-token");

    setUser(null);
    setLoggedIn(false);

    console.log("User logged out");
  };

  const values = {
    loggedIn,
    user,
    login,
    logout,
  };

  if (loading) {
    return (
      <Flex justifyContent="center" alignItems="center" height="100vh">
        <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" />
      </Flex>
    );
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
