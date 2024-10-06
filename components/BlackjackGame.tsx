'use client'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { RootState } from '@/store/store'
import { gameSlice } from '@/store/gameSlice'
import PlayerHand from './PlayerHand'
import DealerHand from './DealerHand'
import AceDialog from './AceDialog'
import BettingDialog from './BettingOptions'

export default function BlackjackGame() {
  const dispatch = useDispatch()
  const { 
    playerCards, 
    dealerCards, 
    playerScore, 
    dealerScore, 
    winner, 
    wallet, 
    playerBet,
    gameStarted,
    playerStanding,
    lastDrawnCard,
    acesToHandle
  } = useSelector((state: RootState) => state.game)

  const [isAceDialogOpen, setIsAceDialogOpen] = useState(false)
  const [isBettingDialogOpen, setIsBettingDialogOpen] = useState(true)
  const [revealDealerCard, setRevealDealerCard] = useState(false)

  useEffect(() => {
    if (playerStanding || winner) {
      setRevealDealerCard(true)
    }
  }, [playerStanding, winner])

  useEffect(() => {
    if (acesToHandle.length > 0) {
      setIsAceDialogOpen(true)
    } else if (gameStarted && !winner) {
      dispatch(gameSlice.actions.DETERMINE_WINNER())
    }
  }, [acesToHandle, gameStarted, winner, dispatch])

  const handleHit = () => {
    dispatch(gameSlice.actions.PLAYER_HIT())
  }

  const handleStand = () => {
    dispatch(gameSlice.actions.SET_PLAYER_STANDING(true))
    dispatch(gameSlice.actions.DEALER_TURN(true))
    dispatch(gameSlice.actions.DETERMINE_WINNER())
  }

  const handleNewGame = () => {
    setIsBettingDialogOpen(true)
    setRevealDealerCard(false)
  }

  const handleAceDialogClose = (wants11: number) => {
    setIsAceDialogOpen(false)
    dispatch(gameSlice.actions.UPDATE_SCORE({ player: true, wants11 }))
  }

  const handleBettingDialogClose = () => {
    setIsBettingDialogOpen(false)
    dispatch(gameSlice.actions.START_GAME())
  }

  return (
    <Card className="w-full max-w-2xl p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">Blackjack</h1>
      <div className="flex justify-between">
        <div>Wallet: ${wallet}</div>
        <div>Bet: ${playerBet}</div>
      </div>
      <AnimatePresence>
        <DealerHand cards={dealerCards} score={dealerScore} revealHidden={revealDealerCard} />
        <PlayerHand cards={playerCards} score={playerScore} />
      </AnimatePresence>
      {gameStarted && !winner && (
        <div className="flex justify-center space-x-4">
          <Button onClick={handleHit}>Hit</Button>
          <Button onClick={handleStand}>Stand</Button>
        </div>
      )}
      {winner && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold mb-4">
            {winner === 'push' ? "It's a tie!" : `${winner} wins!`}
          </h2>
          <Button onClick={handleNewGame}>New Game</Button>
        </motion.div>
      )}
      <AceDialog isOpen={isAceDialogOpen} onClose={handleAceDialogClose} />
      <BettingDialog isOpen={isBettingDialogOpen} onClose={handleBettingDialogClose} />
    </Card>
  )
}