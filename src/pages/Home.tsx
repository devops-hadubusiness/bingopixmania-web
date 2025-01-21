// packages
import { useState, useEffect, useRef } from 'react'
import { Realtime } from 'ably'

// components
import { Button } from '@/components/ui/button'
import { HomeTimerContext } from '@/components/contexts/home-timer-context'
import { HomeGameContext } from '@/components/contexts/home-game-context'

// entities
import { game_status, GameProps } from '@/entities/game/game'
import { WinnerProps } from '@/entities/winner/winner'

// hooks
import { useConfigs } from '@/hooks/use-configs'
import { useWaitForStateUpdate } from '@/hooks/use-wait-for-state-update'

// contexts
import { useWebSocket } from '@/contexts/WebSocketContext'

// lib
import { api } from '@/lib/axios'
import { showError } from '@/lib/alerts'

// store
import { useAuthStore } from '@/store/auth'

// constants
import { HTTP_STATUS_CODE } from '@/constants/http'
import { WS_GAME_EVENTS } from '@/constants/ws'

// hooks
import { useToast } from '@/hooks/use-toast'

// types
import { WSChannelMessageTypeProps, WSGameEventProps } from '@/types/ws-types'
export type ContextProps = 'TIMER' | 'GAME'

// variables
const loc = `@/pages/Home`
const baseWsChannelName = `${import.meta.env.VITE_APP_NAME}-${import.meta.env.VITE_NODE_ENV}-game`

