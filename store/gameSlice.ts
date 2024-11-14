import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import createDeck from '../lib/createDeck';
import checkCard from '../lib/checkCard';

interface Card {
  suit: string;
  face: string | number;
  image: string;
}

interface GameState {
  deck: Card[];
  playerCards: Card[];
  dealerCards: Card[];
  playerScore: number;
  dealerScore: number;
  winner: string | null;
  wallet: number;
  playerBet: number;
  playerStanding: boolean;
  dealerStanding: boolean;
  gameStarted: boolean;
  lastDrawnCard: Card | null;
  playerBust: boolean;
  playerBlackjack: boolean;
}

const initialWallet = 1000;

const initialState: GameState = {
  deck: [],
  playerCards: [],
  dealerCards: [],
  playerScore: 0,
  dealerScore: 0,
  winner: null,
  wallet: initialWallet,
  playerBet: 0,
  playerStanding: false,
  dealerStanding: false,
  gameStarted: false,
  lastDrawnCard: null,
  playerBust: false,
  playerBlackjack: false,
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    START_GAME: (state) => {
      if (state.playerBet > 0) {
        state.winner = null;
        state.deck = createDeck();
        state.playerCards = [state.deck.pop()!, state.deck.pop()!];
        state.dealerCards = [state.deck.pop()!, state.deck.pop()!];
        state.dealerScore = calculateScore([state.dealerCards[0]]);
        state.playerScore = calculateScore(state.playerCards);
        state.playerStanding = false;
        state.dealerStanding = false;
        state.gameStarted = true;
        state.lastDrawnCard = null;
        state.playerBust = false;
        state.playerBlackjack = false;
        console.log("Game started, player cards:", state.playerCards, "dealer cards:", state.dealerCards);
      }
    },
    RESET_GAME: (state) => {
      console.log("Resetting game with current wallet");
      return {
        ...initialState,
        wallet: state.wallet,
        deck: createDeck(),
        playerStanding: false,
        playerBust: false,
        playerBlackjack: false,
      };
    },
    RESET_GAME_WITH_INITIAL_WALLET: () => {
      console.log("Resetting game with initial wallet");
      return {
        ...initialState,
        wallet: initialWallet,
        deck: createDeck(),
        playerStanding: false,
        playerBust: false,
        playerBlackjack: false,
      };
    },
    SET_BET: (state, action: PayloadAction<number>) => {
      if (state.wallet >= action.payload) {
        state.wallet -= action.payload;
        state.playerBet = action.payload;
        console.log(`Bet placed: ${action.payload}, wallet: ${state.wallet}`);
      }
    },
    CHECK_BLACKJACK: (state) => {
      if (state.playerScore === 21) {
        state.playerBlackjack = true;
        console.log("Player has Blackjack");
      }
    },
    DETERMINE_WINNER: (state) => {
      if (!state.playerStanding && !state.playerBust && !state.playerBlackjack) {
        return;
      }

      state.dealerScore = calculateScore(state.dealerCards);

      console.log("Determining winner");
      console.log("Player score:", state.playerScore, "Dealer score:", state.dealerScore);

      if (state.playerBlackjack && state.dealerScore !== 21) {
        state.winner = 'player';
        state.wallet += Math.floor(state.playerBet * 2);
        console.log("Player wins with Blackjack");
      } else if (state.playerBust) {
        state.winner = 'dealer';
        console.log("Player busts, dealer wins");
      } else if (state.dealerScore > 21) {
        state.winner = 'player';
        state.wallet += state.playerBet * 2;
        console.log("Dealer busts, player wins");
      } else if (state.playerScore > state.dealerScore) {
        state.winner = 'player';
        state.wallet += state.playerBet * 2;
        console.log("Player score higher, player wins");
      } else if (state.dealerScore > state.playerScore) {
        state.winner = 'dealer';
        console.log("Dealer score higher, dealer wins");
      } else {
        state.winner = 'push';
        state.wallet += state.playerBet;
        console.log("Tie, push");
      }

      state.gameStarted = false;
      state.playerBet = 0;
      state.playerStanding = false;
      state.playerBust = false;
      state.playerBlackjack = false;
      console.log("Winner determined:", state.winner, "wallet:", state.wallet);
    },
    PLAYER_HIT: (state) => {
      if (!state.gameStarted || state.playerStanding) return;

      const newCard = state.deck.pop()!;
      state.playerCards.push(newCard);
      state.lastDrawnCard = newCard;
      state.playerScore = calculateScore(state.playerCards);

      if (state.playerScore > 21) {
        state.playerBust = true;
        state.playerStanding = true;
        console.log("Player busts");
      } else if (state.playerScore === 21) {
        state.playerStanding = true;
        console.log("Player stands");
      }
    },
    SET_PLAYER_STANDING: (state, action: PayloadAction<boolean>) => {
      if (state.gameStarted) {
        state.playerStanding = action.payload;
        console.log("Player standing:", action.payload);
      }
    },
    DEALER_TURN: (state) => {
      if (!state.playerStanding && !state.playerBust && !state.playerBlackjack) return;

      state.dealerScore = calculateScore(state.dealerCards);

      while (state.dealerScore < 17) {
        const newCard = state.deck.pop()!;
        state.dealerCards.push(newCard);
        state.dealerScore = calculateScore(state.dealerCards);
        console.log("Dealer draws card, new score:", state.dealerScore);
      }

      state.dealerStanding = true;
      console.log("Dealer standing");
    },
  },
});

function calculateScore(cards: Card[]): number {
  let score = 0;
  let aces = 0;

  for (const card of cards) {
    if (card.face === 'ace') {
      aces += 1;
    } else {
      score += checkCard(card, 0);
    }
  }

  for (let i = 0; i < aces; i++) {
    if (score + 11 <= 21) {
      score += 11;
    } else {
      score += 1;
    }
  }

  return score;
}

export const {
  START_GAME,
  RESET_GAME,
  RESET_GAME_WITH_INITIAL_WALLET,
  SET_BET,
  CHECK_BLACKJACK,
  DETERMINE_WINNER,
  PLAYER_HIT,
  SET_PLAYER_STANDING,
  DEALER_TURN,
} = gameSlice.actions;

export default gameSlice.reducer;