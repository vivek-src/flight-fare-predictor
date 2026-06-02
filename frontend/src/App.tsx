import Form from "./components/form.tsx";

export default function App() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center py-16 px-4 bg-[#f0f3ff]">
      <header className="mb-16 text-center space-y-4">
        <h1 className="text-6xl md:text-7xl font-black tracking-tight text-[#2d3436]">
          Flight<span className="text-[#6c5ce7]">Fare</span> Predictor
        </h1>
        <p className="text-lg font-medium text-[#636e72]">
          Your friendly flight price companion
        </p>
      </header>

      <main className="w-full max-w-5xl">
        <Form />
      </main>

      <footer className="mt-24 pb-12">
        <div className="clay-card px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-[#636e72]">
          © Vivek Sahu
        </div>
      </footer>
    </div>
  );
}
