import { useState, useEffect } from "react";
import { TrashIcon, ChartBarIcon } from "@heroicons/react/24/outline";
import Header from "./header";

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3001/api/imc/history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao buscar histórico");
      }

      setHistory(data.history);
    } catch (error) {
      setErro(error.message);
    } finally {
      setLoading(false);
    }
  };

  const deletar = async (id) => {
    if (!confirm("Deseja realmente deletar este registro?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3001/api/imc/history/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao deletar registro");
      }

      // Atualiza a lista removendo o item deletado
      const novoHistorico = history.filter((item) => item.id !== id);
      setHistory(novoHistorico);
    } catch (error) {
      alert(error.message);
    }
  };

  const formatadata = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCategoriaStyles = (categoria) => {
    const styles = {
      "Abaixo do peso": "bg-blue-100 text-blue-800 border-blue-200",
      "Peso normal": "bg-green-100 text-green-800 border-green-200",
      Sobrepeso: "bg-orange-100 text-orange-800 border-orange-200",
      "Obesidade 1": "bg-red-100 text-red-800 border-red-200",
      "Obesidade 2": "bg-red-200 text-red-900 border-red-300",
      "Obesidade 3": "bg-red-300 text-red-950 border-red-400",
    };
    return styles[categoria] || "bg-gray-100 text-gray-800";
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Histórico de Cálculos
            </h1>
            <p className="text-gray-600 text-lg">
              Acompanhe sua evolução ao longo do tempo
            </p>
          </div>

          <main>
            {erro && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {erro}
              </div>
            )}

            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="text-gray-600 mt-4">Carregando histórico...</p>
              </div>
            ) : history.length === 0 ? (
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <ChartBarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg mb-4">
                  Você ainda não fez nenhum cálculo de IMC.
                </p>
                <a
                  href="/IMC"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md transition-colors"
                >
                  Calcular IMC
                </a>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {history.map((record) => (
                    <div
                      key={record.id}
                      className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-3 flex-wrap">
                            <span className="text-3xl font-bold text-gray-800">
                              IMC: {parseFloat(record.imc).toFixed(2)}
                            </span>
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-semibold border ${getCategoriaStyles(
                                record.categoria
                              )}`}
                            >
                              {record.categoria}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <span className="font-medium mr-2">Peso:</span>
                              <span className="text-lg font-semibold text-gray-800">
                                {parseFloat(record.peso).toFixed(1)} kg
                              </span>
                            </div>
                            <div className="flex items-center">
                              <span className="font-medium mr-2">Altura:</span>
                              <span className="text-lg font-semibold text-gray-800">
                                {parseFloat(record.altura).toFixed(2)} m
                              </span>
                            </div>
                          </div>

                          <div className="mt-3 flex items-center text-xs text-gray-500">
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            {formatadata(record.criado_em)}
                          </div>
                        </div>

                        <button
                          onClick={() => deletar(record.id)}
                          className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Deletar registro"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default History;
