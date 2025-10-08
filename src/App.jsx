// src/App.js
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import IMC from "./components/imc";
import Home from "./components/home";
import NotFound from "./components/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/IMC" element={<IMC />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
