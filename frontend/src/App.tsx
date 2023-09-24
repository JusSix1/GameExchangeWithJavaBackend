/* eslint-disable react/jsx-pascal-case */
import * as React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import SignIn_User from "./component/SignIn/SignIn_User_UI";
import User_Profile_UI from "./component/user/User_Profile_UI";
//import My_Order_UI from "./component/order/myOrder";
import Home_User_UI from "./component/Home/Home_User_UI";
import All_My_Account_UI from "./component/account/All_My_Account_UI";
import UserFullAppBar from "./component/FullAppBar/UserFullAppBar";
import Edit_post_UI from "./component/Edit_post/Edit_post";
import My_Basket_UI from "./component/Basket/myBasket";
import My_Order_UI from "./component/order/myOrder";
import My_Profile_UI from "./component/user/My_Profile_UI";
import My_Bought_UI from "./component/bought/Bought_UI";
import Individual_Post_UI from "./component/IndividualPost/Individual_Post_UI";

export default function App() {
  const [token, setToken] = React.useState<String>("");

  React.useEffect(() => {
    document.title = "Game Exchange";
    const token = localStorage.getItem("token");
    if (token) {
      setToken(token);
    }
  }, []);

  if (token) {
    return (
      <Router>
        <div className="background-all">
          <div className="div-AppBar">
            <UserFullAppBar />
          </div>
          <div>{routeList()}</div>
          <div className="end" />
        </div>
      </Router>
    );
  }

  function routeList() {
    return (
      <>
        <Routes>
          <Route path="/" element={<Home_User_UI />} />
          <Route path="/MyProfile" element={<My_Profile_UI />} />
          <Route path="/Profile/:profile_name" element={<User_Profile_UI />} />
          <Route path="/AllMyAccount" element={<All_My_Account_UI />} />
          <Route path="/edit_post/:id" element={<Edit_post_UI />} />
          <Route path="/MyOrder" element={<My_Order_UI />} />
          <Route path="/MyBasket" element={<My_Basket_UI />} />
          <Route path="/AlreadyBought" element={<My_Bought_UI />} />
          <Route path="/Individual_Post/:account_id" element={<Individual_Post_UI />} />
        </Routes>
      </>
    );
  }

  return <SignIn_User />;
}
