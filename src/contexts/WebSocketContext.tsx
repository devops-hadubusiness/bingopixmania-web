// packages
import { createContext, useContext, useEffect, useMemo, useState, useCallback, ReactNode } from 'react'
import { InboundMessage, Realtime, RealtimeChannel } from 'ably'

// hooks
import { useToast } from '@/hooks/use-toast'

// interfaces
interface IWebSocketContextProps {
  ws: Realtime | null
  wsChannel: RealtimeChannel | null
  queue: SetChannelProps[]
  setChannel: ({ channelName, cb }: SetChannelProps) => void
}

// types
import { WSChannelMessageTypeProps } from '@/types/ws-types'
type SetChannelProps = {
  channelName: string
  cb: (type: WSChannelMessageTypeProps, msg: string) => void
}

// contexts
const WebSocketContext = createContext<IWebSocketContextProps | undefined>(undefined)

// variables
const loc = `@/contexts/WebSocketContext`

export const WebSocketProvider = ({ children }: { children: Readonly<ReactNode> }) => {
  const { toast } = useToast()
  const [ws, setWs] = useState<Realtime | null>(null)
  const [wsChannel, setWsChannel] = useState<RealtimeChannel | null>(null)
  const [queue, setQueue] = useState<SetChannelProps[]>([])
  const [activeChannels, setActiveChannels] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (ws?.connection?.state === 'connected') return

    const ably = new Realtime({ key: import.meta.env.VITE_WS_API_KEY, clientId: 'test'/* , logLevel: 3 */ })
    let isPageReloading = false

    const handleBeforeUnload = () => {
      isPageReloading = true
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    ably.connection.on('connected', () => {
      console.log(`Connected to WebSocket.`)
      setWs(ably)
    })

    ably.connection.on('failed', () => {
      console.error(`Unhandled error at ${loc}.ably.connection.onFailed. Details: ${JSON.stringify(ably.connection.errorReason, null, 2)}`)

      setWs(null)
      setWsChannel(null)
      setActiveChannels({})

      if (ably.connection.errorReason?.stack) toast({ variant: 'destructive', title: 'Ops ...', description: 'Não foi possível se conectar ao servidor de WebSocket.' })
    })

    ably.connection.on('disconnected', () => {
      console.error(`Unhandled error at ${loc}.ably.connection.onDisconnected. Details: ${JSON.stringify(ably.connection.errorReason, null, 2)}`)

      setWs(null)
      setWsChannel(null)
      setActiveChannels({})

      if (ably.connection.errorReason?.stack) toast({ variant: 'destructive', title: 'Ops ...', description: 'A conexão com o servidor de WebSocket foi perdida.' })
    })

    ably.connection.on('suspended', () => {
      console.error(`Unhandled error at ${loc}.ably.connection.onSuspended. Details: ${JSON.stringify(ably.connection.errorReason, null, 2)}`)

      setWs(null)
      setWsChannel(null)
      setActiveChannels({})

      if (ably.connection.errorReason?.stack) toast({ variant: 'destructive', title: 'Ops ...', description: 'A conexão com o servidor de WebSocket foi suspensa.' })
    })

    ably.connection.on('closed', () => {
      if (!isPageReloading) {
        console.error(`Unhandled error at ${loc}.ably.connection.onClosed. Details: ${JSON.stringify(ably.connection.errorReason, null, 2)}`)

        if (ably.connection.errorReason?.stack) toast({ variant: 'destructive', title: 'Ops ...', description: 'A conexão com o servidor de WebSocket foi fechada.' })
      }

      setWs(null)
      setWsChannel(null)
      setActiveChannels({})
    })

    return () => {
      console.log(`Closing WebSocket connection at ${loc}.useEffect function.`)
      window.removeEventListener('beforeunload', handleBeforeUnload)
      ably.connection.close()
      ably.close()
      ably.connection.off()
      setWs(null)
      setWsChannel(null)
      setActiveChannels({})
    }
  }, [])

  const setChannel = useCallback(
    ({ channelName, cb }: SetChannelProps) => {
      // if is already active
      if (activeChannels[channelName]) {
        console.log(`Channel ${channelName} is already active.`)
        return
      }

      // waits for ws connection
      if (!ws || ws?.connection?.state !== 'connected') {
        const alreadyAddedToQueue = queue.some(q => q.channelName === channelName)
        if (!alreadyAddedToQueue) {
          setQueue(prev => [...prev, { channelName, cb }])
          console.log('WebSocket instance not connected yet, adding to queue...')
        }
        return
      }

      const channel = ws.channels.get(channelName)

      channel.on('attached', async () => {
        console.log(`Connected to WebSocket Channel ${channelName}.`)

        try {
          await channel.presence.enter({ testando: true })
        } catch (e) {
          console.error(`ERRO PRESENCE: `, e)
        }
        setActiveChannels(prev => ({ ...prev, [channelName]: true }))
        setWsChannel(channel)
      })

      const _handleStateChange = (state: string) => {
        console.log(`WebSocket channel ${channelName} is in state: ${state}`)
        console.error(`Unhandled error at ${loc}.setChannel._handleStateChange. Details: ${JSON.stringify(channel.errorReason, null, 2)}`)

        if (['failed', 'suspended', 'detached'].includes(state)) {
          setActiveChannels(prev => {
            const updated = { ...prev }
            delete updated[channelName]
            return updated
          })
        }

        if (channel.errorReason?.stack) {
          toast({ variant: 'destructive', title: 'Ops ...', description: `Ocorreu um erro no canal ${channelName} do servidor de WebSocket.` })
          cb('ERROR', channel.errorReason.stack)
        }
      }

      channel.on('failed', () => _handleStateChange('failed'))
      channel.on('suspended', () => _handleStateChange('suspended'))
      channel.on('detached', () => _handleStateChange('detached'))

      channel.subscribe('message', msg => console.log(JSON.stringify(msg)) /* (msg: InboundMessage) => cb('MESSAGE', msg.data) */)

      return () => {
        console.log(`Closing WebSocket channel connection at ${loc}.setChannel function.`)
        channel.unsubscribe('message')
        channel.detach()
        ws.channels.release(channelName)
        channel.off()
        setWsChannel(null)
        setActiveChannels(prev => {
          const updated = { ...prev }
          delete updated[channelName]
          return updated
        })
      }
    },
    [ws, activeChannels, queue]
  )

  useEffect(() => {
    if (queue.length && ws?.connection?.state === 'connected') {
      const unprocessedQueue = queue.slice()
      for (const item of queue) {
        setChannel(item)
        unprocessedQueue.shift()
      }
      setQueue(unprocessedQueue)
    }
  }, [queue, ws?.connection?.state, setChannel])

  const value = useMemo(() => ({ ws, wsChannel, queue, setChannel }), [ws, wsChannel, queue, setChannel])

  return <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>
}

export const useWebSocket = () => {
  const context = useContext(WebSocketContext)
  if (!context) {
    throw new Error('useWebSocket must be used within an WebSocketProvider')
  }
  return context
}
