import Header from "./header";
const Home = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Fernando Prestes Ferramentas Digitais
            </h1>
          </div>

          <main>
            <section className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                Bem vindo ao nosso site, use a navbar acima para acessar as
                ferramentas disponíveis.
              </h2>
            </section>
          </main>
        </div>
      </div>
    </>
  );
};
export default Home;
