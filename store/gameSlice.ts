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
  playerAceValues: number[]
  playerBust: boolean
  playerBlackjack: boolean
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
  playerAceValues: [],
  playerBust: false,
  playerBlackjack: false,
}

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    START_GAME: (state) => {
      if (state.playerBet > 0) {
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
        state.playerAceValues = []
        state.playerBust = false
        state.playerBlackjack = state.playerScore === 21
        if (state.playerBlackjack) {
          state.winner = 'Player'
          state.wallet += Math.floor(state.playerBet * 2.5) // Blackjack typically pays 3:2
        }
      }
    },
    RESET_GAME: (state) => {
      Object.assign(state, {...initialState, wallet: state.wallet})
    },
    SET_BET: (state, action: PayloadAction<number>) => {
      if (state.wallet >= action.payload) {
        state.wallet -= action.payload
        state.playerBet = action.payload
      }
    },
    UPDATE_SCORE: (state, action: PayloadAction<{ player: boolean; wants11: number }>) => {
      if (action.payload.player) {
        state.playerAceValues.push(action.payload.wants11)
        state.playerScore = calculateScore(state.playerCards, state.playerAceValues)
        if (state.acesToHandle.length > 0) {
          state.acesToHandle.pop()
        }
        if (state.playerScore > 21) {
          state.playerBust = true
          state.winner = 'Dealer'
        } else if (state.playerScore === 21) {
          state.playerBlackjack = true
          state.winner = 'Player'
          state.wallet += Math.floor(state.playerBet * 2.5) // Blackjack typically pays 3:2
        }
      } else {
        state.dealerScore = calculateScore(state.dealerCards)
      }
    },
    DETERMINE_WINNER: (state) => {
      if (state.playerBlackjack) {
        state.winner = 'Player'
        state.wallet += Math.floor(state.playerBet * 2.5) // Blackjack typically pays 3:2
      } else if (state.playerBust || state.playerScore > 21) {
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
        state.playerBet = 0
      }
    },
    PLAYER_HIT: (state) => {
      const newCard = state.deck.pop()!
      state.playerCards.push(newCard)
      state.lastDrawnCard = newCard
      if (newCard.face === 'ace') {
        state.acesToHandle.push(newCard)
      } else {
        state.playerScore = calculateScore(state.playerCards, state.playerAceValues)
        if (state.playerScore > 21) {
          state.playerBust = true
          state.winner = 'Dealer'
        } else if (state.playerScore === 21) {
          state.playerBlackjack = true
          state.winner = 'Player'
          state.wallet += Math.floor(state.playerBet * 2.5) // Blackjack typically pays 3:2
        }
      }
    },
    SET_PLAYER_STANDING: (state, action: PayloadAction<boolean>) => {
      state.playerStanding = action.payload
    },
    DEALER_TURN: (state, action: PayloadAction<boolean>) => {
      if (action.payload) {
        while (state.dealerScore < 17) {
          const newCard = state.deck.pop()!
          state.dealerCards.push(newCard)
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

  for (let i = 0; i < aces; i++) {
    if (score + 11 <= 21) {
      score += 11
    } else {
      score += 1
    }
  }

  return score
}

function calculateScore(cards: Card[], aceValues: number[] = []): number {
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
    if (i < aceValues.length) {
      score += aceValues[i]
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
  RESET_GAME,
  SET_BET,
  UPDATE_SCORE,
  DETERMINE_WINNER,
  PLAYER_HIT,
  SET_PLAYER_STANDING,
  DEALER_TURN,
} = gameSlice.actions

export default gameSlice.reducer