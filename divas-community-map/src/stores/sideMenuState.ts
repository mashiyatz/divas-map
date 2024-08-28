import { defineStore } from 'pinia'

interface media {
  mediaType: string
  url: string
  caption: string
}

// TODO
// 1. allow listing of multiple images, and include a main image that will be featuered on 3
// 2. toggle between neighborhoods (a list of neighborhoods)
// 3. toggle between landmarks (a list of landmarks, identified by main image)

interface SideMenuState {
  id: number
  neighborhood?: string
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
      url: 'https://upload.wikimedia.org/wikipedia/commons/7/77/Prospect_Park_New_York_May_2015_008.jpg'
    }
  }
})
