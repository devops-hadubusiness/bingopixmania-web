// types
import { WSGameEventActionProps } from '@/types/ws-types'

// variables
export const WS_GAME_EVENTS: Record<WSGameEventActionProps, WSGameEventActionProps> = {
  GAME_STARTED: 'GAME_STARTED',
  GAME_START_FAIL: 'GAME_START_FAIL',
  BALL_DRAW: 'BALL_DRAW',
  BALL_DRAW_FAIL: 'BALL_DRAW_FAIL',
  NEW_WINNERS: 'NEW_WINNERS',
  GAME_FINISHED: 'GAME_FINISHED',
  GAME_FINISH_FAIL: 'GAME_FINISH_FAIL',
}
