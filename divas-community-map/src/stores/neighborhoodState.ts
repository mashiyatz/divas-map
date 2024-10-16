import { defineStore } from 'pinia'

interface NeighborhoodState {
  neighborhoodList: string[]
}

export const neighborhoodStore = defineStore('neighborhoodState', {
  state: (): NeighborhoodState => {
    return {
      neighborhoodList: ['Laurelton', 'East New York', 'Eastchester', 'Hunts Point']
    }
  }
})
