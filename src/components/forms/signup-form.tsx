// packages
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Eye, EyeOff, LoaderCircle } from 'lucide-react'
import { withMask } from 'use-mask-input'
import { useSearchParams } from 'react-router-dom'

// components
import { Form, FormField, FormItem, FormControl, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

// hooks
import { useToast } from '@/hooks/use-toast'

// utils
import { formatPTBRDateToUSDate } from '@/utils/dates-util'

// lib
import { api } from '@/lib/axios'

// entities
import { createUserSchema, CreateUserSchema } from '@/entities/user/user'

// types
import { AuthContextProps } from '@/types/auth/auth-types'
import { HTTP_STATUS_CODE } from '@/constants/http'
type SignupFormProps = {
  changeContext(context: AuthContextProps): void
}

// variables
const loc = `@/components/forms/signup-form`

export function SignUpForm({ changeContext }: SignupFormProps) {
  const { toast } = useToast()
  const [searchParams] = useSearchParams()
  const [isShowingPassword, setIsShowingPassword] = useState<boolean>(false)
  const [isShowingPasswordConfirm, setIsShowingPasswordConfirm] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const form = useForm<CreateUserSchema>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      userRef: searchParams.get('ref') ?? undefined,
      src: searchParams.get('src') ?? undefined
    }
  })

  async function _createUser() {
    try {
      setIsLoading(true)

      const data = form.getValues()

      const body = {
        ...data,
        action: 'user',
        birthDate: data.birthDate ? (formatPTBRDateToUSDate(data.birthDate) as string) : undefined
      }

      const response = await api.post(`/`, body)

      if ([HTTP_STATUS_CODE.CREATED].includes(response.data?.statusCode)) {
        toast({ variant: 'success', title: 'Sucesso', description: response.data?.statusMessage || 'Cadastrado com sucesso.' })
        changeContext('LOGIN')
      } else toast({ variant: 'destructive', title: 'Ops ...', description: response.data?.statusMessage || 'Não foi possível cadastrar o usuário.' })
    } catch (err) {
      console.error(`Unhandled rejection at ${loc}._createUser function. Details: ${err}`)
      toast({ variant: 'destructive', title: 'Ops ...', description: 'Não foi possível cadastrar o usuário.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(_createUser)} className="w-full disabled:cursor-not-allowed flex flex-col gap-6">
        <FormField
          control={form.control}
          name={'name'}
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-sm">Nome Completo</FormLabel>

              <FormControl>
                <Input {...field} disabled={isLoading} className="rounded-sm border border-solid transition-colors h-[48px]" placeholder="Seu nome" />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex smAndDown:flex-wrap gap-x-2 gap-y-6 w-full">
          <FormField
            control={form.control}
            name={'cpf'}
            render={({ field }) => (
              <FormItem className="w-full flex-col">
                <FormLabel className="text-sm">CPF</FormLabel>

                <FormControl>
                  <Input {...field} ref={withMask('cpf')} disabled={isLoading} className="rounded-sm border border-solid transition-colors h-[48px]" placeholder="Seu CPF" />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={'phone'}
            render={({ field }) => (
              <FormItem className="w-full flex-col">
                <FormLabel className="text-sm">Celular</FormLabel>

                <FormControl>
                  <Input {...field} ref={withMask('(99) 99999 - 9999')} disabled={isLoading} className="rounded-sm border border-solid transition-colors h-[48px]" placeholder="Seu celular" />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex smAndDown:flex-wrap gap-x-2 gap-y-6 w-full">
          <FormField
            control={form.control}
            name={'email'}
            render={({ field }) => (
              <FormItem className="w-full flex-col">
                <FormLabel className="text-sm">E-mail</FormLabel>

                <FormControl>
                  <Input {...field} disabled={isLoading} className="rounded-sm border border-solid transition-colors h-[48px]" placeholder="Seu e-mail" />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={'birthDate'}
            render={({ field }) => (
              <FormItem className="w-full flex-col">
                <FormLabel className="text-sm">Data de Nascimento</FormLabel>

                <FormControl>
                  <Input {...field} ref={withMask('99/99/9999')} disabled={isLoading} className="rounded-sm border border-solid transition-colors h-[48px]" placeholder="Sua data de nascimento" />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name={'password'}
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-sm">Senha</FormLabel>

              <FormControl>
                <div className="relative group">
                  <Input {...field} disabled={isLoading} type={isShowingPassword ? 'text' : 'password'} className="rounded-sm border border-solid transition-colors h-[48px]" placeholder="Sua senha" />
                  {isShowingPassword ? (
                    <EyeOff className="absolute top-[calc(50%_-_12px)] right-4 size-6 text-gray-500 group-focus-within:text-primary hover:cursor-pointer" onClick={() => !isLoading && setIsShowingPassword(false)} />
                  ) : (
                    <Eye className="absolute top-[calc(50%_-_12px)] right-4 size-6 text-gray-500 group-focus-within:text-primary hover:cursor-pointer" onClick={() => !isLoading && setIsShowingPassword(true)} />
                  )}
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={'passwordConfirm'}
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-sm">Confirme a senha</FormLabel>

              <FormControl>
                <div className="relative group">
                  <Input {...field} disabled={isLoading} type={isShowingPasswordConfirm ? 'text' : 'password'} className="rounded-sm border border-solid transition-colors h-[48px]" placeholder="Sua senha novamente" />
                  {isShowingPasswordConfirm ? (
                    <EyeOff className="absolute top-[calc(50%_-_12px)] right-4 size-6 text-gray-500 group-focus-within:text-primary hover:cursor-pointer" onClick={() => !isLoading && setIsShowingPasswordConfirm(false)} />
                  ) : (
                    <Eye className="absolute top-[calc(50%_-_12px)] right-4 size-6 text-gray-500 group-focus-within:text-primary hover:cursor-pointer" onClick={() => !isLoading && setIsShowingPasswordConfirm(true)} />
                  )}
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {Object.values(form.formState.errors || {})?.some(e => e.type === 'custom') && (
          <FormMessage>
            {Object.values(form.formState.errors)
              .filter(e => e.type === 'custom')
              .reduce((total, current) => (total += `${current?.message?.split('.').join('')}, `), '')
              .slice(0, -2)}
          </FormMessage>
        )}

        <Button variant="default" type="submit" className="h-[48px] rounded-sm transition-colors ease-in-out duration-200 font-bold disabled:opacity-50 disabled:cursor-not-allowed disabled:select-none border-none cursor-pointer px-8 py-3 text-base leading-6" disabled={isLoading}>
          {isLoading ? <LoaderCircle className="size-6 animate-spin" /> : 'Cadastrar'}
        </Button>

        <span className="text-primary-text brightness-150 font-medium hover:underline hover:cursor-pointer text-center" onClick={() => !isLoading && changeContext('LOGIN')}>
          Já possui conta? Faça login!
        </span>
      </form>
    </Form>
  )
}
