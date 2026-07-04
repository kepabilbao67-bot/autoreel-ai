'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface VideoHistoryItem {
  id: string
  title: string
  topic: string
  platform: string
  language: string
  style: string
  duration: number
  script: string
  hashtags: string[]
  viralityScore: number
  createdAt: string
  templateId: string
}

interface VideoHistoryState {
  videos: VideoHistoryItem[]
  addVideo: (video: Omit<VideoHistoryItem, 'id' | 'createdAt'>) => void
  removeVideo: (id: string) => void
  clearHistory: () => void
}

export const useVideoHistory = create<VideoHistoryState>()(
  persist(
    (set) => ({
      videos: [],
      addVideo: (video) =>
        set((state) => {
          const newVideo: VideoHistoryItem = {
            ...video,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
          }
          const updated = [newVideo, ...state.videos].slice(0, 50)
          return { videos: updated }
        }),
      removeVideo: (id) =>
        set((state) => ({
          videos: state.videos.filter((v) => v.id !== id),
        })),
      clearHistory: () => set({ videos: [] }),
    }),
    {
      name: 'autoreel_video_history',
    }
  )
)
