// packages
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { Eye, EyeOff, LoaderCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { withMask } from 'use-mask-input'

// components
import { Form, FormField, FormItem, FormControl, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

// store
import { useAuthStore } from '@/store/auth'

// hooks
import { useToast } from '@/hooks/use-toast'

// lib
import { api } from '@/lib/axios'

// constants
import { HTTP_STATUS_CODE } from '@/constants/http'

// entities
import { loginSchema, LoginSchema } from '@/entities/user/user'

// variables
const loc = `@/components/forms/login-form`

export function LoginForm() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuthStore()
  const [isShowingPassword, setIsShowingPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      cpf: process.env.NODE_ENV === 'development' ? '000.000.000-00' : '',
      password: process.env.NODE_ENV === 'development' ? 'teste' : ''
    }
  })

  async function _auth() {
    try {
      setIsLoading(true)

      const body = { ...form.getValues(), action: 'login' }
      const response = await api.post(`/auth`, body)

      if (response.data?.statusCode === HTTP_STATUS_CODE.OK) {
        const user = response.data.body[0]
        const token = response.data.token
        toast({ variant: 'success', title: 'Sucesso', description: 'Você será redirecionado ...' })
        setTimeout(() => login(user, token), 500)
      } else toast({ variant: 'destructive', title: 'Ops ...', description: response.data?.statusMessage || 'Credenciais incorretas.' })
    } catch (err) {
      console.error(`Unhandled rejection at ${loc}._auth function. Details: ${err}`)
      toast({ variant: 'destructive', title: 'Ops ...', description: 'Não foi possível realizar o login.' })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) navigate('/home')
  }, [isAuthenticated])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(_auth)} className="w-full disabled:cursor-not-allowed flex flex-col gap-6">
        <FormField
          control={form.control}
          name={'cpf'}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2">
              <FormLabel className="text-sm">CPF</FormLabel>

              <FormControl>
                <Input {...field} ref={withMask('cpf')} disabled={isLoading} className="rounded-sm border border-solid border-gray-700 bg-gray-900 text-gray-100 text-base placeholder:text-gray-400 transition-colors h-[48px]" placeholder="Seu CPF" />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={'password'}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2">
              <FormLabel className="text-sm">Senha</FormLabel>

              <FormControl>
                <div className="relative group">
                  <Input {...field} disabled={isLoading} type={isShowingPassword ? 'text' : 'password'} className="rounded-sm border border-solid border-gray-700 bg-gray-900 text-gray-100 text-base placeholder:text-gray-400 transition-colors h-[48px]" placeholder="Sua senha" />
                  {isShowingPassword ? (
                    <EyeOff className="absolute top-[calc(50%_-_12px)] right-4 size-6 text-gray-500 group-focus-within:text-primary-text hover:cursor-pointer" onClick={() => setIsShowingPassword(false)} />
                  ) : (
                    <Eye className="absolute top-[calc(50%_-_12px)] right-4 size-6 text-gray-500 group-focus-within:text-primary-text hover:cursor-pointer" onClick={() => setIsShowingPassword(true)} />
                  )}
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button variant="default" type="submit" className="h-[48px] rounded-sm transition-colors ease-in-out duration-200 font-bold disabled:opacity-50 disabled:cursor-not-allowed disabled:select-none border-none cursor-pointer px-8 py-3 text-base leading-6 mt-6" disabled={isLoading}>
          {isLoading ? <LoaderCircle className="size-6 animate-spin" /> : 'Entrar'}
        </Button>
      </form>
    </Form>
  )
}
