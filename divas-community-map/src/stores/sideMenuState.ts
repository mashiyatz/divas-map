import { defineStore } from 'pinia'

interface media {
  mediaType: string
  url: string
  caption: string
}

interface SideMenuState {
  id: number
  neighborhood?: string
  borough?: string
  title: string
  description: string
  mediaType: string
  url: string
  slideShow?: string[]
  allMedia?: media[]
}

export const sideMenuStore = defineStore('sideMenuState', {
  state: (): SideMenuState => {
    return {
      id: 0,
      title: 'DIVAS Community Assets',
      description:
        'Children from all over the city have gathered a list of resources in their neighborhood -- have you been to any of these places?',
      mediaType: 'image',
      url: ''
    }
  }
})
