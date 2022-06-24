import React from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Home from "../routes/Home";
import Auth from "../routes/Auth";
import Navigation from "./Naviacation";
import Profile from "../routes/Profile";
import { Navigate } from "react-router-dom";
const AppRouter = ({ isLoggedin, userObj, refreshUser }) => {
  return (
    <Router>
      {isLoggedin && <Navigation userObj={userObj} />}
      <div
        style={{
          maxWidth: 890,
          width: "100%",
          margin: "0 auto",
          marginTop: 80,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Routes>
          {isLoggedin ? (
            <>
              <Route
                exact
                path="/"
                element={<Home userObj={userObj} />}
              ></Route>
              <Route
                exact
                path="/profile"
                element={
                  <Profile userObj={userObj} refreshUser={refreshUser} />
                }
              ></Route>
            </>
          ) : (
            <>
              <Route exact path="/" element={<Auth />}></Route>
              <Route
                path="*"
                element={<Navigate replace to="/"></Navigate>}
              ></Route>
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
};

export default AppRouter;
