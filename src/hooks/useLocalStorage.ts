'use client'

import { useSyncExternalStore } from 'react'

// Lectura de localStorage compatible con SSR y con el React Compiler.
//
// Antes cada componente leía localStorage en un useEffect y llamaba a setState
// (regla react-hooks/set-state-in-effect). useSyncExternalStore es la forma que
// recomienda React para leer un almacén externo: en el servidor y durante la
// hidratación devuelve `undefined` ("todavía no se sabe") y, ya en el navegador,
// el valor real. Así el HTML del servidor coincide con el primer render del cliente.

const CHANGE_EVENT = 'autoreel:local-storage'

function subscribe(onChange: () => void) {
  window.addEventListener('storage', onChange) // cambios desde otras pestañas
  window.addEventListener(CHANGE_EVENT, onChange) // cambios desde esta pestaña
  return () => {
    window.removeEventListener('storage', onChange)
    window.removeEventListener(CHANGE_EVENT, onChange)
  }
}

function read(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null // modo privado o almacenamiento bloqueado
  }
}

/**
 * Valor en bruto de una clave de localStorage.
 * - `undefined`: aún no se conoce (servidor o hidratación).
 * - `null`: la clave no existe.
 * - `string`: el valor guardado.
 */
export function useLocalStorageValue(key: string): string | null | undefined {
  return useSyncExternalStore(
    subscribe,
    () => read(key),
    () => undefined
  )
}

/** Escribe (o borra, con `null`) una clave y avisa a los componentes suscritos. */
export function writeLocalStorage(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key)
    else localStorage.setItem(key, value)
  } catch {
    // almacenamiento no disponible: no se persiste
  }
  window.dispatchEvent(new Event(CHANGE_EVENT))
}
