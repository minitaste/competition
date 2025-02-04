import React, { useEffect } from "react";
import Register from "./pages/Register";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Participate from "./components/Participate";

function Logout() {
  useEffect(() => {
    localStorage.clear();
  }, []);
  return <Navigate to="/login/" />;
}


const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route
          path="/"
        element={
            <ProtectedRoute>
              <Home />

            </ProtectedRoute>
          }
        />
        <Route
          path="/participate"
          element={
            <ProtectedRoute>
              <Participate />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
