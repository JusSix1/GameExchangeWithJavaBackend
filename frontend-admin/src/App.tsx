/* eslint-disable react/jsx-pascal-case */
import React from 'react';
import './App.css';
import SignIn_Admin from './component/SignIn/SignIn_Admin_UI';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminFullAppBar from './component/FullAppBar/AdminFullAppBar';

export default function App() {
  const [token, setToken] = React.useState<String>("");

  function routeList() {
    return (
      <>
        <Routes>
          {/* <Route path="/" element={<Home_Admin_UI />} /> */}
        </Routes>
      </>
    );
  }

  React.useEffect(() => {
    document.title = "Admin Exchange ";
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
            <AdminFullAppBar />
          </div>
          <div>{routeList()}</div>
          <div className="end" />
        </div>
      </Router>
    );
  } else {
    return <SignIn_Admin />;
  }
}
