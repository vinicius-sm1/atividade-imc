import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import IMC from "./components/imc";
import Home from "./components/home";
import NotFound from "./components/NotFound";
import Login from "./components/Login";
import Register from "./components/Register";
import History from "./components/History";
import Users from "./components/Users";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/IMC" element={<IMC />} />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
