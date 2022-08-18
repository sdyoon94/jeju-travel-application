import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store/store";
import New from "./routes/Inputs/New";
import Travel from "routes/Travel";
import Home from "./routes/Home";
import KakaoLogin from "routes/KakaoLogin";
import KakaoRedirect from "routes/KakaoRedirect"
import PlaceSearch from 'routes/PlaceSearch'
import AddressInput from 'routes/AddressInput'
import TravelJoin from 'routes/TravelJoin';
import PrivateRoute from "components/PrivateRoute";
import CreateLoading from "routes/Inputs/CreateLoading";
import ScheduleFix from "routes/ScheduleFix";
import Error404 from "routes/Error404";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        {/* Private route */}
        <Route path="/" element={<PrivateRoute component={ Home } />} />
        <Route path="new" element={<PrivateRoute component={ New } />}>
          <Route path=":input" element={<New />} />
        </Route>
        <Route path="travel/:travelId" element={<PrivateRoute component={ Travel } />} />
        <Route path="search/:travelId/:dayId" element={<PrivateRoute component={ PlaceSearch } />} />
        <Route path="address/:travelId/:dayId" element={<PrivateRoute component={ AddressInput } />} />
        <Route path="loading" element={<PrivateRoute component={ CreateLoading } />} />
        <Route path="travel/:travelId/fix" element={<PrivateRoute component={ ScheduleFix } />} />
        {/* Public route */}
        <Route path="login" element={<KakaoLogin />} />
        <Route path="oauth2/redirect/" element={<KakaoRedirect />} />
        <Route path="join/:travelId/:nickname" element={<TravelJoin />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </BrowserRouter>
  </Provider>
);

// axios.defaults.withCredentials = true
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
