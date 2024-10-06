'use client'

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { gameSlice } from '@/store/gameSlice'
import { RootState } from '@/store/store'

interface BettingDialogProps {
  isOpen: boolean
  onClose: () => void
}

export default function BettingDialog({ isOpen, onClose }: BettingDialogProps) {
  const dispatch = useDispatch()
  const { wallet } = useSelector((state: RootState) => state.game)
  const [selectedBet, setSelectedBet] = useState(10)

  const handleBet = (amount: number) => {
    if (wallet >= amount) {
      setSelectedBet(amount)
    }
  }

  const handleStartGame = () => {
    dispatch(gameSlice.actions.SET_BET(selectedBet))
    dispatch(gameSlice.actions.START_GAME())
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Place Your Bet</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p>Select your bet amount:</p>
          <div className="flex justify-center space-x-4">
            <Button
              onClick={() => handleBet(10)}
              variant={selectedBet === 10 ? 'default' : 'outline'}
              disabled={wallet < 10}
            >
              $10
            </Button>
            <Button
              onClick={() => handleBet(50)}
              variant={selectedBet === 50 ? 'default' : 'outline'}
              disabled={wallet < 50}
            >
              $50
            </Button>
            <Button
              onClick={() => handleBet(100)}
              variant={selectedBet === 100 ? 'default' : 'outline'}
              disabled={wallet < 100}
            >
              $100
            </Button>
          </div>
          <Button onClick={handleStartGame}>Start Game</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}