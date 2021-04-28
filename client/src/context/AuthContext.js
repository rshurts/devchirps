import createAuth0Client from "@auth0/auth0-spa-js";
import React, { createContext, useContext, useEffect, useState } from "react";

import history from "../routes/history";

const AuthContext = createContext();
const useAuth = () => useContext(AuthContext);

const initOptions = {
  audience: process.env.REACT_APP_GRAPHQL_ENDPOINT,
  client_id: process.env.REACT_APP_AUTH0_CLIENT_ID,
  domain: process.env.REACT_APP_AUTH0_DOMAIN,
  redirect_uri: process.env.REACT_APP_AUTH0_CALLBACK_URL,
};

const AuthProvider = ({ children }) => {
  const [auth0Client, setAuth0Client] = useState();
  const [checkingSession, setCheckingSession] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initializeAuth0 = async () => {
      try {
        const client = await createAuth0Client(initOptions);
        setAuth0Client(client);

        if (window.location.search.includes("code=")) {
          await client.handleRedirectCallback();
          history.replace({ pathname: "/home", search: "" });
        }

        const authenticated = await client.isAuthenticated();
        setIsAuthenticated(authenticated);

        // If a user navigates directly to /login redirect appropriately.
        if (history.location.pathname === "/login" && authenticated) {
          history.replace("/home");
        } else if (history.location.pathname === "/login") {
          history.replace("/");
        }
      } catch {
        // On error send the user back to the login page to try again.
        history.location.pathname !== "/" && history.replace("/");
      } finally {
        setCheckingSession(false);
      }
    };
    initializeAuth0();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        checkingSession,
        isAuthenticated,
        login: (...p) => auth0Client.loginWithRedirect(...p),
        logout: (...p) =>
          auth0Client.logout({
            ...p,
            returnTo: process.env.REACT_APP_AUTH0_LOGOUT_URL,
          }),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, useAuth };
export default AuthContext;
