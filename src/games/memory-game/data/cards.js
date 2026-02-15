const themes = {
  animals: {
    name: 'Animals',
    pairs: [
      { id: 'dog', emoji: '🐶', label: 'Dog' },
      { id: 'cat', emoji: '🐱', label: 'Cat' },
      { id: 'fox', emoji: '🦊', label: 'Fox' },
      { id: 'bear', emoji: '🐻', label: 'Bear' },
      { id: 'panda', emoji: '🐼', label: 'Panda' },
      { id: 'koala', emoji: '🐨', label: 'Koala' },
      { id: 'tiger', emoji: '🐯', label: 'Tiger' },
      { id: 'lion', emoji: '🦁', label: 'Lion' },
      { id: 'monkey', emoji: '🐵', label: 'Monkey' },
      { id: 'rabbit', emoji: '🐰', label: 'Rabbit' },
    ],
  },
  food: {
    name: 'Food',
    pairs: [
      { id: 'pizza', emoji: '🍕', label: 'Pizza' },
      { id: 'burger', emoji: '🍔', label: 'Burger' },
      { id: 'donut', emoji: '🍩', label: 'Donut' },
      { id: 'ice-cream', emoji: '🍦', label: 'Ice Cream' },
      { id: 'watermelon', emoji: '🍉', label: 'Watermelon' },
      { id: 'cookie', emoji: '🍪', label: 'Cookie' },
      { id: 'cake', emoji: '🎂', label: 'Cake' },
      { id: 'apple', emoji: '🍎', label: 'Apple' },
      { id: 'taco', emoji: '🌮', label: 'Taco' },
      { id: 'sushi', emoji: '🍣', label: 'Sushi' },
    ],
  },
  space: {
    name: 'Space',
    pairs: [
      { id: 'rocket', emoji: '🚀', label: 'Rocket' },
      { id: 'star', emoji: '⭐', label: 'Star' },
      { id: 'moon', emoji: '🌙', label: 'Moon' },
      { id: 'sun', emoji: '☀️', label: 'Sun' },
      { id: 'planet', emoji: '🪐', label: 'Planet' },
      { id: 'alien', emoji: '👽', label: 'Alien' },
      { id: 'ufo', emoji: '🛸', label: 'UFO' },
      { id: 'comet', emoji: '☄️', label: 'Comet' },
      { id: 'satellite', emoji: '🛰️', label: 'Satellite' },
      { id: 'telescope', emoji: '🔭', label: 'Telescope' },
    ],
  },
}

export const difficulties = {
  easy: { label: 'Easy', pairs: 6, cols: 3, rows: 4 },
  medium: { label: 'Medium', pairs: 8, cols: 4, rows: 4 },
  hard: { label: 'Hard', pairs: 10, cols: 4, rows: 5 },
}

export function getCardsForGame(difficulty, themeId = null) {
  const themeKeys = Object.keys(themes)
  const selectedTheme = themeId || themeKeys[Math.floor(Math.random() * themeKeys.length)]
  const theme = themes[selectedTheme]
  const { pairs: pairCount } = difficulties[difficulty]

  const shuffledPairs = [...theme.pairs]
    .sort(() => Math.random() - 0.5)
    .slice(0, pairCount)

  const cards = shuffledPairs.flatMap((pair) => [
    { ...pair, uid: `${pair.id}-a` },
    { ...pair, uid: `${pair.id}-b` },
  ])

  // Shuffle cards
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]]
  }

  return { cards, themeName: theme.name }
}

export default themes
