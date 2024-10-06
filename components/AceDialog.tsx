'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface AceDialogProps {
  isOpen: boolean
  onClose: (wants11: number) => void
}

export default function AceDialog({ isOpen, onClose }: AceDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={() => onClose(1)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>You drew an Ace!</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p>Choose the value for your Ace:</p>
          <div className="flex justify-center space-x-4">
            <Button onClick={() => onClose(1)}>
              1
            </Button>
            <Button onClick={() => onClose(11)}>
              11
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}