export default function HomePage() {
  const { user } = useAuthStore()
  const { toast } = useToast()
  const { ws, wsChannel, setChannel } = useWebSocket()
  const homeGameContextRef = useRef(null)
  const { configs, loading: isLoadingConfigs } = useConfigs(user?.ref)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [context, setContext] = useState<ContextProps>('TIMER')
  const [currentGame, setCurrentGame] = useState<GameProps | undefined>()
  const [nextGame, setNextGame] = useState<GameProps | undefined>()
  const [currentGameChannelName, setCurrentGameChannelName] = useState<string | undefined>()
  const [nextGameChannelName, setNextGameChannelName] = useState<string | undefined>()
  const [isShowingLoadingAlert, setIsShowingLoadingAlert] = useState<boolean>(false)
  const [isShowingWinnersAlert, setIsShowingWinnersAlert] = useState<boolean>(false)
  const [winners, setWinners] = useState<WinnerProps[]>([])
  const waitForWsChannelNameUpdate = useWaitForStateUpdate(wsChannel?.name)

  // TODO: remover
  const _handleStartNextGame = async () => {
    try {
      setIsLoading(true)

      // assigning to ws placeholder event channel before call the api
      await _assignWSChannelEvents(`${baseWsChannelName}-placeholder`)

      // waiting for ws channel connection
      await waitForWsChannelNameUpdate()

      const response = await api.post(`/start-next-game`)

      if (response.data?.statusCode === HTTP_STATUS_CODE.OK) {
        toast({ variant: 'success', title: 'Sucesso', description: 'Jogo iniciado com sucesso.' })
        // await Promise.all([_fetchCurrentGame(), _fetchNextGame()])
      } else toast({ variant: 'destructive', title: 'Ops ...', description: 'Não foi possível iniciar o jogo.' })
    } catch (err) {
      console.error(`Unhandled rejection at ${loc}._handleStartNextGame function. Details: ${err}`)
      toast({ variant: 'destructive', title: 'Ops ...', description: 'Não foi possível iniciar o jogo.' })
    } finally {
      setIsLoading(false)
    }
  }

  const _fetchCurrentGame = async (/* refetch: boolean */) => {
    try {
      // if(!refetch && currentGame) return // refetching only when necessary to update the currentGameInstance

      setIsLoading(true)

      const response = await api.get(`/`, {
        params: {
          action: 'game_current',
          userRef: user?.ref
        }
      })

      if ([HTTP_STATUS_CODE.OK, HTTP_STATUS_CODE.NOT_FOUND].includes(response.data?.statusCode)) setCurrentGame(response.data.body?.[0])
      else {
        toast({ variant: 'destructive', title: 'Ops ...', description: response.data?.statusMessage || 'Não foi possível buscar o jogo atual.' })
        if (currentGame) setCurrentGame(undefined) // reseting data
      }
    } catch (err) {
      console.error(`Unhandled rejection at ${loc}._fetchCurrentGame function. Details: ${err}`)
      toast({ variant: 'destructive', title: 'Ops ...', description: 'Não foi possível buscar o jogo atual.' })
      if (currentGame) setCurrentGame(undefined) // reseting data
    } finally {
      setIsLoading(false)
    }
  }

  const _fetchNextGame = async () => {
    try {
      setIsLoading(true)

      const response = await api.get(`/`, {
        params: {
          action: 'game_next',
          userRef: user?.ref
        }
      })

      if (response.data?.statusCode === HTTP_STATUS_CODE.OK) setNextGame(response.data.body[0])
      else {
        if (import.meta.env.VITE_NODE_ENV != 'development') toast({ variant: 'destructive', title: 'Ops ...', description: response.data?.statusMessage || 'Não foi possível buscar o próximo jogo.' })
        if (nextGame) setNextGame(undefined) // reseting data
      }
    } catch (err) {
      console.error(`Unhandled rejection at ${loc}._fetchNextGame function. Details: ${err}`)
      toast({ variant: 'destructive', title: 'Ops ...', description: 'Não foi possível buscar o próximo jogo.' })
      if (nextGame) setNextGame(undefined) // reseting data
    } finally {
      setIsLoading(false)
    }
  }

  const _assignWSChannelEvents = async (channelName: string) => {
    console.log('CHAMOU: ', channelName)
    setChannel({ channelName, cb: _channelCb })
  }

  const _unassignWSChannelEvents = async (channelName: string) => {
    console.warn(`============== TIRANDO OS EVENTOS ===============`) // TODO: remover

    try {
      if (wsChannel?.state === 'attached' && wsChannel?.name === channelName) {
        wsChannel.unsubscribe('message')
        await wsChannel.detach()
        ws?.channels.release(channelName)
        wsChannel.off()
      }
    } catch (err) {
      console.error(`Unhandled rejection at ${loc}._unassignWSChannelEvents function. Details: ${err}`)
      toast({ variant: 'destructive', title: 'Ops ...', description: 'Não foi possível desanexar os eventos do servidor de WebSocket.' })
    }
  }

  const _channelCb = async (type: WSChannelMessageTypeProps, msg: string) => {
    try {
      if (type === 'ERROR') {
        toast({ variant: 'destructive', title: 'Ops ...', description: msg || 'Ocorreu um erro na comunicação com o servidor de jogo.' })
        return
      } else if (type === 'MESSAGE') {
        const parsedMsg: WSGameEventProps = typeof msg === 'string' ? JSON.parse(msg || '{}') : msg

        switch (parsedMsg?.action) {
          case WS_GAME_EVENTS.GAME_STARTED:
            if (!isShowingLoadingAlert) setIsShowingLoadingAlert(true)

            // refetching updated data
            await Promise.all([_fetchCurrentGame(), _fetchNextGame()])
            break

          case WS_GAME_EVENTS.GAME_START_FAIL:
            await showError('Não foi possível iniciar o jogo. Atualize a página e tente novamente.')
            location.reload()
            break

          case WS_GAME_EVENTS.BALL_DRAW:
            if (isShowingLoadingAlert) setIsShowingLoadingAlert(false)

            // eslint-disable-next-line
            const { nextBall } = parsedMsg.data as unknown as { nextBall: string }
            if (!currentGame) await _fetchCurrentGame()
            setCurrentGame(prev => (prev ? { ...prev, balls: [...prev.balls, nextBall] } : prev))
            break

          case WS_GAME_EVENTS.BALL_DRAW_FAIL:
            await showError('Não foi possível sortear a próxima bola. Atualize a página e tente novamente.')
            location.reload()
            break

          case WS_GAME_EVENTS.NEW_WINNERS:
            // TODO: receber um ou mais winners, receber qual foi o prêmio, atualizar na variável de estado e no contexto do jogo o que for necessário
            // TODO: se for terceiro prêmio, exibir pop-up abaixo
            // if(!isShowingWinnersAlert) setIsShowingWinnersAlert(true)
            // TODO: após o timeout do alert, fazer setWinners([])
            break

          case WS_GAME_EVENTS.GAME_FINISHED:
            // TODO: aqui vai receber os winners dentro da parsedMsg.data
            // TODO: mostrar modal

            // refetching updated data
            await Promise.all([_fetchCurrentGame(), _fetchNextGame()])
            break

          case WS_GAME_EVENTS.GAME_FINISH_FAIL:
            await showError('Não foi possível finalizar o jogo. Atualize a página e tente novamente.')
            location.reload()
            break
        }
      } else toast({ variant: 'destructive', title: 'Ops ...', description: 'Tipo de evento não reconhecido.' })
    } catch (err) {
      console.error(`Unhandled rejection at ${loc}._channelCb function. Details: ${err}`)
      toast({ variant: 'destructive', title: 'Ops ...', description: 'Não foi possível receber o evento.' })
    }
  }

  useEffect(() => {
    setIsLoading(isLoadingConfigs)
  }, [isLoadingConfigs])

  // current game observer
  /* useEffect(() => {
    if (currentGame) {
      const channelName = `${import.meta.env.VITE_APP_NAME}-${import.meta.env.VITE_NODE_ENV}-game-${currentGame.ref}`
      if (currentGameChannelName != channelName) setCurrentGameChannelName(channelName)

      // if game is running
      if (currentGame.status === game_status.RUNNING) {
        // if isn't connected or is connected to another channel
        if (ws?.connection?.state != 'connected' || wsChannel?.name != channelName || wsChannel?.state != 'attached') _assignWSChannelEvents(channelName)

        // forcing context to be 'GAME'
        if (context != 'GAME') setContext('GAME')

        // TODO: verificar se isso aqui é necessário ou somente atualizando no state funciona
        // updating game context on every modification
        // if (homeGameContextRef.current) homeGameContextRef.current.updateGame(currentGame)
      } else {
        // forcing context to be 'TIMER'
        if (context != 'TIMER') setContext('TIMER')

        // removing channel listeners
        if ((ws?.connection?.state || wsChannel?.state) && wsChannel?.name === channelName) _unassignWSChannelEvents(channelName)
      }
    } else {
      // reseting data
      if (currentGameChannelName) {
        _unassignWSChannelEvents(currentGameChannelName)
        setCurrentGameChannelName(undefined)
      }

      if (context != 'TIMER') setContext('TIMER')
    }
  }, [context, currentGame, currentGameChannelName]) */

  // current game observer
  /* useEffect(() => {
    if (nextGame) {
      const channelName = `${import.meta.env.VITE_APP_NAME}-${import.meta.env.VITE_NODE_ENV}-game-${nextGame.ref}`
      if (nextGameChannelName != channelName) setNextGameChannelName(channelName)

      // if isn't running any game
      if (!currentGame) {
        // if isn't connected or is connected to another channel
        if (ws?.connection?.state != 'connected' || wsChannel?.name != channelName || wsChannel?.state != 'attached') _assignWSChannelEvents(channelName)

        // forcing context to be 'TIMER'
        if (context != 'TIMER') setContext('TIMER')
      } else {
        // removing channel listeners
        if ((ws?.connection?.state || wsChannel?.state) && wsChannel?.name === channelName) _unassignWSChannelEvents(channelName)
      }
    } else {
      // reseting data
      if (nextGameChannelName) {
        _unassignWSChannelEvents(nextGameChannelName)
        setNextGameChannelName(undefined)
      }
    }
  }, [context, nextGame, nextGameChannelName]) */

  // both games observer
  useEffect(() => {
    // TODO: remover
    console.log(`ENTROU AQUI 1`)
    console.log('CURRENT GAME', JSON.stringify(currentGame, null, 2))
    console.log('NEXT GAME', JSON.stringify(nextGame, null, 2))
    console.log('WS CHANNEL NAME:', wsChannel?.name)
    console.log('===============================')

    if (!currentGame) _fetchCurrentGame(false)
    if (!nextGame) _fetchNextGame(false)

    // assigning ws channel events to current game
    if (currentGame && wsChannel?.name != `${baseWsChannelName}-${currentGame.ref}`) {
      _unassignWSChannelEvents(`${baseWsChannelName}-placeholder`)
      _assignWSChannelEvents(`${baseWsChannelName}-${currentGame.ref}`)
    }

    // assigning ws channel events to next game only if hasn't current game
    if (!currentGame && nextGame && wsChannel?.name != `${baseWsChannelName}-${nextGame.ref}`) {
      _unassignWSChannelEvents(`${baseWsChannelName}-placeholder`)
      _assignWSChannelEvents(`${baseWsChannelName}-${nextGame.ref}`)
    }
  }, [currentGame, nextGame, wsChannel?.name])

  return (
    <div className="flex w-full flex-col items-center justify-center gap-y-4 p-8 relative">
      {/* TODO: remover esse botão */}
      {context === 'TIMER' && !currentGame && (
        <Button variant="default" className="absolute top-16 left-0" onClick={_handleStartNextGame}>
          Forçar Início
        </Button>
      )}

      {(context === 'TIMER' || currentGame?.status != game_status.RUNNING) && <HomeTimerContext parentLoading={isLoading} configs={configs} nextGame={nextGame} />}
      {context === 'GAME' && currentGame?.status === game_status.RUNNING && <HomeGameContext parentLoading={isLoading} game={currentGame} winners={winners} />}
    </div>
  )
}
