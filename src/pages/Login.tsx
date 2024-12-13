// packages
import { ChevronRight } from 'lucide-react'

// components
import { LoginForm } from '@/components/forms/login-form'

// styles
import '@/styles/pages/login.css'

function Login() {
  return (
    <div className="h-screen w-full flex-1 flex flex-row-reverse">
      <div className="lgAndDown:hidden xl:w-1/2 xlAndUp:w-2/3 h-full bg-gray-850 bg-pattern bg-no-repeat bg-center relative flex items-center justify-center">
        {/* <img src="/images/misc/wpp.png" width={600} height={26} alt="Descomplizap" /> */}
      </div>

      <div className="lgAndDown:w-full xl:w-1/2 xlAndUp:w-1/3 h-full bg-gray-850 p-20 overflow-auto relative flex flex-col overflow-hidden">
        <div className="flex gap-x-2">
          <img src="/images/logos/logo-icon-green.svg" width={26} height={26} alt="Descomplizap" />
          <img src="/images/logos/logo-dark.svg" width={300} height={26} alt="Descomplizap" />
        </div>

        <h1 className="font-jakarta font-bold text-gray-200 text-2xl mt-16 mb-12">Acesse sua conta</h1>

        <LoginForm />

        <a href="/alterar-senha" target="_self" className="mt-16">
          <div className="w-full flex gap-4 px-6 py-4 bg-gray-700 border border-gray-700 hover:brightness-125 transition rounded-md relative group">
            <div className="flex flex-col">
              <span className="text-gray-200">Esqueceu sua senha?</span>
              <span className="text-primary brightness-150 font-medium">Recupere-a agora!</span>
            </div>

            <ChevronRight className="size-4 text-gray-500 absolute right-3 top-[calc(50%_-_8px)] group-hover:text-primary" />
          </div>
        </a>
      </div>
    </div>
  )
}

export default Login