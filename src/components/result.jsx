const Result = ({ imc }) => {
  if (!imc) return null;

  const getCategoria = (imc) => {
    if (imc < 18.5) return "Abaixo do peso";
    if (imc >= 18.5 && imc <= 24.9) return "Peso normal";
    if (imc >= 25.0 && imc <= 29.9) return "Sobrepeso";
    if (imc >= 30.0) return "Obesidade";
  };

  const getCategoriaStyles = (imc) => {
    if (imc < 18.5) return "text-blue-600 bg-blue-50 border-blue-200";
    if (imc >= 18.5 && imc <= 24.9)
      return "text-green-600 bg-green-50 border-green-200";
    if (imc >= 25.0 && imc <= 29.9)
      return "text-orange-600 bg-orange-50 border-orange-200";
    if (imc >= 30.0) return "text-red-600 bg-red-50 border-red-200";
  };

  return (
    <section className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Seu Resultado
      </h2>

      <div className="text-center mb-6">
        <div className="inline-block bg-gray-100 rounded-lg p-6">
          <div className="text-3xl font-bold text-gray-800 mb-2">
            IMC: {imc.toFixed(2)}
          </div>
          <div
            className={`inline-block px-4 py-2 rounded-full border-2 font-semibold ${getCategoriaStyles(
              imc
            )}`}
          >
            {getCategoria(imc)}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-800 mb-3">
          Tabela de Referência:
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <div className="flex justify-between items-center p-2 bg-blue-50 text-blue-800 rounded">
            <span className="font-medium">Abaixo do peso</span>
            <span>&lt; 18.5</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-green-50 text-green-800 rounded">
            <span className="font-medium">Peso normal</span>
            <span>18.5 - 24.9</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-orange-50 text-orange-800 rounded">
            <span className="font-medium">Sobrepeso</span>
            <span>25.0 - 29.9</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-red-50 text-red-800 rounded">
            <span className="font-medium">Obesidade</span>
            <span>&ge; 30.0</span>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Result;
