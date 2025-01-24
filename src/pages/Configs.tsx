// packages
import { useEffect, useState } from 'react'
import { Dices } from 'lucide-react'
import { format } from 'date-fns-tz'

// components
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { UpsertConfigsForm } from '@/components/forms/upsert-configs-form'
import { UpsertConfigsFormSkeleton } from '@/components/skeletons/components/forms/upsert-configs-form-skeleton'
import { UpdateGameForm } from '@/components/forms/update-game-form'
import { UpdateGameFormSkeleton } from '@/components/skeletons/components/forms/update-game-form-skeleton'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'

// entities
import { GameProps } from '@/entities/game/game'

// hooks
import { useToast } from '@/hooks/use-toast'
import { useConfigs } from '@/hooks/use-configs'

// lib
import { api } from '@/lib/axios'

// store
import { useAuthStore } from '@/store/auth'

// constants
import { HTTP_STATUS_CODE } from '@/constants/http'

// utils
import { timeZone } from '@/utils/dates-util'

// types
type ConfigContextProps = 'CONFIGS' | 'GAMES'

// variables
const loc = `@/pages/Deposit`

export default function ConfigsPage() {
  const { toast } = useToast()
  const { user } = useAuthStore()
  const {configs, loading: isLoadingConfigs, refetch: refetchConfigs} = useConfigs(user?.ref)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [selectedTab, setSelectedTab] = useState<ConfigContextProps>('CONFIGS')
  const [games, setGames] = useState<GameProps[]>([])
  const [selectedGame, setSelectedGame] = useState<GameProps>()

  const _fetchGames = async () => {
    try {
      setIsLoading(true)

      const response = await api.get(`/`, {
        params: {
          action: 'games',
          userRef: user?.ref
        }
      })

      if (response.data?.statusCode === HTTP_STATUS_CODE.OK) setGames(response.data.body)
      else toast({ variant: 'destructive', title: 'Ops ...', description: response.data?.statusMessage || 'Não foi possível buscar os jogos.' })
    } catch (err) {
      console.error(`Unhandled rejection at ${loc}._fetchGames function. Details: ${err}`)
      toast({ variant: 'destructive', title: 'Ops ...', description: 'Não foi possível buscar os jogos.' })
    } finally {
      setIsLoading(false)
    }
  }

  const _handleSelectGame = (gameRef: string) => {
    setIsLoading(true)
    setSelectedGame(games.find(g => g.ref === gameRef))
    setTimeout(() => setIsLoading(false), 250)
  }

  useEffect(() => {
    setIsLoading(isLoadingConfigs)
  }, [isLoadingConfigs])

  useEffect(() => {
    switch (selectedTab) {
      case 'CONFIGS':
        refetchConfigs()
        break

      case 'GAMES':
        _fetchGames()
        break
    }
  }, [selectedTab])

  useEffect(() => {
    if (games.length) setSelectedGame(games[0])
  }, [games])

  return (
    <div className="flex w-full flex-col items-center justify-center gap-y-4 p-8 relative">
      <div className="flex flex-col items-center justify-center gap-y-4 p-8 max-w-[475px] min-w-[475px]">
        <div className="bg-foreground flex flex-col gap-y-4 rounded-lg border border-4 border-primary p-4 w-full">
          <Tabs value={selectedTab} defaultValue={selectedTab} className="w-full">
            <div className="flex justify-between items-center gap-x-4">
              <TabsList className="bg-primary/75 rounded-full">
                <TabsTrigger value="CONFIGS" onClick={() => setSelectedTab('CONFIGS')} className="rounded-full">
                  Configurações
                </TabsTrigger>

                <TabsTrigger value="GAMES" onClick={() => setSelectedTab('GAMES')} className="rounded-full">
                  Jogos
                </TabsTrigger>
              </TabsList>

              {selectedTab === 'GAMES' && !!selectedGame && (
                <div className="flex justify-between items-center flex-grow">
                  <div className="h-full bg-muted-foreground flex items-center justify-center rounded-l-md p-2">
                    <Dices className="size-6 text-background" />
                  </div>

                  <Select disabled={isLoading} onValueChange={_handleSelectGame} value={selectedGame.ref}>
                    <SelectTrigger className="!text-center text-md rounded-l-none text-background">
                      <SelectValue placeholder="Selecione o jogo" />
                    </SelectTrigger>

                    <SelectContent>
                      {games.map((g, index) => (
                        <SelectItem key={index} value={g.ref} className="!text-center">
                          {format(new Date(g.dateTime), 'dd/MM/yyyy HH:mm', { timeZone })}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <TabsContent value="CONFIGS" className="pt-6">
              {!isLoading && <UpsertConfigsForm parentLoading={isLoading} configs={configs} />}
              {isLoading && <UpsertConfigsFormSkeleton />}
            </TabsContent>

            <TabsContent value="GAMES" className="pt-6">
              {!isLoading && !!selectedGame && <UpdateGameForm parentLoading={isLoading} game={selectedGame} />}
              {(isLoading || !selectedGame) && <UpdateGameFormSkeleton />}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
