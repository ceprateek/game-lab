import { create } from 'zustand'

const useAppStore = create((set) => ({
  currentGame: null,

  selectGame: (gameId) => set({ currentGame: gameId }),
  backToMenu: () => set({ currentGame: null }),
}))

export default useAppStore
