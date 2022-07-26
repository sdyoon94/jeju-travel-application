import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import store from './store/store'
import App from './App';
import Login from './routes/Login'
import Signup from './routes/Signup'
import Inputs from './routes/Inputs/Inputs'
import Home from './routes/Home';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="inputs" element={<Inputs />} />
      </Routes>
    </BrowserRouter>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
