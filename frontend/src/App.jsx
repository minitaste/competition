import React, { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Tournaments from "./components/AllTournaments";
import Header from "./components/Header";
import Participate from "./components/Participate";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import Schedule from "./pages/Schedule";

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
          path="/participate/:tournamentId/schedule"
          element={
            <ProtectedRoute>
              <Schedule />
            </ProtectedRoute>
          }
        />
        <Route path="/participate/:tournamentId" element={<Participate />}/>
        <Route path="/tournaments" element={<Tournaments />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
