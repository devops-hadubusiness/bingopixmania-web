// packages
import { useEffect, useRef } from 'react'

export function useWaitForStateUpdate(state) {
  const resolverRef = useRef(null)

  useEffect(() => {
    if (resolverRef.current) {
      const { targetValue, resolve } = resolverRef.current

      if (targetValue === 'defined' && !!state) {
        resolve()
        resolverRef.current = null
      } else if (targetValue != 'defined' && state === targetValue) {
        resolve()
        resolverRef.current = null
      }
    }
  }, [state])

  const waitForUpdate = targetValue => {
    return new Promise(resolve => {
      resolverRef.current = { targetValue, resolve }
    })
  }

  return waitForUpdate
}
