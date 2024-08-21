import { defineStore } from 'pinia'

interface SideMenuState {
  isOpen: boolean
  title: string
  description: string
  mediaType: string
  url: string
}

export const sideMenuStore = defineStore('sideMenuState', {
  state: (): SideMenuState => {
    return {
      isOpen: false,
      title: 'A New Landmark',
      description: 'This is a description.',
      mediaType: 'image',
      url: 'https://drive.google.com/file/d/1FNWwNJFVRxzz47pvjpLLwffWvXZ6UMQM/preview'
    }
  }
})
