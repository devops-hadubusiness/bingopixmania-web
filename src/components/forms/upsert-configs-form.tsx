// packages
import { useState } from 'react'
import { Check, Clock, HandCoins } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

// components
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from '@/components/ui/form'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

// entities
import { ConfigProps, UpsertConfigsSchema, upsertConfigsSchema } from '@/entities/config/config'

// store
import { useAuthStore } from '@/store/auth'

// hooks
import { useToast } from '@/hooks/use-toast'

// lib
import { api } from '@/lib/axios'
import { showConfirm } from '@/lib/alerts'

// constants
import { HTTP_STATUS_CODE } from '@/constants/http'

// types
type UpsertConfigsFormProps = {
  parentLoading: boolean
  configs?: ConfigProps
}

// variables
const loc = 'components/forms/upsert-configs-form'

export function UpsertConfigsForm({ parentLoading, configs }: UpsertConfigsFormProps) {
  const { user } = useAuthStore()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState<boolean>(parentLoading || false)

  const form = useForm<UpsertConfigsSchema>({
    resolver: zodResolver(upsertConfigsSchema),
    defaultValues: {
      userRef: user?.ref,
      ...(configs || {
        minDepositValue: 1,
        minGameTotalValueMultiplicator: 10,
        defaultFirstPrizeValue: 10,
        defaultSecondPrizeValue: 20,
        defaultThirdPrizeValue: 50,
        defaultTicketPrice: 0.5,
        defaultTimeBetweenGames: 10,
        isActiveHomePopup: true,
        isActiveDepositBonus: true
      })
    }
  })

  async function _upsertConfigs() {
    try {
      const confirm = await showConfirm('Deseja confirmar?')
      if (!confirm.isConfirmed) return

      setIsLoading(true)

      const response = await api.post(`/`, {
        ...form.getValues(),
        action: 'configs'
      })

      if ([HTTP_STATUS_CODE.OK, HTTP_STATUS_CODE.CREATED].includes(response.data?.statusCode)) {
        toast({ variant: 'success', title: 'Sucesso', description: response.data?.statusMessage || 'Configurações salvas com sucesso.' })
      } else toast({ variant: 'destructive', title: 'Ops ...', description: response.data?.statusMessage || 'Não foi possível salvar as configurações.' })
    } catch (err) {
      console.error(`Unhandled rejection at ${loc}._upsertConfigs function. Details: ${err}`)
      toast({ variant: 'destructive', title: 'Ops ...', description: 'Não foi possível salvar as configurações.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(_upsertConfigs)} className="flex flex-col gap-2 text-background">
        {/* MIN DEPOSIT VALUE */}
        <FormField
          control={form.control}
          name="minDepositValue"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Valor mínimo de depósito:</FormLabel>
              <FormControl>
                <div className="flex justify-between items-center">
                  <div className="h-full bg-muted-foreground flex items-center justify-center rounded-l-md p-1">
                    <span className="text-background text-2xl font-bold">R$</span>
                  </div>

                  <Input {...field} type="number" className="!text-center text-xl rounded-l-none" placeholder="Digite o valor" disabled={isLoading} />
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* MIN GAME TOTAL VALUE MULTIPLICATOR */}
        <FormField
          control={form.control}
          name="minGameTotalValueMultiplicator"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Multiplicador mínimo para início de jogo:</FormLabel>
              <FormControl>
                <div className="flex justify-between items-center">
                  <div className="h-full bg-muted-foreground flex items-center justify-center rounded-l-md p-2">
                    <HandCoins className="size-6" />
                  </div>

                  <Input {...field} type="number" className="!text-center text-xl rounded-l-none" placeholder="Digite o multiplicador" disabled={isLoading} />
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* DEFAULT FIRST PRIZE VALUE */}
        <FormField
          control={form.control}
          name="defaultFirstPrizeValue"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Valor de primeiro prêmio:</FormLabel>
              <FormControl>
                <div className="flex justify-between items-center">
                  <div className="h-full bg-muted-foreground flex items-center justify-center rounded-l-md p-1">
                    <span className="text-background text-2xl font-bold">R$</span>
                  </div>

                  <Input {...field} type="number" className="!text-center text-xl rounded-l-none" placeholder="Digite o valor" disabled={isLoading} />
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* DEFAULT SECOND PRIZE VALUE */}
        <FormField
          control={form.control}
          name="defaultSecondPrizeValue"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Valor de segundo prêmio:</FormLabel>
              <FormControl>
                <div className="flex justify-between items-center">
                  <div className="h-full bg-muted-foreground flex items-center justify-center rounded-l-md p-1">
                    <span className="text-background text-2xl font-bold">R$</span>
                  </div>

                  <Input {...field} type="number" className="!text-center text-xl rounded-l-none" placeholder="Digite o valor" disabled={isLoading} />
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* DEFAULT THIRD PRIZE VALUE */}
        <FormField
          control={form.control}
          name="defaultThirdPrizeValue"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Valor de terceiro prêmio:</FormLabel>
              <FormControl>
                <div className="flex justify-between items-center">
                  <div className="h-full bg-muted-foreground flex items-center justify-center rounded-l-md p-1">
                    <span className="text-background text-2xl font-bold">R$</span>
                  </div>

                  <Input {...field} type="number" className="!text-center text-xl rounded-l-none" placeholder="Digite o valor" disabled={isLoading} />
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* DEFAULT TICKET PRICE */}
        <FormField
          control={form.control}
          name="defaultTicketPrice"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Preço padrão de cartela:</FormLabel>
              <FormControl>
                <div className="flex justify-between items-center">
                  <div className="h-full bg-muted-foreground flex items-center justify-center rounded-l-md p-1">
                    <span className="text-background text-2xl font-bold">R$</span>
                  </div>

                  <Input {...field} type="number" step={0.25} className="!text-center text-xl rounded-l-none" placeholder="Digite o valor" disabled={isLoading} />
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* DEFAULT TIME BETWEEN GAMES */}
        <FormField
          control={form.control}
          name="defaultTimeBetweenGames"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Tempo padrão entre jogos:</FormLabel>
              <FormControl>
                <div className="flex justify-between items-center">
                  <div className="h-full bg-muted-foreground flex items-center justify-center rounded-l-md p-2">
                    <Clock className="size-6" />
                  </div>

                  <Input {...field} type="number" className="!text-center text-xl rounded-l-none" placeholder="Digite o tempo" disabled={true || isLoading} />
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* IS ACTIVE HOME POPUP */}
        <FormField
          control={form.control}
          name="isActiveHomePopup"
          render={({ field }) => (
            <FormItem className="w-full mt-2">
              <FormControl>
                <div className="flex items-center gap-x-2">
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isLoading} />
                  <Label className="text-md group-hover:cursor-pointer">Pop-up da Home ativo</Label>
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* IS ACTIVE DEPOSIT BONUS  */}
        <FormField
          control={form.control}
          name="isActiveDepositBonus"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <div className="flex items-center gap-x-2">
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isLoading} />
                  <Label className="text-md group-hover:cursor-pointer">Bônus de depósito ativo</Label>
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="w-full mt-4 pt-4 border-t border-zinc-300 flex items-center gap-x-2 justify-end">
          <Button variant="default" type="submit" className="flex gap-x-2 text-foreground" disabled={isLoading}>
            Salvar
            <Check className="size-5" />
          </Button>
        </div>
      </form>
    </Form>
  )
}
