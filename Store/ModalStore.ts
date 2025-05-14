// store/ModalStore.ts
import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

type ModalStore = {
  isOpen: boolean
  openModal: () => void
  closeModal: () => void
}

export const useModalStore = create<ModalStore>()(
  subscribeWithSelector((set) => ({
    isOpen: false,
    openModal: () => set({ isOpen: true }),
    closeModal: () => set({ isOpen: false }),
  }))
)
