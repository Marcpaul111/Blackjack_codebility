import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import BlackjackGame from './BlackjackGame'

const mockStore = configureStore([])

describe('BlackjackGame', () => {
  let store: any

  beforeEach(() => {
    store = mockStore({
      game: {
        playerCards: [],
        dealerCards: [],
        playerScore: 0,
        dealerScore: 0,
        winner: null,
        wallet: 1000,
        playerBet: 0,
        gameStarted: false,
        playerStanding: false,
        playerBust: false,
        playerBlackjack: false,
      },
    })
  })

})
