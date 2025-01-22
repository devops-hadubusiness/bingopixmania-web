// packages
import { createContext, useContext, useEffect, useMemo, useState, useCallback, ReactNode } from 'react'
import { InboundMessage, Realtime, RealtimeChannel } from 'ably'
import { format } from 'date-fns-tz'
import { subHours } from 'date-fns'

// hooks
import { useToast } from '@/hooks/use-toast'

// utils
import { timeZone } from '@/utils/dates-util'

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
  cb: (channelName: string, type: WSChannelMessageTypeProps, msg: string) => void
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

  useEffect(() => {
    if(ws?.connection?.state === 'connected') return
    
    const ably = new Realtime({ key: import.meta.env.VITE_WS_API_KEY })
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
      
      // TODO: descomentar
      // if (ably.connection.errorReason?.stack && import.meta.env.VITE_NODE_ENV === 'development') toast({ variant: 'destructive', title: 'Ops ...', description: 'Não foi possível se conectar ao servidor de WebSocket.' })
    })

    ably.connection.on('disconnected', () => {
      console.error(`Unhandled error at ${loc}.ably.connection.onDisconnected. Details: ${JSON.stringify(ably.connection.errorReason, null, 2)}`)

      // TODO: descomentar
      // if (ably.connection.errorReason?.stack && import.meta.env.VITE_NODE_ENV === 'development') toast({ variant: 'destructive', title: 'Ops ...', description: 'A conexão com o servidor de WebSocket foi perdida.' })
    })

    ably.connection.on('suspended', () => {
      console.error(`Unhandled error at ${loc}.ably.connection.onSuspended. Details: ${JSON.stringify(ably.connection.errorReason, null, 2)}`)

      // TODO: descomentar
      // if (ably.connection.errorReason?.stack && import.meta.env.VITE_NODE_ENV === 'development') toast({ variant: 'destructive', title: 'Ops ...', description: 'A conexão com o servidor de WebSocket foi suspensa.' })
    })

    ably.connection.on('closed', () => {
      if (!isPageReloading) {
        console.error(`Unhandled error at ${loc}.ably.connection.onClosed. Details: ${JSON.stringify(ably.connection.errorReason, null, 2)}`)

        // TODO: descomentar
        // if (ably.connection.errorReason?.stack && import.meta.env.VITE_NODE_ENV === 'development') toast({ variant: 'destructive', title: 'Ops ...', description: 'A conexão com o servidor de WebSocket foi fechada.' })
      }
    })

    return () => {
      console.log(`Closing WebSocket connection at ${loc}.useEffect function.`)
      window.removeEventListener('beforeunload', handleBeforeUnload)
      ably.connection.close()
      ably.close()
      ably.connection.off()
    }
  }, [])

  const setChannel = useCallback(
    async ({ channelName, cb }: SetChannelProps) => {
      if (ws?.connection?.state != 'connected') {
        const alreadyAddedToQueue = queue.some(q => q.channelName === channelName)

        if (!alreadyAddedToQueue) {
          setQueue(prev => [...prev, { channelName, cb }])
          console.log('WebSocket instance not connected yet, adding to queue...', queue, channelName)
        } else console.log(`WebSocket instance not connected yet, but ${channelName} is already added to the queue...`)
        return
      }

      if (!['initialized', 'attached', undefined].includes(wsChannel?.state)) {
        console.log(`WebSocket channel has ${wsChannel?.state} status.`)
        return
      }

      const channel = ws.channels.get(channelName)

      channel.on('attached', () => {
        const time = format(subHours(new Date(), 3), 'dd/MM/yyyy HH:mm:ss', { timeZone })
        console.log(`Connected to WebSocket Channel ${channelName} at ${time}.`)
        setWsChannel(channel)
      })

      channel.on('failed', () => {
        console.error(`Unhandled error at ${loc}.channel.onFailed. Details: ${JSON.stringify(channel.errorReason, null, 2)}`)

        if (channel.errorReason?.stack) {
          // TODO: descomentar
          // if (import.meta.env.VITE_NODE_ENV === 'development') toast({ variant: 'destructive', title: 'Ops ...', description: `Não foi possível se conectar ao canal ${channelName} do servidor de WebSocket.` })
          cb(channel.name, 'ERROR', channel.errorReason.stack)
        }
      })

      channel.on('suspended', () => {
        console.error(`Unhandled error at ${loc}.channel.onSuspended. Details: ${JSON.stringify(channel.errorReason, null, 2)}`)

        if (channel.errorReason?.stack) {
          // TODO: descomentar
          // if (import.meta.env.VITE_NODE_ENV === 'development') toast({ variant: 'destructive', title: 'Ops ...', description: `A conexão com o canal ${channelName} do servidor de WebSocket foi suspensa.` })
          cb(channel.name, 'ERROR', channel.errorReason.stack)
        }
      })

      channel.on('detached', () => {
        console.error(`Unhandled error at ${loc}.channel.onDetached. Details: ${JSON.stringify(channel.errorReason, null, 2)}`)

        if (channel.errorReason?.stack) {
          // TODO: descomentar
          // if (import.meta.env.VITE_NODE_ENV === 'development') toast({ variant: 'destructive', title: 'Ops ...', description: `A conexão com o canal ${channelName} do servidor de WebSocket foi desanexada.` })
          cb(channel.name, 'ERROR', channel.errorReason.stack)
        }
      })

      await channel.subscribe('message', (msg: InboundMessage) => cb(channel.name, 'MESSAGE', msg.data))

      return () => {
        console.log(`Closing WebSocket channel connection at ${loc}.setChannel function.`)
        channel.unsubscribe('message')
        channel.detach()
        ws.channels.release(channelName)
        channel.off()
      }
    },
    [ws, wsChannel?.state, queue]
  )

  useEffect(() => {
    if (queue.length && ws?.connection?.state === 'connected') {
      for (const item of queue) {
        console.log(`LOOPING DA QUEUE`)
        if(wsChannel?.state != 'attached' && wsChannel?.name != item.channelName) {
          console.log(`EXECUTANDO A QUEUE: ${wsChannel?.state} ${wsChannel?.name} ${item.channelName}`)
          setChannel(item)
        }
      }
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
