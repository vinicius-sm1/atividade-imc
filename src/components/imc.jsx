import React, { useState } from "react";
import Header from "./header";
import InputForm from "./InputForm";
import Result from "./result";

const IMC = () => {
  const [imc, setImc] = useState(null);
  const [mensagemSalvo, setMensagemSalvo] = useState("");

  // Determinar categoria do IMC
  const getCategoria = (imcValue) => {
    if (imcValue < 18.5) return "Abaixo do peso";
    if (imcValue >= 18.5 && imcValue <= 24.9) return "Peso normal";
    if (imcValue >= 25.0 && imcValue <= 29.9) return "Sobrepeso";
    if (imcValue >= 30.0 && imcValue <= 34.9) return "Obesidade 1";
    if (imcValue >= 35.0 && imcValue <= 39.9) return "Obesidade 2";
    if (imcValue >= 40.0) return "Obesidade 3";
  };

  // Salvar cálculo no backend
  const salvarCalculo = async (imcCalculado, peso, altura) => {
    const token = localStorage.getItem("token");
    const categoria = getCategoria(imcCalculado);

    if (token) {
      try {
        const resposta = await fetch("http://localhost:3001/api/imc/save", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            peso: parseFloat(peso),
            altura: parseFloat(altura),
            imc: imcCalculado,
            categoria,
          }),
        });

        if (resposta.ok) {
          setMensagemSalvo("Cálculo salvo no histórico!");
          setTimeout(() => setMensagemSalvo(""), 3000);
        }
      } catch (error) {
        console.error("Erro ao salvar cálculo:", error);
        setMensagemSalvo("Erro ao salvar no histórico");
        setTimeout(() => setMensagemSalvo(""), 3000);
      }
    }
  };

  const fazerCalculo = (imcCalculado, peso, altura) => {
    setImc(imcCalculado);

    salvarCalculo(imcCalculado, peso, altura);
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

          {mensagemSalvo && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded text-center">
              {mensagemSalvo}
            </div>
          )}

          <main>
            <InputForm onCalculo={fazerCalculo} />
            <Result imc={imc} />
          </main>
        </div>
      </div>
    </>
  );
};

export default IMC;
