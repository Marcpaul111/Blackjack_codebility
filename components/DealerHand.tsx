import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'

interface DealerHandProps {
  cards: { suit: string; face: string | number; image: string }[]
  score: number
  revealHidden: boolean
}

export default function DealerHand({ cards, score, revealHidden }: DealerHandProps) {
  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold">Dealer's Hand (Score: {revealHidden ? score : '?'})</h2>
      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {cards.map((card, index) => (
            <motion.div
              key={`${card.suit}-${card.face}-${index}`}
              initial={{ opacity: 0, scale: 0.8, rotateY: index === 0 ? 180 : 0 }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                rotateY: (index === 0 && !revealHidden) ? 180 : 0 
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="w-24 h-36 flex items-center justify-center p-1 shrink-0">
                <AnimatePresence>
                  {(index !== 0 || revealHidden) ? (
                    <motion.div
                      key="front"
                      initial={{ opacity: 0, rotateY: 180 }}
                      animate={{ opacity: 1, rotateY: 0 }}
                      exit={{ opacity: 0, rotateY: 180 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Image
                        src={card.image}
                        alt={`${card.face} of ${card.suit}`}
                        width={90}
                        height={98}
                        className="object-contain"
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="back"
                      initial={{ opacity: 0, rotateY: 180 }}
                      animate={{ opacity: 1, rotateY: 0 }}
                      exit={{ opacity: 0, rotateY: 180 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Image
                        src="/assets/images/back_of_card.png"
                        alt="Card back"
                        width={90}
                        height={98}
                        className="object-contain"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}