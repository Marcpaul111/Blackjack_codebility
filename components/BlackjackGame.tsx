"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import BettingDialog from "./BettingOptions";
import DealerHand from "./DealerHand";
import PlayerHand from "./PlayerHand";
import {
  START_GAME,
  RESET_GAME,
  RESET_GAME_WITH_INITIAL_WALLET,
  CHECK_BLACKJACK,
  DETERMINE_WINNER,
  PLAYER_HIT,
  SET_PLAYER_STANDING,
  DEALER_TURN,
  SET_BET,
} from "@/store/gameSlice";
import { RootState } from "@/store/store";

export default function BlackjackGame() {
  const dispatch = useDispatch();
  const game = useSelector((state: RootState) => state.game);
  const [isBettingDialogOpen, setIsBettingDialogOpen] = useState(false);
  const [isWinnerVisible, setIsWinnerVisible] = useState(false);

  useEffect(() => {
    console.log("Game state:", game);
  }, [game]);

  useEffect(() => {
    if (game.gameStarted) {
      console.log("Game started, checking for blackjack");
      dispatch(CHECK_BLACKJACK());
    }
  }, [game.gameStarted, dispatch]);

  useEffect(() => {
    if (game.playerStanding || game.playerBust || game.playerBlackjack) {
      console.log("Player turn ended, starting dealer turn");
      dispatch(DEALER_TURN());
      setTimeout(() => {
        dispatch(DETERMINE_WINNER());
        setIsWinnerVisible(true);
      }, 2000);
    }
  }, [game.playerStanding, game.playerBust, game.playerBlackjack, dispatch]);

  const handleStartGame = () => {
    console.log("Opening betting dialog");
    setIsBettingDialogOpen(true);
  };

  const handleBetPlaced = (betAmount: number) => {
    console.log("Bet placed:", betAmount);
    dispatch(SET_BET(betAmount));
    dispatch(START_GAME());
    setIsBettingDialogOpen(false);
  };

  const handleHit = () => {
    console.log("Player hit");
    dispatch(PLAYER_HIT());
  };

  const handleStand = () => {
    console.log("Player stand");
    dispatch(SET_PLAYER_STANDING(true));
  };

  const handleNewGame = () => {
    console.log("Starting new game");
    dispatch(RESET_GAME());
    setIsBettingDialogOpen(true);
  };

  const handleResetWallet = () => {
    console.log("Resetting wallet");
    dispatch(RESET_GAME_WITH_INITIAL_WALLET());
    setIsBettingDialogOpen(true);
  };

  const isGameOver = game.winner !== null;
  const isOutOfMoney = game.wallet === 0;

  const gameResult = game.winner;

  useEffect(() => {
    console.log("Winner updated:", game.winner);
  }, [game.winner]);
  const getGameOutcomeMessage = () => {
    if (game.playerBust) {
      return "Player Busts! Dealer Wins";
    } else if (game.dealerScore && game.playerScore > 21) {
      return "Player Busts!";
    } else if (game.dealerScore > 21 && game.playerScore < 21) {
      return "Dealer Busts!";
    } else if (game.playerScore == 21) {
      return "Blackjack!";
    } else if (game.dealerScore == 21) {
      return "Blackjack!";
    } else if (game.winner === "push") {
      return "It's a Push";
    }
    return "";
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center text-white">
        Blackjack
      </h1>
      <Card className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-2xl">
            Wallet: <span className="font-bold">${game.wallet}</span>
          </p>
          <p className="text-2xl">
            Current Bet: <span className="font-bold">${game.playerBet}</span>
          </p>
        </div>
        {game.gameStarted ? (
          <>
            <DealerHand
              cards={game.dealerCards}
              score={game.dealerScore}
              revealHidden={
                game.playerStanding || game.playerBust || game.playerBlackjack
              }
            />
            <PlayerHand cards={game.playerCards} score={game.playerScore} />
            <div className="flex justify-center space-x-4">
              <Button
                onClick={handleHit}
                disabled={
                  game.playerStanding || game.playerBust || game.playerBlackjack
                }
              >
                Hit
              </Button>
              <Button
                onClick={handleStand}
                disabled={
                  game.playerStanding || game.playerBust || game.playerBlackjack
                }
              >
                Stand
              </Button>
            </div>
          </>
        ) : (
          <div className="flex justify-center">
            <Button onClick={handleStartGame} disabled={isOutOfMoney}>
              Start Game
            </Button>
          </div>
        )}

        {isGameOver && (
          <div className="text-center">
            <p className="text-2xl font-bold mb-4">{getGameOutcomeMessage()}</p>
            <p className="mb-4">
              Final Scores - Player: {game.playerScore}, Dealer:
              {game.dealerScore}
            </p>
            <p className="text-2xl font-bold mb-4">
              {game.winner === "player"
                ? "You Win!"
                : game.winner === "dealer"
                ? "Dealer Wins"
                : "Push"}
            </p>
            <div className="space-x-4">
              {(isGameOver || isOutOfMoney) && (
                <Button onClick={handleResetWallet} disabled={game.wallet > 0}>
                  Reset Wallet
                </Button>
              )}
            </div>
          </div>
        )}
      </Card>
      <BettingDialog isOpen={isBettingDialogOpen} onClose={handleBetPlaced} />
    </div>
  );
}
