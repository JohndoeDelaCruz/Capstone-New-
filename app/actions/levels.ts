'use server'

import { revalidatePath } from 'next/cache'

// Types
export interface Question {
  id: number
  text: string
  answer: string
  points: number
}

export interface Reading {
  id: number
  title: string
  content: string
  questions: Question[]
  completed: boolean
  difficulty: 'easy' | 'medium' | 'hard'
}

export interface Level {
  id: number
  title: string
  readings: Reading[]
  unlocked: boolean
}

// In-memory storage (replace with your database in production)
let levelsData: Level[] = []

export async function getLevels() {
  return levelsData
}

export async function updateLevels(levels: Level[]) {
  levelsData = levels
  revalidatePath('/admin')
  revalidatePath('/')
  return levelsData
}

