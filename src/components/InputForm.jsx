import { useState } from "react";

const InputForm = ({ onCalculo }) => {
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");

  const fazerCalculo = () => {
    if (peso && altura) {
      const pesoNum = parseFloat(peso);
      const alturaNum = parseFloat(altura);

      if (pesoNum > 0 && alturaNum > 0) {
        const imc = pesoNum / (alturaNum * alturaNum);
        // Passa o IMC, peso e altura para o componente pai
        onCalculo(imc, peso, altura);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      fazerCalculo();
    }
  };

  return (
    <section className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Informe seus dados
      </h2>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="peso"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Peso (kg):
          </label>
          <input
            type="number"
            id="peso"
            value={peso}
            onChange={(e) => setPeso(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ex: 70"
            step="0.1"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        <div>
          <label
            htmlFor="altura"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Altura (m):
          </label>
          <input
            type="number"
            id="altura"
            value={altura}
            onChange={(e) => setAltura(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ex: 1.75"
            step="0.01"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        <button
          onClick={fazerCalculo}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Calcular IMC
        </button>
      </div>
    </section>
  );
};

export default InputForm;