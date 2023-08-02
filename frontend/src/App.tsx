import * as React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import SignIn_User from "./component/SignIn_User_UI";
import User_Profile_UI from "./component/user/User_Profile_UI";
//import My_Order_UI from "./component/order/myOrder";
import Home_User_UI from "./component/Home_User_UI";
import All_My_Account_UI from "./component/account/All_My_Account_UI";
import My_Revenue_Account_UI from "./component/RevenueAccount/myRevenueAccount";

export default function App() {
  const [token, setToken] = React.useState<String>("");

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setToken(token);
    }
  }, []);

  if (!token) {
    return <SignIn_User />;
  }

  function routeList() {
    return(
      <Routes>
        <Route path="/" element={<Home_User_UI/>} /> {/** home */}
        <Route path="/profile/:email" element={<User_Profile_UI/>} /> {/** user profile */}
        <Route path="/AllMyAccount" element={<All_My_Account_UI/>} /> {/** All Account */}
        {/**<Route path="/MyOrder" element={<My_Order_UI/>} />  My Order */}
        <Route path="/MyRevenueAccount" element={<My_Revenue_Account_UI/>} /> {/** My Revenue */}
      </Routes>
    );
  }
  

  return (
  <Router>
    <div>
      {routeList()}
    </div>
  </Router>
  );
}
