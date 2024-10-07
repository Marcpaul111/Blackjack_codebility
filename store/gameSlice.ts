import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import createDeck from '../lib/createDeck'
import checkCard from '../lib/checkCard'

interface Card {
  suit: string
  face: string | number
  image: string
}

interface GameState {
  deck: Card[]
  playerCards: Card[]
  dealerCards: Card[]
  playerScore: number
  dealerScore: number
  winner: string | null
  wallet: number
  playerBet: number
  playerStanding: boolean
  dealerStanding: boolean
  gameStarted: boolean
  lastDrawnCard: Card | null
  acesToHandle: Card[]
}

const initialState: GameState = {
  deck: [],
  playerCards: [],
  dealerCards: [],
  playerScore: 0,
  dealerScore: 0,
  winner: null,
  wallet: 1000,
  playerBet: 0,
  playerStanding: false,
  dealerStanding: false,
  gameStarted: false,
  lastDrawnCard: null,
  acesToHandle: [],
}

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    START_GAME: (state) => {
      state.winner = null
      state.deck = createDeck()
      state.playerCards = [state.deck.pop()!, state.deck.pop()!]
      state.dealerCards = [state.deck.pop()!, state.deck.pop()!]
      state.dealerScore = calculateScore(state.dealerCards)
      state.playerScore = calculateInitialScore(state.playerCards)
      state.playerStanding = false
      state.dealerStanding = false
      state.gameStarted = true
      state.lastDrawnCard = null
      state.acesToHandle = state.playerCards.filter(card => card.face === 'ace')
    },
    SET_BET: (state, action: PayloadAction<number>) => {
      if (state.wallet >= action.payload) {
        state.wallet -= action.payload
        state.playerBet = action.payload
      }
    },
    UPDATE_SCORE: (state, action: PayloadAction<{ player: boolean; wants11: number }>) => {
      if (action.payload.player) {
        state.playerScore = calculateScore(state.playerCards, action.payload.wants11)
        if (state.acesToHandle.length > 0) {
          state.acesToHandle.pop() // Remove the Ace we just handled
        }
      } else {
        state.dealerScore = calculateScore(state.dealerCards)
      }
    },
    DETERMINE_WINNER: (state) => {
      if (state.playerScore > 21) {
        state.winner = 'Dealer'
      } else if (state.dealerScore > 21) {
        state.winner = 'Player'
        state.wallet += state.playerBet * 2
      } else if (state.playerStanding && state.dealerStanding) {
        if (state.playerScore > state.dealerScore) {
          state.winner = 'Player'
          state.wallet += state.playerBet * 2
        } else if (state.dealerScore > state.playerScore) {
          state.winner = 'Dealer'
        } else {
          state.winner = 'push'
          state.wallet += state.playerBet
        }
      }
      if (state.winner) {
        state.gameStarted = false
      }
    },
    PLAYER_HIT: (state) => {
      const newCard = state.deck.pop()!
      state.playerCards.push(newCard)
      state.lastDrawnCard = newCard
      if (newCard.face === 'ace') {
        state.acesToHandle.push(newCard)
      } else {
        state.playerScore = calculateScore(state.playerCards)
      }
    },
    SET_PLAYER_STANDING: (state, action: PayloadAction<boolean>) => {
      state.playerStanding = action.payload
    },
    DEALER_TURN: (state, action: PayloadAction<boolean>) => {
      if (action.payload) {
        while (state.dealerScore < 17) {
          state.dealerCards.push(state.deck.pop()!)
          state.dealerScore = calculateScore(state.dealerCards)
        }
        state.dealerStanding = true
      }
    },
  },
})

function calculateInitialScore(cards: Card[]): number {
  let score = 0
  let aces = 0

  for (const card of cards) {
    if (card.face === 'ace') {
      aces += 1
    } else {
      score += checkCard(card, 0)
    }
  }

  // For initial score, we'll count Aces as 11 if it doesn't bust, otherwise as 1
  for (let i = 0; i < aces; i++) {
    if (score + 11 <= 21) {
      score += 11
    } else {
      score += 1
    }
  }

  return score
}

function calculateScore(cards: Card[], wants11: number = 0): number {
  let score = 0
  let aces = 0

  for (const card of cards) {
    if (card.face === 'ace') {
      aces += 1
    } else {
      score += checkCard(card, 0)
    }
  }

  for (let i = 0; i < aces; i++) {
    if (i === aces - 1 && wants11 === 11 && score + 11 <= 21) {
      score += 11
    } else if (score + 11 <= 21) {
      score += 11
    } else {
      score += 1
    }
  }

  return score
}

export const {
  START_GAME,
  SET_BET,
  UPDATE_SCORE,
  DETERMINE_WINNER,
  PLAYER_HIT,
  SET_PLAYER_STANDING,
  DEALER_TURN,
} = gameSlice.actions

export default gameSlice.reducer