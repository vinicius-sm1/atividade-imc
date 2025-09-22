import React, { useState } from "react";
import Header from "./components/header";
import InputForm from "./components/InputForm";
import Result from "./components/result";

const App = () => {
  const [imc, setImc] = useState(null);

  const fazerCalculo = (imcCalculado) => {
    setImc(imcCalculado);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Header />

        <main>
          <InputForm onCalculo={fazerCalculo} />
          <Result imc={imc} />
        </main>
      </div>
    </div>
  );
};

export default App;
