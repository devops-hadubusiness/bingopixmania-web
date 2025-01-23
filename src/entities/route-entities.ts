// packages
import { z } from 'zod'

export type PrivateRouteSchema = z.infer<typeof privateRouteSchema>

// schemas
export const privateRouteSchema = z.object({
  userRef: z.string().uuid('Referência de usuário inválida.'),
})
