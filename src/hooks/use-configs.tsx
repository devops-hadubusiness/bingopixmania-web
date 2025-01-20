import { useEffect, useState, useCallback } from 'react'

// lib
import { api } from '@/lib/axios'

// entities
import { ConfigProps } from '@/entities/config/config'

// constants
import { HTTP_STATUS_CODE } from '@/constants/http'

// hooks
import { useToast } from '@/hooks/use-toast'

// variables
const loc = `@/utils/configs-util`

const useConfigs = (userRef?: string) => {
  const { toast } = useToast()
  const [configs, setConfigs] = useState<ConfigProps | undefined>(undefined)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null | unknown>(null)

  const _fetchConfigs = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await api.get(`/`, {
        params: {
          action: 'configs',
          userRef
        }
      })

      if (response.data?.statusCode === HTTP_STATUS_CODE.OK) setConfigs(response.data.body[0])
      else {
        toast({ variant: 'destructive', title: 'Ops ...', description: response.data?.statusMessage || 'Não foi possível buscar as configurações.' })
        setError(response.data?.statusMessage || 'Não foi possível buscar as configurações.')
        setConfigs(undefined)
      }
    } catch (err) {
      console.error(`Unhandled rejection at ${loc}.fetchConfigs function. Details: ${err}`)
      toast({ variant: 'destructive', title: 'Ops ...', description: 'Não foi possível buscar as configurações.' })
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }, [userRef])

  useEffect(() => {
    if (userRef) _fetchConfigs()
  }, [_fetchConfigs])

  return { configs, loading: isLoading, error, refetch: _fetchConfigs }
}

export { useConfigs }
