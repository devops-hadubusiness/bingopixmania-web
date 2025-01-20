// packages
import { useState, useEffect } from 'react'

// components
import { Button } from '@/components/ui/button'
import { HomeTimerContext } from '@/components/contexts/home-timer-context'
import { HomeGameContext } from '@/components/contexts/home-game-context'

// hooks
import { useConfigs } from '@/hooks/use-configs'

// store
import { useAuthStore } from '@/store/auth'

// types
export type HomePageContextProps = 'TIMER' | 'GAME'

export default function HomePage() {
  const { user } = useAuthStore()
  const { configs, loading: isLoadingConfigs } = useConfigs(user?.ref)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [context, setContext] = useState<HomePageContextProps>('TIMER')

  useEffect(() => {
    setIsLoading(isLoadingConfigs)
  }, [isLoadingConfigs])

  return (
    <div className="flex w-full flex-col items-center justify-center gap-y-4 p-8 relative">
      <Button variant="default" className="absolute top-16 left-0" onClick={() => setContext(context === 'GAME' ? 'TIMER' : 'GAME')}>
        {context === 'TIMER' ? 'Simular' : 'Voltar'}
      </Button>

      {context === 'TIMER' && <HomeTimerContext parentLoading={isLoading} configs={configs} updateContext={setContext} />}
      {context === 'GAME' && <HomeGameContext />}
    </div>
  )
}
