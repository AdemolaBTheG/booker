import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import zustandStorage from './storage';

interface TimerState {
  isRunning: boolean;
  accumulatedTime: number; // Time from previous runs
  currentSessionTime: number; // Time in current session
  startTime: number | null;
  currentBookId: string | null;
  currentBookTitle: string | null;
  currentBookAuthor: string | null;
  currentBookThumbnail: string | null;
  // Actions
  startTimer: (bookId: string) => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  updateElapsedTime: () => void;
  formatTime: (ms: number) => string;
  getTotalElapsedTime: () => number;
  setCurrentBookId: (bookId: string) => void;
  setCurrentBookTitle: (title: string) => void;
  setCurrentBookAuthor: (author: string) => void;
  setCurrentBookThumbnail: (thumbnail: string) => void;
}


export const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      isRunning: false,
      accumulatedTime: 0,
      currentSessionTime: 0,
      startTime: null,
      currentBookId: null,
      currentBookTitle: null,
      currentBookAuthor: null,
      currentBookThumbnail: null,
      startTimer: (bookId: string) => {
        console.log("Store: Starting timer with bookId:", bookId);
        set(state => {
          console.log("Current state before starting:", state);
          return {
            isRunning: true,
            startTime: Date.now(),
            currentSessionTime: 0,
            currentBookId: bookId || state.currentBookId,
          };
        });
        // Log state after update
        console.log("Store: Timer started, new state:", get());
      },

      pauseTimer: () => {
        const { startTime, isRunning, accumulatedTime } = get();
        console.log("Pausing timer, current state:", get());
        
        if (isRunning && startTime) {
          const currentElapsed = Date.now() - startTime;
          console.log("Current elapsed time for this session:", currentElapsed);
          
          set({
            isRunning: false,
            accumulatedTime: accumulatedTime + currentElapsed,
            currentSessionTime: 0, // Reset current session time
            startTime: null
          });
          
          console.log("After pause, state:", get());
        }
      },

      resetTimer: () => {
        set({
          isRunning: false,
          accumulatedTime: 0,
          currentSessionTime: 0,
          startTime: null,
          currentBookId: null,
        });
      },

      updateElapsedTime: () => {
        const { startTime, isRunning } = get();
        if (isRunning && startTime) {
          set({ currentSessionTime: Date.now() - startTime });
        }
      },

      getTotalElapsedTime: () => {
        const { accumulatedTime, currentSessionTime } = get();
        return accumulatedTime + currentSessionTime;
      },

      formatTime: (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      },

      setCurrentBookId: (bookId: string) => {
        set({ currentBookId: bookId });
      },

      setCurrentBookTitle: (title: string) => {
        set({ currentBookTitle: title });
      },
      setCurrentBookAuthor: (author: string) => {
        set({ currentBookAuthor: author });
      },
      setCurrentBookThumbnail: (thumbnail: string) => {
        set({ currentBookThumbnail: thumbnail });
      },
      
    }),

    {
      name: 'timer-storage',
      storage: createJSONStorage(() => zustandStorage),
      onRehydrateStorage: () => (state) => {
        // Handle app restart with running timer
        if (state?.isRunning) {
          state.startTimer(state.currentBookId!);
        }
      },
    }
  )
); 