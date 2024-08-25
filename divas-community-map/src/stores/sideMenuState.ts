import { defineStore } from 'pinia'

interface SideMenuState {
  id: number
  isOpen: boolean
  title: string
  description: string
  mediaType: string
  url: string
}

export const sideMenuStore = defineStore('sideMenuState', {
  state: (): SideMenuState => {
    return {
      id: 0,
      isOpen: false,
      title: 'DIVAS Community Assets',
      description:
        'Children from all over the city have gathered a list of resources in their neighborhood -- have you been to any of these places?',
      mediaType: 'image',
      url: 'https://upload.wikimedia.org/wikipedia/commons/7/77/Prospect_Park_New_York_May_2015_008.jpg'
    }
  }
})
