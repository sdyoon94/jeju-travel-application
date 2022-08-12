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
import Edit from 'components/Home/EditTest'
import PlaceSearch from 'routes/PlaceSearch'
import AddressInput from 'routes/AddressInput'
import TravelJoin from 'routes/TravelJoin';
import PrivateRoute from "components/PrivateRoute";
import CreateLoading from "routes/Inputs/CreateLoading";


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
        <Route path="edit" element={<PrivateRoute component={ Edit } />} />
        <Route path="travel/:travelId" element={<PrivateRoute component={ Travel } />} />
        <Route path="traveledit" element={<PrivateRoute component={ TravelEdit } />} />
        <Route path="search/:travelId/:dayId" element={<PrivateRoute component={ PlaceSearch } />} />
        <Route path="address/:travelId/:dayId" element={<PrivateRoute component={ AddressInput } />} />
        <Route path="loading" element={<PrivateRoute component={ CreateLoading } />} />
        {/* Public route */}
        <Route path="login" element={<KakaoLogin />} />
        <Route path="oauth2/redirect/" element={<KakaoRedirect />} />
        <Route path="join/:travelId/:nickname" element={<TravelJoin />} />
      </Routes>
    </BrowserRouter>
  </Provider>
);

// axios.defaults.withCredentials = true
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
