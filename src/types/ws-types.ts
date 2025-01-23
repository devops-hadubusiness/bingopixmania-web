export type WSGameEventActionProps = 'GAME_STARTED' | 'GAME_START_FAIL' | 'BALL_DRAW' | 'BALL_DRAW_FAIL' | 'NEW_WINNERS' | 'GAME_FINISHED' | 'GAME_FINISH_FAIL'

export type WSGameEventProps = {
  gameRef: string
  action: WSGameEventActionProps
  data?: string
}

export type WSChannelMessageTypeProps = 'MESSAGE' | 'ERROR'
