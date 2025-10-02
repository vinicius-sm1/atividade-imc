import React, { useState } from "react";
import Header from "./header";
import InputForm from "./InputForm";
import Result from "./result";

const App = () => {
  const [imc, setImc] = useState(null);

  const fazerCalculo = (imcCalculado) => {
    setImc(imcCalculado);
  };
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Calculadora de IMC
            </h1>
            <p className="text-gray-600 text-lg">
              Calcule seu Índice de Massa Corporal
            </p>
          </div>

          <main>
            <InputForm onCalculo={fazerCalculo} />
            <Result imc={imc} />
          </main>
        </div>
      </div>
    </>
  );
};

export default App;
