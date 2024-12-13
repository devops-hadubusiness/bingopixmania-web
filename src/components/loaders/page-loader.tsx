// styles
import "@/styles/components/loaders/page-loader.css";

export default function PageLoader() {
  return (
    <main className="p-24 min-h-screen w-full bg-zinc-800 bg-center bg-no-repeat flex flex-col align-center justify-center text-center bg-pattern">
      <div className="flex flex-col m-auto items-center justify-center text-zinc-200">
        <div className="loader">
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
        <span className="text-xl font-semibold mt-8">Carregando ...</span>
      </div>
    </main>
  );
}
