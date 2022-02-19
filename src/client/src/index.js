import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css"
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min"
import "./index.css"
import { UserContextProvider } from "./Context/UserContext"

ReactDOM.render(
  <UserContextProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </UserContextProvider>,
  document.getElementById('root')
);
