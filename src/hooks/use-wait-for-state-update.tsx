// packages
import { useEffect, useRef } from 'react'

export function useWaitForStateUpdate(state) {
  const resolverRef = useRef(null)

  useEffect(() => {
    if (resolverRef.current) {
      resolverRef.current() // Resolve a Promise quando o estado é atualizado
      resolverRef.current = null
    }
  }, [state]) // O efeito será disparado sempre que o estado for atualizado

  const waitForUpdate = () => {
    return new Promise(resolve => {
      resolverRef.current = resolve
    })
  }

  return waitForUpdate
}
