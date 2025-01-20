export type WSGameEventActionProps = 'GAME_STARTED' | 'GAME_START_FAIL' | 'GAME_FINISHED' | 'GAME_FINISH_FAIL' | 'BALL_DRAW' | 'BALL_DRAW_FAIL'

export type WSGameEventProps = {
  gameRef: string
  action: WSGameEventActionProps
  data?: string
}
