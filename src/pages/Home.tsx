// packages
import { useState, useEffect, useRef } from 'react'
import { Dices } from 'lucide-react'
import { RealtimeChannel } from 'ably'

// components
import { Button } from '@/components/ui/button'
import { HomeTimerContext } from '@/components/contexts/home-timer-context'
import { HomeGameContext } from '@/components/contexts/home-game-context'
import { CustomNoData } from '@/components/data/custom-no-data'
import { WinnersAlert } from '@/components/alerts/winners-alert'
import { NewWinnersAlert } from '@/components/alerts/new-winners-alert'

// entities
import { game_status, GameProps } from '@/entities/game/game'
import { Winner } from '@/entities/winner/winner'

// hooks
import { useConfigs } from '@/hooks/use-configs'
import { useWaitForStateUpdate } from '@/hooks/use-wait-for-state-update'

// contexts
import { useWebSocket } from '@/contexts/WebSocketContext'

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
import { ClosestGameWinnerProps } from '@/types/game-types'
export type ContextProps = 'TIMER' | 'GAME'

// variables
const loc = `@/pages/Home`
const baseWsChannelName = `${import.meta.env.VITE_APP_NAME}-${import.meta.env.VITE_NODE_ENV}-game`

export default function HomePage() {
  const { user } = useAuthStore()
  const { toast } = useToast()
  const { configs, loading: isLoadingConfigs } = useConfigs(user?.ref)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { ws, wsChannel, setChannel } = useWebSocket()
  const wsChannelRef = useRef<RealtimeChannel | null>(wsChannel)
  const waitForWsConnectionStateUpdate = useWaitForStateUpdate(ws?.connection?.state)
  const waitForWsChannelStateUpdate = useWaitForStateUpdate(wsChannel?.state)

  const [context, setContext] = useState<ContextProps>('TIMER')
  const contextRef = useRef<ContextProps>(context)

  const [currentGame, setCurrentGame] = useState<GameProps | undefined>()
  const currentGameRef = useRef<GameProps | undefined>(currentGame)

  const [nextGame, setNextGame] = useState<GameProps | undefined>()
  const nextGameRef = useRef<GameProps | undefined>(nextGame)

  const [newWinners, setNewWinners] = useState<Winner[]>([
    /* {
      prizeType: winner_prize_type.FIRST,
      prizeValue: 10,
      ticket: { id: 1, numbers: Array.from({ length: 15 }, (_, i) => String(i + 1)) },
      user: { name: 'Gustavo' }
    }, */
    /* {
      prizeType: winner_prize_type.FIRST,
      prizeValue: 5,
      ticket: { id: 1, numbers: Array.from({ length: 15 }, (_, i) => String(i + 1)) },
      user: { name: 'Gustavo' }
    },
    {
      prizeType: winner_prize_type.FIRST,
      prizeValue: 5,
      ticket: { id: 2, numbers: Array.from({ length: 5 }, (_, i) => String(i + 1)).concat(Array.from({ length: 10 }, (_, i) => String(i + 15 + 1))) },
      user: { name: 'Edu' }
    }, */
    /* {
      prizeType: winner_prize_type.SECOND,
      prizeValue: 20,
      ticket: { id: 1, numbers: Array.from({ length: 15 }, (_, i) => String(i + 1)) },
      user: { name: 'Gustavo' }
    } */
    /* {
      prizeType: winner_prize_type.SECOND,
      prizeValue: 10,
      ticket: { id: 1, numbers: Array.from({ length: 15 }, (_, i) => String(i + 1)) },
      user: { name: 'Gustavo' }
    },
    {
      prizeType: winner_prize_type.SECOND,
      prizeValue: 10,
      ticket: { id: 2, numbers: Array.from({ length: 5 }, (_, i) => String(i + 1)).concat(Array.from({ length: 10 }, (_, i) => String(i + 15 + 1))) },
      user: { name: 'Edu' }
    }, */
  ])
  const newWinnersRef = useRef<Winner[]>(newWinners)

  const [closestWinners, setClosestWinners] = useState<ClosestGameWinnerProps[]>([])
  const closestWinnersRef = useRef<ClosestGameWinnerProps[]>(closestWinners)

  const [isShowingLoadingAlert, setIsShowingLoadingAlert] = useState<boolean>(false)
  const isShowingLoadingAlertRef = useRef<boolean>(isShowingLoadingAlert)

  const [isShowingNewWinnersAlert, setIsShowingNewWinnersAlert] = useState<boolean>(false)
  const isShowingNewWinnersAlertRef = useRef<boolean>(isShowingNewWinnersAlert)

  const [isShowingWinnersAlert, setIsShowingWinnersAlert] = useState<boolean>(false) // TODO: voltar para false
  const isShowingWinnersAlertRef = useRef<boolean>(isShowingWinnersAlert)

  // TODO: remover
  const _handleStartNextGame = async () => {
    try {
      setIsLoading(true)
      setIsShowingLoadingAlert(true)

      // TODO: testando sem esperar dar o attach (na mao com banco vazio)
      // waiting for ws placeholder event channel to be attached before call the api
      // console.log('Waiting for ws channel to be attached ...')
      // if (!currentGame && !nextGame && wsChannel?.state != 'attached') await waitForWsChannelStateUpdate('attached')
      // console.log('Ws channel attached!')

      console.warn(`STARTING NEXT GAME: ${currentGameRef.current} ${nextGameRef.current}`)
      const response = await api.post(`/start-next-game`)

      if (response.data?.statusCode === HTTP_STATUS_CODE.OK) {
        if (isShowingLoadingAlertRef.current) setIsShowingLoadingAlert(false)

        // only refetching currentGame for update the data, if the next game isn't exists. If it exists, the currentGame will be updated by the GAME_STARTED event
        console.warn(`AFTER STARTED NEXT GAME: ${currentGameRef.current} ${nextGameRef.current}`)
        if (!currentGameRef.current && !nextGameRef.current) await _fetchCurrentGame(true)
      } else toast({ variant: 'destructive', title: 'Ops ...', description: 'Não foi possível iniciar o jogo.' })
    } catch (err) {
      console.error(`Unhandled rejection at ${loc}._handleStartNextGame function. Details: ${err}`)
      toast({ variant: 'destructive', title: 'Ops ...', description: 'Não foi possível iniciar o jogo.' })
    } finally {
      setIsLoading(false)
    }
  }

  const _fetchCurrentGame = async (refetch: boolean) => {
    // refetching only when necessary or forced, to update the currentGame
    if (!refetch && (!!currentGameRef.current || !!nextGameRef.current)) return
    else console.log(`VAI BUSCAR O CURRENT GAME: ${refetch} ${!!currentGameRef.current} ${!!nextGameRef.current}`)

    try {
      setIsLoading(true)

      const response = await api.get(`/`, {
        params: {
          action: 'game_current',
          userRef: user?.ref
        }
      })

      console.log(response.data) // TODO: remover

      if ([HTTP_STATUS_CODE.OK, HTTP_STATUS_CODE.NOT_FOUND].includes(response.data?.statusCode)) {
        setCurrentGame(response.data.body?.[0])

        if (response.data.body?.length) {
          // forcing context to be 'GAME'
          if (contextRef.current != 'GAME') setContext('GAME')

          // assigning to ws current-game event channel only if hasn't next game
          console.warn(`NOME DO WS NO MOMENTO: ${wsChannelRef.current?.name} | EXISTE CURRENT ? ${!!currentGameRef.current} | EXISTE NEXT ? ${!!nextGameRef.current}`)
          if (!nextGameRef.current) await _assignWSChannelEvents(`${baseWsChannelName}-${response.data.body[0].ref}`)
        } else await _fetchNextGame(refetch)
      } else {
        toast({ variant: 'destructive', title: 'Ops ...', description: response.data?.statusMessage || 'Não foi possível buscar o jogo atual.' })
      }
    } catch (err) {
      console.error(`Unhandled rejection at ${loc}._fetchCurrentGame function. Details: ${err}`)
      toast({ variant: 'destructive', title: 'Ops ...', description: 'Não foi possível buscar o jogo atual.' })
    } finally {
      setIsLoading(false)
    }
  }

  const _fetchNextGame = async (refetch: boolean) => {
    // refetching only when necessary or forced, to update the nextGame
    if (!refetch && (currentGameRef.current || nextGameRef.current)) return
    else console.log(`VAI BUSCAR O NEXT GAME: ${refetch} ${!!currentGameRef.current} ${!!nextGameRef.current}`)

    try {
      setIsLoading(true)

      const response = await api.get(`/`, {
        params: {
          action: 'game_next',
          userRef: user?.ref
        }
      })

      console.log(response.data) // TODO: remover

      if (response.data?.statusCode === HTTP_STATUS_CODE.OK) {
        setNextGame(response.data.body[0])

        // forcing context to be 'TIMER'
        if (context != 'TIMER') setContext('TIMER')

        // assigning to ws next-game event channel
        await _assignWSChannelEvents(`${baseWsChannelName}-${response.data.body[0].ref}`)
      } else {
        // assigning to ws placeholder event channel if neither current game nor next game
        if (response.data?.statusCode === HTTP_STATUS_CODE.NOT_FOUND) {
          await _assignWSChannelEvents(`${baseWsChannelName}-placeholder`)
        }
      }
    } catch (err) {
      console.error(`Unhandled rejection at ${loc}._fetchNextGame function. Details: ${err}`)
      toast({ variant: 'destructive', title: 'Ops ...', description: 'Não foi possível buscar o próximo jogo.' })
    } finally {
      setIsLoading(false)
    }
  }

  const _assignWSChannelEvents = async (channelName: string) => {
    console.log('ATRIBUÍNDO EVENTOS AO CANAL: ', channelName) // TODO: remover
    setChannel({ channelName, cb: _channelCb })
    console.log('EVENTOS ATRIBUÍDOS COM SUCESSO AO CANAL: ', channelName) // TODO: remover
  }

  const _channelCb = async (channelName: string, type: WSChannelMessageTypeProps, msg: string) => {
    try {
      if (type === 'ERROR') {
        console.error(`Unhandled error received on WebSocket channel callback. Details: ${JSON.stringify({ channelName, type, msg })}`)
        return
      } else if (type === 'MESSAGE') {
        const parsedMsg: WSGameEventProps = typeof msg === 'string' ? JSON.parse(msg || '{}') : msg
        let allWinners: Winner[] = []
        let winners: Winner[] = []
        let uniqueWinners: Winner[] = []
        let closest: ClosestGameWinnerProps[] = []

        switch (parsedMsg?.action) {
          case WS_GAME_EVENTS.GAME_STARTED:
            console.log('CHAMOU O EVENT_STARTED') // TODO: remover

            // refetching updated data
            if (!currentGameRef.current) {
              if (!isShowingLoadingAlertRef.current) setIsShowingLoadingAlert(true)
              await _fetchCurrentGame(true)
            }
            break

          case WS_GAME_EVENTS.GAME_START_FAIL:
            await showError('Não foi possível iniciar o jogo. Atualize a página e tente novamente.')
            location.reload()
            break

          case WS_GAME_EVENTS.BALL_DRAW:
            console.log('CHAMOU O BALL_DRAW') // TODO: remover

            // if hasn't fetched currentGame yet, waits
            if (!currentGameRef.current) {
              if (!isShowingLoadingAlertRef.current) setIsShowingLoadingAlert(true)
              return
            }

            // forcing context to be 'GAME'
            if (contextRef.current != 'GAME') setContext('GAME')
            if (isShowingLoadingAlertRef.current) setIsShowingLoadingAlert(false)

            // eslint-disable-next-line
            const { nextBall, previousBall } = typeof parsedMsg.data === 'string' ? JSON.parse(parsedMsg.data || '{}') : parsedMsg.data

            // eslint-disable-next-line
            const balls = currentGameRef.current.balls.filter(b => ![String(previousBall), String(nextBall)].includes(String(b)))

            if (previousBall) balls.push(previousBall)
            if (nextBall) balls.push(nextBall)

            setCurrentGame({ ...currentGameRef.current, balls })
            break

          case WS_GAME_EVENTS.BALL_DRAW_FAIL:
            await showError('Não foi possível sortear a próxima bola. Atualize a página e tente novamente.')
            location.reload()
            break

          case WS_GAME_EVENTS.NEW_WINNERS:
            console.log(`CHAMOU O NEW WINNERS`) // TODO: remover

            void ({ winners, closest } = typeof parsedMsg.data === 'string' ? JSON.parse(parsedMsg.data || '{}') : parsedMsg.data)
            allWinners = [...(currentGameRef.current as GameProps).winners, ...winners]
            uniqueWinners = Array.from(new Map(allWinners.map(winner => [winner.ticket.id, winner])).values())
            console.log(`WINNERS: ${winners}`) // TODO: remover
            console.log(`FILTERED WINNERS: ${uniqueWinners}`) // TODO: remover
            console.log(`ALL WINNERS: ${allWinners}`) // TODO: remover
            console.log(`CLOSEST: ${closest}`) // TODO: remover

            setCurrentGame({ ...(currentGameRef.current as GameProps), winners: uniqueWinners })
            setNewWinners(winners || [])
            setClosestWinners(closest || [])
            break

          case WS_GAME_EVENTS.GAME_FINISHED:
            console.log(`CHAMOU O GAME FINISHED`) // TODO: remover

            void ({ winners } = typeof parsedMsg.data === 'string' ? JSON.parse(parsedMsg.data || '{}') : parsedMsg.data)
            allWinners = [...(currentGameRef.current as GameProps).winners, ...winners]
            uniqueWinners = Array.from(new Map(allWinners.map(winner => [winner.ticket.id, winner])).values())
            console.log(`WINNERS: ${winners}`) // TODO: remover
            console.log(`FILTERED WINNERS: ${uniqueWinners}`) // TODO: remover
            console.log(`ALL WINNERS: ${allWinners}`) // TODO: remover

            setCurrentGame({ ...(currentGameRef.current as GameProps), winners: uniqueWinners })

            // TODO: voltar o certo
            // forcing context to be 'TIMER'
            // if (contextRef.current != 'TIMER') setTimeout(() => setContext('TIMER'), 2000)
            // if (contextRef.current != 'TIMER') setContext('TIMER')
            // // refetching updated data
            // await _fetchCurrentGame(true)

            if (!isShowingWinnersAlertRef.current) {
              setIsShowingWinnersAlert(true)

              setTimeout(async () => {
                location.reload()
                // setIsShowingWinnersAlert(false)

                // // refetching updated data
                // await _fetchCurrentGame(true)
              }, 3000)
            }
            break

          case WS_GAME_EVENTS.GAME_FINISH_FAIL:
            await showError('Não foi possível finalizar o jogo. Atualize a página e tente novamente.')
            location.reload()
            break

          default:
            console.error(`Msg action not recognized: ${JSON.stringify(parsedMsg, null, 2)}`)
            break
        }
      } else {
        if (import.meta.env.VITE_NODE_ENV === 'development') toast({ variant: 'destructive', title: 'Ops ...', description: 'Tipo de evento não reconhecido.' })
      }
    } catch (err) {
      console.error(`Unhandled rejection at ${loc}._channelCb function. Details: ${err}`)
      toast({ variant: 'destructive', title: 'Ops ...', description: 'Não foi possível receber o evento.' })
    }
  }

  useEffect(() => {
    setIsLoading(isLoadingConfigs)
  }, [isLoadingConfigs])

  // context observer
  useEffect(() => {
    contextRef.current = context
  }, [context])

  // ws channel observer
  useEffect(() => {
    wsChannelRef.current = wsChannel
  }, [wsChannel])

  // both games observer
  useEffect(() => {
    currentGameRef.current = currentGame
    nextGameRef.current = nextGame

    // TODO: descomentar
    if (!currentGameRef.current) {
      console.log(`TRIGGOU USE EFFECT: ${!!currentGameRef.current} ${!!nextGameRef.current}`)
      _fetchCurrentGame(false)
    }

    // TODO: remover
    // currentGameRef.current = { balls: Array.from({ length: 4 }, (_, i) => String(i + 1)), status: game_status.RUNNING }
    // currentGameRef.current = { balls: Array.from({ length: 5 }, (_, i) => String(i + 1)), status: game_status.RUNNING }
    /* currentGameRef.current = {
      balls: Array.from({ length: 30 }, (_, i) => String(i + 1)),
      status: game_status.RUNNING,
      winners: [
        {
          prizeType: winner_prize_type.FIRST,
          prizeValue: 5,
          ticket: { id: 1, numbers: Array.from({ length: 5 }, (_, i) => String(i + 1)) },
          user: { name: 'Gustavo' }
        },
        {
          prizeType: winner_prize_type.FIRST,
          prizeValue: 5,
          ticket: { id: 2, numbers: Array.from({ length: 5 }, (_, i) => String(i + 1)) },
          user: { name: 'Edu' }
        },
        {
          prizeType: winner_prize_type.SECOND,
          prizeValue: 10,
          ticket: { id: 1, numbers: Array.from({ length: 15 }, (_, i) => String(i + 1)) },
          user: { name: 'Gustavo' }
        },
        {
          prizeType: winner_prize_type.SECOND,
          prizeValue: 10,
          ticket: { id: 2, numbers: Array.from({ length: 15 }, (_, i) => String(i + 1)) },
          user: { name: 'Edu' }
        },
        {
          prizeType: winner_prize_type.THIRD,
          prizeValue: 15,
          ticket: { id: 1, numbers: Array.from({ length: 30 }, (_, i) => String(i + 1)) },
          user: { name: 'Gustavo' }
        },
        {
          prizeType: winner_prize_type.THIRD,
          prizeValue: 15,
          ticket: { id: 2, numbers: Array.from({ length: 30 }, (_, i) => String(i + 1)) },
          user: { name: 'Edu' }
        }
      ]
    } */
  }, [currentGame, nextGame])

  // loading alert observer
  useEffect(() => {
    if (isShowingLoadingAlert) showLoading('Conectando ao servidor de jogo ...')
    else closeLoading()

    isShowingLoadingAlertRef.current = isShowingLoadingAlert
  }, [isShowingLoadingAlert])

  // new winners alert observer
  useEffect(() => {
    isShowingNewWinnersAlertRef.current = isShowingNewWinnersAlert
  }, [isShowingNewWinnersAlert])

  // winners alert observer
  useEffect(() => {
    isShowingWinnersAlertRef.current = isShowingWinnersAlert
  }, [isShowingWinnersAlert])

  // new winners observer
  useEffect(() => {
    newWinnersRef.current = newWinners

    if (newWinnersRef.current?.length) {
      setIsShowingNewWinnersAlert(true)
      setTimeout(() => setIsShowingNewWinnersAlert(false), 1500) // TODO: descomentar
    } else {
      if (isShowingNewWinnersAlertRef.current) setIsShowingNewWinnersAlert(false)
    }
  }, [newWinners])

  // closest winners observer
  useEffect(() => {
    closestWinnersRef.current = closestWinners
  }, [closestWinners])

  return (
    <div className="flex w-full flex-col items-center justify-center gap-y-4 p-8 relative">
      {/* TODO: remover esse botão */}
      {import.meta.env.VITE_NODE_ENV === 'development' && contextRef.current === 'TIMER' && !currentGameRef.current && (
        <Button variant="default" className="absolute top-16 left-0" onClick={_handleStartNextGame}>
          Forçar Início
        </Button>
      )}

      {contextRef.current === 'TIMER' && !isLoading && !nextGameRef.current && (
        <CustomNoData title="Nenhum jogo encontrado" description="Aguarde o início de um jogo para participar." icon={Dices} iconClass={'size-16'} className="mt-16 smAndDown:min-w-screen smAndDown:max-w-screen mdAndUp:max-w-[475px] mdAndUp:min-w-[475px]" />
      )}

      {contextRef.current === 'TIMER' && (isLoading || !!nextGameRef.current) && <HomeTimerContext parentLoading={isLoading} configs={configs} nextGame={nextGameRef.current} />}

      {contextRef.current === 'GAME' && currentGameRef.current?.status === game_status.RUNNING && <HomeGameContext parentLoading={isLoading} game={currentGameRef.current} closest={closestWinnersRef.current} />}

      {isShowingNewWinnersAlertRef.current && currentGameRef.current && <NewWinnersAlert isOpenWinners={true} setIsOpenWinners={setIsShowingNewWinnersAlert} game={currentGameRef.current} newWinners={newWinnersRef.current} />}

      {isShowingWinnersAlertRef.current && currentGameRef.current && <WinnersAlert isOpenWinners={true} setIsOpenWinners={setIsShowingWinnersAlert} game={currentGameRef.current} winners={currentGameRef.current.winners} />}
    </div>
  )
}
