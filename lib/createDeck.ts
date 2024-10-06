const suits = ['hearts', 'diamonds', 'clubs', 'spades']
const faces = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace']

function createDeck() {
  const deck = suits.flatMap(suit =>
    faces.map(face => ({
      suit,
      face,
      image: `/assets/images/${face}_of_${suit}.png`
    }))
  )

  // Fisher-Yates shuffle algorithm
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck
}

export default createDeck