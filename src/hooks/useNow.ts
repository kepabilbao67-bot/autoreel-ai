'use client'

import { useSyncExternalStore } from 'react'

// Hora actual redondeada al minuto, para textos como "Hace 5 min".
// Llamar a Date.now() directamente al renderizar es impuro (regla
// react-hooks/purity): el resultado cambia entre renders. Aquí la hora vive en un
// almacén externo que se actualiza cada minuto. En el servidor devuelve null.

const MINUTE = 60_000

function subscribe(onChange: () => void) {
  const id = setInterval(onChange, MINUTE)
  return () => clearInterval(id)
}

// Redondear al minuto hace que getSnapshot devuelva el mismo valor entre renders
// dentro del mismo minuto, como exige useSyncExternalStore.
const getSnapshot = () => Math.floor(Date.now() / MINUTE) * MINUTE

export function useNow(): number | null {
  return useSyncExternalStore(subscribe, getSnapshot, () => null)
}
