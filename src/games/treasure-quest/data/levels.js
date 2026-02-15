const levels = [
  {
    id: 1,
    title: 'Open the Locked Treasure Chest',
    description: 'You found a treasure chest deep in the jungle! But it\'s locked tight. Figure out the right steps to open it.',
    steps: [
      { id: 'find-key', text: 'Find the key', order: 1 },
      { id: 'insert-key', text: 'Insert key into lock', order: 2 },
      { id: 'turn-key', text: 'Turn the key', order: 3 },
      { id: 'open-chest', text: 'Open the chest', order: 4 },
    ],
    distractors: [],
    treasure: { name: 'Golden Coin', icon: 'coin' },
    gear: { name: 'Compass', icon: 'compass' },
    storyPiece: 'Inside the chest, you find a torn piece of parchment. It looks like part of an ancient map...',
    hint: 'Think about what you need before you can use the lock.',
  },
  {
    id: 2,
    title: 'Cross the River',
    description: 'A wide river blocks your path! The treasure is on the other side. How will you get across?',
    steps: [
      { id: 'find-wood', text: 'Find sturdy wood', order: 1 },
      { id: 'build-raft', text: 'Build a raft', order: 2 },
      { id: 'push-raft', text: 'Push raft into water', order: 3 },
      { id: 'paddle-across', text: 'Paddle across the river', order: 4 },
    ],
    distractors: [],
    treasure: { name: 'Ruby Gem', icon: 'gem' },
    gear: { name: 'Map', icon: 'map' },
    storyPiece: 'On the far bank, you discover another map piece hidden under a rock. The pieces are starting to connect...',
    hint: 'You can\'t cross without something to float on. What do you need to build first?',
  },
  {
    id: 3,
    title: 'Light the Dark Cave',
    description: 'The map leads to a dark cave entrance. You can\'t see anything inside! You need to make light.',
    steps: [
      { id: 'find-sticks', text: 'Find dry sticks', order: 1 },
      { id: 'find-flint', text: 'Find a flint stone', order: 2 },
      { id: 'strike-flint', text: 'Strike flint to make a spark', order: 3 },
      { id: 'light-torch', text: 'Light the torch', order: 4 },
    ],
    distractors: [],
    treasure: { name: 'Emerald Crystal', icon: 'crystal' },
    gear: { name: 'Torch', icon: 'torch' },
    storyPiece: 'Deep in the cave, the torch reveals ancient drawings on the wall — and the third piece of the map!',
    hint: 'To make fire, you need fuel AND something to create a spark.',
  },
]

export default levels

export function getLevelById(id) {
  return levels.find((l) => l.id === id)
}

export function getNextLevelId(currentId) {
  const idx = levels.findIndex((l) => l.id === currentId)
  if (idx >= 0 && idx < levels.length - 1) {
    return levels[idx + 1].id
  }
  return null
}
