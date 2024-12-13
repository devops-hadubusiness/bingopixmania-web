// packages
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

// components
import { Form, FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// auth
import { useAuth } from "@/auth/auth-provider";

// hooks
import { useToast } from "@/hooks/use-toast";

// lib
import { api } from "@/lib/axios";

// constants
import { HTTP_STATUS_CODE } from "@/constants/http";

// entities
import { loginSchema, LoginSchema } from "@/entities/user/user";

export function LoginForm() {
  const { login, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isShowingPassword, setIsShowingPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: process.env.NODE_ENV === "development" ? "teste@teste.com" : "",
      password: process.env.NODE_ENV === "development" ? "teste" : "",
    },
  });

  async function _auth() {
    try {
      setIsLoading(true);
      const body = { ...form.getValues(), action: "login" };
      const response = await api.post(`/auth`, body);
      if (response.data?.statusCode === HTTP_STATUS_CODE.OK) {
        let user = response.data.body[0];
        const company = user.companies[0];
        delete user.companies;
        const token = response.data.token;
        login(user, token, company);
      } else {
        toast({
          variant: "destructive",
          title: "Ops ...",
          description: response.data?.statusMessage || "Credenciais incorretas.",
        });
      }
    } catch (err) {
      console.error(`Unhandled rejection at @/pages/Login._auth function. Details: ${err}`);
      toast({
        variant: "destructive",
        title: "Ops ...",
        description: "Não foi possível realizar o login.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (isAuthenticated) navigate("/sessoes");
  }, [isAuthenticated]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(_auth)} className="w-full disabled:cursor-not-allowed flex flex-col gap-6">
        <FormField
          control={form.control}
          name={"email"}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2">
              <FormLabel className="text-sm text-gray-200">E-mail</FormLabel>

              <FormControl>
                <Input {...field} disabled={isLoading} className="rounded-sm border border-solid border-gray-700 bg-gray-900 text-gray-100 text-base placeholder:text-gray-400 transition-colors h-[48px]" placeholder="Seu e-mail" />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={"password"}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2">
              <FormLabel className="text-sm text-gray-200">Senha</FormLabel>

              <FormControl>
                <div className="relative group">
                  <Input {...field} disabled={isLoading} type={isShowingPassword ? "text" : "password"} className="rounded-sm border border-solid border-gray-700 bg-gray-900 text-gray-100 text-base placeholder:text-gray-400 transition-colors h-[48px]" placeholder="Sua senha" />
                  {isShowingPassword ? (
                    <EyeOff className="absolute top-[calc(50%_-_12px)] right-4 size-6 text-gray-500 group-focus-within:text-primary hover:cursor-pointer" onClick={() => setIsShowingPassword(false)} />
                  ) : (
                    <Eye className="absolute top-[calc(50%_-_12px)] right-4 size-6 text-gray-500 group-focus-within:text-primary hover:cursor-pointer" onClick={() => setIsShowingPassword(true)} />
                  )}
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button variant="default" type="submit" className="h-[48px] rounded-sm transition-colors ease-in-out duration-200 font-bold disabled:opacity-50 disabled:cursor-not-allowed disabled:select-none border-none cursor-pointer px-8 py-3 text-base leading-6 mt-6" disabled={isLoading}>
          {isLoading ? <LoaderCircle className="size-6 animate-spin" /> : "Entrar"}
        </Button>
      </form>
    </Form>
  );
}
