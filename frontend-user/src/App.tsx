/* eslint-disable react/jsx-pascal-case */
import * as React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import SignIn_User from "./component/SignIn/SignIn_User_UI";
import User_Profile_UI from "./component/user/User_Profile_UI";
//import My_Order_UI from "./component/order/myOrder";
import Home_User_UI from "./component/Home/Home_User_UI";
import UserFullAppBar from "./component/FullAppBar/UserFullAppBar";
import Edit_post_UI from "./component/Edit_post/Edit_post";
import My_Basket_UI from "./component/Basket/myBasket";
import My_Order_UI from "./component/order/myOrder";
import My_Profile_UI from "./component/user/My_Profile_UI";
import My_Bought_UI from "./component/bought/Bought_UI";
import Individual_Post_UI from "./component/IndividualPost/Individual_Post_UI";
import ReqSeller_Register_UI from "./component/ReqSeller/ReqSeller_Register_UI";
import ReqSeller_Status_Table_UI from "./component/ReqSeller/ReqSeller_Status_Table_UI";
import Game_Account_UI from "./component/account/Game_Account_UI";
import ReqGame_Status_Table_UI from "./component/ReqGame/ReqGame_UI";

export default function App() {
  const [token, setToken] = React.useState<String>("");

  function routeList() {
    return (
      <>
        <Routes>
          <Route path="/" element={<Home_User_UI />} />
          <Route path="/MyProfile" element={<My_Profile_UI />} />
          <Route path="/Profile/:profile_name" element={<User_Profile_UI />} />
          <Route path="/GameAccount" element={<Game_Account_UI />} />
          <Route path="/edit_post/:id" element={<Edit_post_UI />} />
          <Route path="/MyOrder" element={<My_Order_UI />} />
          <Route path="/MyBasket" element={<My_Basket_UI />} />
          <Route path="/AlreadyBought" element={<My_Bought_UI />} />
          <Route
            path="/Individual_Post/:account_id"
            element={<Individual_Post_UI />}
          />
          <Route path="/Status_Seller" element={<ReqSeller_Status_Table_UI />} />
          <Route path="/RequestSeller/Re-register" element={<ReqSeller_Register_UI />} />
          <Route path="/RequestGame" element={<ReqGame_Status_Table_UI />} />
        </Routes>
      </>
    );
  }

  React.useEffect(() => {
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
  } else {
    return <SignIn_User />;
  }
}
