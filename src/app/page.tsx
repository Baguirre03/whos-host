import Header from "../components/Header";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6 text-black">
          Welcome to Hosts Host
        </h1>
        <p className="text-xl mb-4 text-gray-700">
          Find the perfect host for your next event or become a host yourself!
        </p>
      </main>
      <footer className="bg-black text-white py-4">
        <div className="container mx-auto text-center">
          &copy; 2023 Hosts Host. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
