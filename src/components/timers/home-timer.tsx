// packages
import { useEffect, useState } from 'react'

// entities
import { ConfigProps } from '@/entities/config/config'

// lib
import { api } from '@/lib/axios'
import { cn } from '@/lib/utils'

// store
import { useAuthStore } from '@/store/auth'

// constants
import { HTTP_STATUS_CODE } from '@/constants/http'

// hooks
import { useToast } from '@/hooks/use-toast'

// types
type HomeTimerProps = {
  parentLoading: boolean
  configs?: ConfigProps
}

// variables
const loc = `@/components/timers/home-timer`

export function HomeTimer({ parentLoading, configs }: HomeTimerProps) {
  const { user } = useAuthStore()
  const { toast } = useToast()
  const [receivedServerTime, setReceivedServerTime] = useState<string | undefined>()
  const [remainingTime, setRemainingTime] = useState<number>(0)
  const [formattedTime, setFormattedTime] = useState<string>('00:00')
  const [isLoading, setIsLoading] = useState<boolean>(parentLoading || true)

  const _fetchServerTime = async () => {
    try {
      setIsLoading(true)

      const response = await api.get(`/get-server-time`, {
        params: { userRef: user?.ref }
      })

      if (response.data?.statusCode === HTTP_STATUS_CODE.OK) setReceivedServerTime(response.data.body[0]?.time)
      else toast({ variant: 'destructive', title: 'Ops ...', description: response.data?.statusMessage || 'Não foi possível buscar o tempo do servidor.' })
    } catch (err) {
      console.error(`Unhandled rejection at ${loc}._fetchServerTime function. Details: ${err}`)
      toast({ variant: 'destructive', title: 'Ops ...', description: 'Não foi possível buscar o tempo do servidor.' })
    } finally {
      setIsLoading(false)
    }
  }

  const _convertTimeToSeconds = (timeStr: string) => {
    const [minutes, seconds] = timeStr.split(':').map(Number)
    return minutes * 60 + seconds
  }

  const _convertSecondsToTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0')
    const secs = (seconds % 60).toString().padStart(2, '0')
    return `${minutes}:${secs}`
  }

  useEffect(() => {
    if (receivedServerTime && configs?.defaultTimeBetweenGames) {
      const timeInSeconds = _convertTimeToSeconds(receivedServerTime)
      const cycleTime = configs.defaultTimeBetweenGames * 60

      // calculating the remaining time to start the next game
      const remaining = cycleTime - (timeInSeconds % cycleTime)

      setRemainingTime(remaining)
      setFormattedTime(_convertSecondsToTime(remaining))
    }
  }, [receivedServerTime, configs])

  useEffect(() => {
    setIsLoading(parentLoading)
  }, [parentLoading])

  useEffect(() => {
    _fetchServerTime()

    const interval = setInterval(() => {
      setRemainingTime(prev => {
        if (prev > 0) {
          const newTime = prev - 1
          setFormattedTime(_convertSecondsToTime(newTime))
          return newTime
        } else {
          clearInterval(interval)
          return 0
        }
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={cn('flex w-full', (isLoading || !formattedTime) && 'skeleton-no-bg')}>
      <div className="flex-1 flex justify-center items-center rounded-lg border border-2 border-primary-text p-4">
        <span className="font-bold text-primary-text text-6xl">{formattedTime.split(':')[0].substring(0, 1)}</span>
      </div>

      <div className="flex-1 flex justify-center items-center rounded-lg border border-2 border-primary-text p-4 ml-2">
        <span className="font-bold text-primary-text text-6xl">{formattedTime.split(':')[0].substring(1)}</span>
      </div>

      <div className="w-auto flex justify-center items-center rounded-lg p-4 not-skeleton">
        <span className="font-bold text-primary-text text-6xl">:</span>
      </div>

      <div className="flex-1 flex justify-center items-center rounded-lg border border-2 border-primary-text p-4 mr-2">
        <span className="font-bold text-primary-text text-6xl">{formattedTime.split(':')[1].substring(0, 1)}</span>
      </div>

      <div className="flex-1 flex justify-center items-center rounded-lg border border-2 border-primary-text p-4">
        <span className="font-bold text-primary-text text-6xl">{formattedTime.split(':')[1].substring(1)}</span>
      </div>
    </div>
  )
}
