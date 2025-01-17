// packages
import { useEffect, useState } from 'react'

// components
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { UpsertConfigsForm } from '@/components/forms/upsert-configs-form'
import { UpsertConfigsFormSkeleton } from '@/components/skeletons/components/forms/upsert-configs-form-skeleton'
import { UpdateGameForm } from '@/components/forms/update-game-form'
import { UpdateGameFormSkeleton } from '@/components/skeletons/components/forms/update-game-form-skeleton'

// entities
import { ConfigProps } from '@/entities/config/config'
import { GameProps } from '@/entities/game/game'

// hooks
import { useToast } from '@/hooks/use-toast'

// lib
import { api } from '@/lib/axios'
import { cn } from '@/lib/utils'

// store
import { useAuthStore } from '@/store/auth'

// constants
import { HTTP_STATUS_CODE } from '@/constants/http'

// variables
const loc = `@/pages/Deposit`

// types
type ConfigContextProps = 'CONFIGS' | 'GAMES'

export default function DepositPage() {
  const { toast } = useToast()
  const { user } = useAuthStore()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [selectedTab, setSelectedTab] = useState<ConfigContextProps>('GAMES')
  const [configs, setConfigs] = useState<ConfigProps>()
  const [games, setGames] = useState<GameProps[]>([])
  const [selectedGame, setSelectedGame] = useState<GameProps>()

  const _fetchConfigs = async () => {
    try {
      setIsLoading(true)

      const response = await api.get(`/`, {
        params: {
          action: 'configs',
          userRef: user?.ref
        }
      })

      if (response.data?.statusCode === HTTP_STATUS_CODE.OK) setConfigs(response.data.body[0])
      else toast({ variant: 'destructive', title: 'Ops ...', description: response.data?.statusMessage || 'Não foi possível buscar as configurações.' })
    } catch (err) {
      console.error(`Unhandled rejection at ${loc}._fetchConfigs function. Details: ${err}`)
      toast({ variant: 'destructive', title: 'Ops ...', description: 'Não foi possível buscar as configurações.' })
    } finally {
      setIsLoading(false)
    }
  }

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

  useEffect(() => {
    switch (selectedTab) {
      case 'CONFIGS':
        _fetchConfigs()
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
            <TabsList className="bg-primary/75 rounded-full">
              <TabsTrigger value="CONFIGS" onClick={() => setSelectedTab('CONFIGS')} className="rounded-full">
                Configurações
              </TabsTrigger>

              <TabsTrigger value="GAMES" onClick={() => setSelectedTab('GAMES')} className="rounded-full">
                Jogos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="CONFIGS" className="pt-6">
              {!isLoading && <UpsertConfigsForm configs={configs} />}
              {isLoading && <UpsertConfigsFormSkeleton />}
            </TabsContent>

            <TabsContent value="GAMES" className="pt-6">
              {isLoading && selectedGame && <UpdateGameForm game={selectedGame} />}
              {(!isLoading || !selectedGame) && <UpdateGameFormSkeleton />}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
