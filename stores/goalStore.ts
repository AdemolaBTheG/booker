import { create } from 'zustand'
import { createJSONStorage } from 'zustand/middleware'
import zustandStorage from './storage'
import {persist} from 'zustand/middleware'


interface GoalStore {
    
  readingGoal: Date,
  bookGoal:number
  setBookGoal: (goal: number) => void
  increaseBookGoal: () => void
  decreaseBookGoal: () => void
  updateReadingGoal: (time: Date) => void

}

export const useGoalStore = create<GoalStore>()(
    persist(
      (set) => ({
        readingGoal: new Date(),
        bookGoal: 0,
        setBookGoal: (goal) => set({ bookGoal: goal }),
        increaseBookGoal: () => set((state) => ({ bookGoal: state.bookGoal + 1 })),
        decreaseBookGoal: () => set((state) => ({ bookGoal: state.bookGoal - 1 })),
        updateReadingGoal: (time) => set(() => ({ readingGoal: time }))
      }),
      {
        name: 'goal-storage', // name of the item in the storage (must be unique)
        storage: createJSONStorage(() => zustandStorage), // (optional) by default, 'localStorage' is used
      },
    ),
  )

export default useGoalStore
