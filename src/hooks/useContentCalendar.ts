'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CalendarPost {
  id: string
  title: string
  platform: 'tiktok' | 'reels' | 'shorts'
  time: string
  date: string // YYYY-MM-DD
}

interface ContentCalendarState {
  posts: CalendarPost[]
  addPost: (post: Omit<CalendarPost, 'id'>) => void
  removePost: (id: string) => void
  getPostsByDate: (date: string) => CalendarPost[]
}

export const useContentCalendar = create<ContentCalendarState>()(
  persist(
    (set, get) => ({
      posts: [],
      addPost: (post) =>
        set((state) => ({
          posts: [
            ...state.posts,
            { ...post, id: crypto.randomUUID() },
          ],
        })),
      removePost: (id) =>
        set((state) => ({
          posts: state.posts.filter((p) => p.id !== id),
        })),
      getPostsByDate: (date) => {
        return get().posts.filter((p) => p.date === date)
      },
    }),
    {
      name: 'autoreel_content_calendar',
    }
  )
)
