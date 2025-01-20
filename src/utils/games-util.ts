// entities
import { game_status } from "@/entities/game/game"

export function getNumberClasses(balls: string[], number: string, status: game_status) {
  if (balls?.some(b => b === number)) {
    if (balls?.at(-1) === number && status === game_status.RUNNING) return 'bg-rose-700 text-primary-foreground'
    return 'bg-success text-primary-foreground'
  }

  return 'bg-background text-muted-foreground'
}
