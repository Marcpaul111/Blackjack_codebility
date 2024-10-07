import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'

interface PlayerHandProps {
  cards: { suit: string; face: string | number; image: string }[]
  score: number
}

export default function PlayerHand({ cards, score }: PlayerHandProps) {
  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold">Your Hand (Score: {score})</h2>
      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {cards.map((card, index) => (
            <motion.div
              key={`${card.suit}-${card.face}-${index}`}
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -50 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="w-24 h-36 flex items-center justify-center p-1 shrink-0">
                <Image
                  src={card.image}
                  alt={`${card.face} of ${card.suit}`}
                  width={90}
                  height={98}
                  className="object-contain"
                />
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}