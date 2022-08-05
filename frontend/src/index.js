import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store/store";
import New from "./routes/Inputs/New";
// import App from './App'
import Travel from "routes/Travel";
import Home from "./routes/Home";
import TravelEdit from "routes/TravelEdit";
import KakaoLogin from "routes/KakaoLogin";
import KakaoRedirect from "routes/KakaoRedirect"
import Edit from 'components/Home/EditTest';
import TravelJoin from 'routes/TravelJoin';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="new" element={<New />}>
          <Route path=":input" element={<New />} />
        </Route>
        <Route path="edit" element={<Edit />} />
        <Route path="travel" element={<Travel />} />
        <Route path="traveledit" element={<TravelEdit />} />
        <Route path="login" element={<KakaoLogin />} />
        <Route path="join/:travelUid" element={<TravelJoin />} />
        <Route path="oauth2/redirect/" element={<KakaoRedirect />} />
      </Routes>
    </BrowserRouter>
  </Provider>
);

// axios.defaults.withCredentials = true
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
