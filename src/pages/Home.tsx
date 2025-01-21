// packages
import { useState, useEffect, useRef } from 'react'
import { subHours } from 'date-fns'
import { format } from 'date-fns-tz'

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

// utils
import { timeZone } from '@/utils/dates-util'

// lib
import { api } from '@/lib/axios'
import { showError, showLoading, closeLoading } from '@/lib/alerts'

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
  const [isShowingLoadingAlert, setIsShowingLoadingAlert] = useState<boolean>(false)
  const [isShowingWinnersAlert, setIsShowingWinnersAlert] = useState<boolean>(false)
  const [winners, setWinners] = useState<WinnerProps[]>([])
  const waitForWsChannelStateUpdate = useWaitForStateUpdate(wsChannel?.state)
  const currentGameRef = useRef<GameProps | undefined>(currentGame)

  // TODO: remover
  const _handleStartNextGame = async () => {
    try {
      setIsLoading(true)

      // assigning to ws placeholder event channel before call the api
      await _assignWSChannelEvents(`${baseWsChannelName}-placeholder`)

      const response = await api.post(`/start-next-game`)

      if (response.data?.statusCode === HTTP_STATUS_CODE.OK) toast({ variant: 'success', title: 'Sucesso', description: 'Jogo iniciado com sucesso.' })
      else toast({ variant: 'destructive', title: 'Ops ...', description: 'Não foi possível iniciar o jogo.' })
    } catch (err) {
      console.error(`Unhandled rejection at ${loc}._handleStartNextGame function. Details: ${err}`)
      toast({ variant: 'destructive', title: 'Ops ...', description: 'Não foi possível iniciar o jogo.' })
    } finally {
      setIsLoading(false)
    }
  }

  const _fetchCurrentGame = async (refetch: boolean) => {
    if (!refetch && currentGame) return // refetching only when necessary to update the currentGame

    try {
      setIsLoading(true)

      const response = await api.get(`/`, {
        params: {
          action: 'game_current',
          userRef: user?.ref
        }
      })

      if ([HTTP_STATUS_CODE.OK, HTTP_STATUS_CODE.NOT_FOUND].includes(response.data?.statusCode)) {
        setCurrentGame(response.data.body?.[0])

        if (response.data.body?.length) {
          if (!isShowingLoadingAlert) setIsShowingLoadingAlert(true)

          // assigning to ws current-game event channel
          await _assignWSChannelEvents(`${baseWsChannelName}-${response.data.body[0].ref}`)
        }
      } else toast({ variant: 'destructive', title: 'Ops ...', description: response.data?.statusMessage || 'Não foi possível buscar o jogo atual.' })
    } catch (err) {
      console.error(`Unhandled rejection at ${loc}._fetchCurrentGame function. Details: ${err}`)
      toast({ variant: 'destructive', title: 'Ops ...', description: 'Não foi possível buscar o jogo atual.' })
    } finally {
      setIsLoading(false)
    }
  }

  const _fetchNextGame = async (refetch: boolean, overwriteWsChannel: boolean) => {
    if (!refetch && nextGame) return // refetching only when necessary to update the nextGame

    try {
      setIsLoading(true)

      const response = await api.get(`/`, {
        params: {
          action: 'game_next',
          userRef: user?.ref
        }
      })

      if (response.data?.statusCode === HTTP_STATUS_CODE.OK) {
        setNextGame(response.data.body[0])

        if (overwriteWsChannel || !currentGame) {
          // forcing context to be 'TIMER'
          if (context != 'TIMER') setContext('TIMER')

          // assigning to ws next-game event channel
          await _assignWSChannelEvents(`${baseWsChannelName}-${response.data.body[0].ref}`)
        }
      } else {
        if (import.meta.env.VITE_NODE_ENV != 'development') toast({ variant: 'destructive', title: 'Ops ...', description: response.data?.statusMessage || 'Não foi possível buscar o próximo jogo.' })
      }
    } catch (err) {
      console.error(`Unhandled rejection at ${loc}._fetchNextGame function. Details: ${err}`)
      toast({ variant: 'destructive', title: 'Ops ...', description: 'Não foi possível buscar o próximo jogo.' })
    } finally {
      setIsLoading(false)
    }
  }

  const _assignWSChannelEvents = async (channelName: string) => {
    // unassigning if the target channel is differente than the already assigned one
    if (wsChannel?.state === 'attached' && wsChannel?.name != channelName) await _unassignWSChannelEvents(wsChannel?.name)

    console.log('ATRIBUÍNDO EVENTOS AO CANAL: ', channelName) // TODO: remover
    setChannel({ channelName, cb: _channelCb })

    // waiting for ws channel connection to be 'attached' if it isn't yet
    if (wsChannel?.state && wsChannel?.state != 'attached') await waitForWsChannelStateUpdate('attached')

    console.log('EVENTOS ATRIBUÍDOS COM SUCESSO AO CANAL: ', channelName) // TODO: remover
  }

  const _unassignWSChannelEvents = async (channelName: string) => {
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

  const _channelCb = async (channelName: string, type: WSChannelMessageTypeProps, msg: string) => {
    try {
      // TODO: remover
      // console.log(`[${format(subHours(new Date(), 3), 'HH:mm:ss', { timeZone })}] MSG RECEBIDA DO CANAL: ${channelName}`)

      if (type === 'ERROR') {
        toast({ variant: 'destructive', title: 'Ops ...', description: msg || 'Ocorreu um erro na comunicação com o servidor de jogo.' })
        return
      } else if (type === 'MESSAGE') {
        const parsedMsg: WSGameEventProps = typeof msg === 'string' ? JSON.parse(msg || '{}') : msg

        switch (parsedMsg?.action) {
          case WS_GAME_EVENTS.GAME_STARTED:
            if (!isShowingLoadingAlert) setIsShowingLoadingAlert(true)

            // refetching updated data
            await _fetchCurrentGame(true)
            break

          case WS_GAME_EVENTS.GAME_START_FAIL:
            await showError('Não foi possível iniciar o jogo. Atualize a página e tente novamente.')
            location.reload()
            break

          case WS_GAME_EVENTS.BALL_DRAW:
            if (!currentGameRef.current) {
              console.log(`Current game is not defined yet, waiting...`)
              return
            }

            // forcing context to be 'GAME'
            if (context != 'GAME') setContext('GAME')
            if (isShowingLoadingAlert && !isNaN(Number(currentGameRef.current?.balls?.length)) && Number(currentGameRef.current?.balls?.length) > 1) setIsShowingLoadingAlert(false)

            // eslint-disable-next-line
            const { nextBall } = typeof parsedMsg.data === 'string' ? JSON.parse(parsedMsg.data || '{}') : parsedMsg.data
            setCurrentGame({ ...currentGameRef.current, balls: [...currentGameRef.current.balls, String(nextBall)] })
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
            await _fetchNextGame(true, true)
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

  // both games observer
  useEffect(() => {
    // TODO: remover
    console.log(
      `ENTROU AQUI ${JSON.stringify(
        {
          currentGame: { ref: currentGame?.ref, balls: currentGame?.balls },
          nextGame: { ref: nextGame?.ref }
        },
        null,
        2
      )}`
    )
    console.log('===============================')

    if (!currentGame) _fetchCurrentGame(false)
    if (!nextGame) _fetchNextGame(false, false)

    currentGameRef.current = currentGame
  }, [currentGame, nextGame])

  useEffect(() => {
    if(isShowingLoadingAlert) showLoading('Conectando ao servidor de jogo ...')
    else closeLoading()
  }, [isShowingLoadingAlert])

  return (
    <div className="flex w-full flex-col items-center justify-center gap-y-4 p-8 relative">
      {/* TODO: remover esse botão */}
      {context === 'TIMER' && !currentGame && (
        <Button variant="default" className="absolute top-16 left-0" onClick={_handleStartNextGame}>
          Forçar Início
        </Button>
      )}

      {(context === 'TIMER' || currentGame?.status != game_status.RUNNING) && <HomeTimerContext parentLoading={isLoading} configs={configs} nextGame={nextGame} />}
      {context === 'GAME' && currentGameRef.current?.status === game_status.RUNNING && <HomeGameContext parentLoading={isLoading} game={currentGameRef.current} winners={winners} />}
    </div>
  )
}
