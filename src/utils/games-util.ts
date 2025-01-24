// entities
import { game_status } from "@/entities/game/game"

export function getNumberClasses(balls: string[], number: string, status: game_status) {
  if (balls?.some(b => String(b) === String(number))) {
    if (String(balls?.at(-1)) === String(number) && status === game_status.RUNNING) return 'bg-primary-text text-primary-foreground'
    return 'bg-success text-primary-foreground'
  }

  return 'bg-background text-muted-foreground'
}
