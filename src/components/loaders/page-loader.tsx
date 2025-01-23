// styles
import '@/styles/components/loaders/page-loader.css'

export default function PageLoader() {
  return (
    // <main className="p-24 min-h-screen w-full bg-zinc-800 bg-center bg-no-repeat flex flex-col align-center justify-center text-center bg-pattern">
    <main className="p-24 min-h-screen w-full flex flex-col align-center justify-center text-center bg-primary">
      <div className="flex flex-col m-auto items-center justify-center text-zinc-200">
        {/* Shadow element */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-4 bg-blue-500/20 rounded-full blur-xl animate-shadow"></div>

        {/* Logo image with bounce animation */}
        <img src="/images/logos/logo.svg" alt="Bingo Pix Mania" className="w-64 relative animate-bounce-custom hover:scale-105 transition-transform duration-300" style={{ animationDuration: '2s' }} />

        <div className="loader">
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
        <span className="text-xl font-semibold mt-8">Carregando ...</span>
      </div>
    </main>
  )
}
