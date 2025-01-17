// packages
import { useState } from 'react'
import { Check, Clock, Dices, HandCoins } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { withMask } from 'use-mask-input'

// components
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from '@/components/ui/form'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'

// entities
import { formatted_game_type, game_type, GameProps, UpdateGameSchema, updateGameSchema } from '@/entities/game/game'

// store
import { useAuthStore } from '@/store/auth'

// hooks
import { useToast } from '@/hooks/use-toast'

// lib
import { api } from '@/lib/axios'

// constants
import { HTTP_STATUS_CODE } from '@/constants/http'

// types
type UpdateGameFormProps = {
  game: GameProps
}

// variables
const loc = 'components/forms/update-game-form'

export function UpdateGameForm({ game }: UpdateGameFormProps) {
  const { user } = useAuthStore()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const form = useForm<UpdateGameSchema>({
    resolver: zodResolver(updateGameSchema),
    defaultValues: {
      userRef: user?.ref,
      ...(game || {})
    }
  })

  async function _updateGame() {
    try {
      setIsLoading(true)

      const response = await api.put(`/`, {
        action: 'game',
        ...form.getValues()
      })

      if (response.data?.statusCode === HTTP_STATUS_CODE.OK) {
        toast({ variant: 'success', title: 'Sucesso', description: response.data?.statusMessage || 'Jogo atualizado com sucesso.' })
      } else toast({ variant: 'destructive', title: 'Ops ...', description: response.data?.statusMessage || 'Não foi possível atualizar o jogo.' })
    } catch (err) {
      console.error(`Unhandled rejection at ${loc}._updateGame function. Details: ${err}`)
      toast({ variant: 'destructive', title: 'Ops ...', description: 'Não foi possível atualizar o jogo.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(_updateGame)} className="flex flex-col gap-2 text-background">
        {/* DATE TIME */}
        <FormField
          control={form.control}
          name="dateTime"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Data e hora:</FormLabel>
              <FormControl>
                <div className="flex justify-between items-center">
                  <div className="h-full bg-muted-foreground flex items-center justify-center rounded-l-md p-2">
                    <Clock className="size-6" />
                  </div>

                  <Input {...field} ref={withMask('99/99/9999 99:99')} className="!text-center text-xl rounded-l-none" placeholder="Digite a data e hora" disabled={isLoading} />
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* TYPE */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Tipo:</FormLabel>
              <FormControl>
                <div className="flex justify-between items-center">
                  <div className="h-full bg-muted-foreground flex items-center justify-center rounded-l-md p-2">
                    <Dices className="size-6" />
                  </div>

                  <Select disabled={isLoading} onValueChange={value => field.onChange(value)} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(formatted_game_type).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ticketPrice"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Preço de cartela:</FormLabel>
              <FormControl>
                <div className="flex justify-between items-center">
                  <div className="h-full bg-muted-foreground flex items-center justify-center rounded-l-md p-1">
                    <span className="text-background text-2xl font-bold">R$</span>
                  </div>

                  <Input {...field} type="number" className="!text-center text-xl rounded-l-none" placeholder="Digite o preço" disabled={isLoading} />
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* FIRST PRIZE VALUE */}
        <FormField
          control={form.control}
          name="firstPrizeValue"
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

        {/* SECOND PRIZE VALUE */}
        <FormField
          control={form.control}
          name="secondPrizeValue"
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

        {/* THIRD PRIZE VALUE */}
        <FormField
          control={form.control}
          name="thirdPrizeValue"
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

        {/* GRANTED PRIZES */}
        <FormField
          control={form.control}
          name="grantedPrizes"
          render={({ field }) => (
            <FormItem className="w-full mt-2">
              <FormControl>
                <div className="flex items-center gap-x-2">
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isLoading} />
                  <Label className="text-md group-hover:cursor-pointer">Prêmios garantidos</Label>
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
