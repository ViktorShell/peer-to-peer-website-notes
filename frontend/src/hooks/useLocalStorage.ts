import { useCallback, useEffect, useState } from 'react'

/**
 * Typed localStorage hook with cross-tab sync via the `storage` event.
 * Returns [value, setValue] where setValue accepts a value or updater.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void] {
  const read = useCallback((): T => {
    if (typeof window === 'undefined') return initialValue
    try {
      const item = window.localStorage.getItem(key)
      return item === null ? initialValue : (JSON.parse(item) as T)
    } catch {
      return initialValue
    }
  }, [key, initialValue])

  const [stored, setStored] = useState<T>(read)

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStored((prev) => {
        const next =
          typeof value === 'function' ? (value as (p: T) => T)(prev) : value
        try {
          window.localStorage.setItem(key, JSON.stringify(next))
        } catch {
          /* quota or serialization errors are non-fatal */
        }
        return next
      })
    },
    [key],
  )

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key !== key || e.newValue === null) return
      try {
        setStored(JSON.parse(e.newValue) as T)
      } catch {
        /* ignore corrupted */
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [key])

  return [stored, setValue]
}
