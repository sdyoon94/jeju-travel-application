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
import KakaoLoading from "routes/KakaoLoading";
import MemberCnt from "components/Inputs/MemberCnt";
import InputBudget from "components/Inputs/Budget";
import Styles from "components/Inputs/Style"
import StartDate from "components/Inputs/Calender"
import PeriodInDays from "components/Inputs/Duration"
import StartTime from "components/Inputs/StartTime";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="new" element={<New />}>
          <Route path=":input" element={<New />} />
        </Route>
        <Route path="travel" element={<Travel />} />
        <Route path="traveledit" element={<TravelEdit />} />
        <Route path="login" element={<KakaoLogin />} />
        <Route path="kakao/callback" element={<KakaoLoading />} />
      </Routes>
    </BrowserRouter>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
