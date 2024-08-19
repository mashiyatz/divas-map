import { defineStore } from 'pinia'

interface SideMenuState {
  isOpen: boolean
  title: string
  description: string
}

export const sideMenuStore = defineStore('sideMenuState', {
  state: (): SideMenuState => {
    return {
      isOpen: false,
      title: 'A New Landmark',
      description: 'This is a description.'
    }
  }
})
