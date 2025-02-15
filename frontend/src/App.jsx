import React, { useContext, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Tournaments from "./components/AllTournaments";
import Header from "./components/Header";
import Participate from "./components/Participate";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import { AuthContext, AuthProvider } from "./AuthContext";

function Logout() {
  const { setUser } = useContext(AuthContext);

  useEffect(() => {
    localStorage.clear();
    setUser(null);
  }, [setUser]);

  return <Navigate to="/login/" />;
}

const App = () => {
  return (
    <AuthProvider>
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
          <Route path="/participate/:tournamentId" element={<Participate />} />
          <Route path="/tournaments" element={<Tournaments />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
