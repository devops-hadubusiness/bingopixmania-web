// packages
import { ChevronRight } from "lucide-react";

// components
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "@/components/forms/login-form";

// styles
import "@/styles/pages/login.css";

function Login() {
  return (
    <div className="h-screen w-full flex-1 flex flex-row-reverse">
      <div className="lgAndDown:hidden xl:w-1/2 xlAndUp:w-2/3 h-full bg-gray-700 relative flex items-center justify-center">
        {/* <img src="/images/misc/wpp.png" width={600} height={26} alt="Descomplizap" /> */}
        <span className="text-3xl text-primary-text-foreground">BANNER/CARROSSEL AQUI</span>
      </div>

      <div className="lgAndDown:w-full xl:w-1/2 xlAndUp:w-1/3 h-full p-20 overflow-auto relative flex flex-col overflow-hidden bg-gray-850">
        <div className="flex gap-x-2">
          <img src="/images/logos/logo.svg" width={300} height={26} alt="Bingo Pix Mania" className="-my-12" />
        </div>

        <Tabs defaultValue="LOGIN" className="w-full">
          <TabsList className="bg-primary/75 rounded-full">
            <TabsTrigger value="LOGIN" className="rounded-full">
              Login
            </TabsTrigger>

            <TabsTrigger value="SIGNUP" className="rounded-full">
              Cadastro
            </TabsTrigger>
          </TabsList>

          <TabsContent value="LOGIN" className="pt-6">
            <LoginForm />
          </TabsContent>

          <TabsContent value="SIGNUP" className="pt-6">
            <h1 className="font-jakarta font-bold text-primary-text text-center text-2xl mt-16 mb-12">Cadastro</h1>
          </TabsContent>
        </Tabs>

        <a href="/alterar-senha" target="_self" className="mt-16">
          <div className="w-full flex gap-4 px-6 py-4 bg-gray-700 border border-gray-700 hover:brightness-125 transition rounded-md relative group">
            <div className="flex flex-col">
              <span className="text-primary-text-foreground">Esqueceu sua senha?</span>
            </div>

            <ChevronRight className="size-4 text-gray-500 absolute right-3 top-[calc(50%_-_8px)] group-hover:text-primary-text" />
          </div>
        </a>
      </div>
    </div>
  );
}

export default Login;
