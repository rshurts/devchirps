import { ApolloProvider } from "@apollo/client";
import { Grommet } from "grommet";
import { Router } from "react-router-dom";
import React from "react";
import ReactDOM from "react-dom";

import reportWebVitals from "./reportWebVitals";

import client from "./graphql/apollo";
import Routes from "./routes";
import history from "./routes/history";
import GlobalStyle from "./styles/global";
import theme from "./styles/theme";

const App = () => (
  <ApolloProvider client={client}>
    <GlobalStyle />
    <Grommet theme={theme}>
      <Router history={history}>
        <Routes />
      </Router>
    </Grommet>
  </ApolloProvider>
);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
