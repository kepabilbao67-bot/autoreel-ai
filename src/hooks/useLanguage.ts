'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Language } from '@/lib/i18n'
import { t as translate } from '@/lib/i18n'

// Estado global del idioma con persistencia en localStorage
interface LanguageState {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

export const useLanguage = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: 'es',
      setLanguage: (lang: Language) => set({ language: lang }),
      t: (key: string) => translate(key, get().language),
    }),
    {
      name: 'autoreel-language',
    }
  )
)
