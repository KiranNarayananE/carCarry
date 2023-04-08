import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { NavbarProvider } from "./Context/NavbarContext";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./Store/Store";

import reportWebVitals from './reportWebVitals';
import { LocationProvider } from './Context/locationContext';
import { TripProvider } from './Context/SelectTrip';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
       <LocationProvider>
        <NavbarProvider>
        <TripProvider>
            <App />
            </TripProvider>
        </NavbarProvider>
        </LocationProvider>
    </PersistGate>
  </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
