export const FOOD_ITEMS = [
  // Protein
  { id: 'egg', emoji: '\u{1F95A}', label: 'Egg', group: 'protein' },
  { id: 'chicken', emoji: '\u{1F357}', label: 'Chicken', group: 'protein' },
  { id: 'tuna', emoji: '\u{1F41F}', label: 'Tuna', group: 'protein' },
  { id: 'cheese', emoji: '\u{1F9C0}', label: 'Cheese', group: 'protein' },
  { id: 'nuts', emoji: '\u{1F95C}', label: 'Peanuts', group: 'protein' },
  // Grain
  { id: 'bread', emoji: '\u{1F35E}', label: 'Bread', group: 'grain' },
  { id: 'rice', emoji: '\u{1F35A}', label: 'Rice', group: 'grain' },
  { id: 'cracker', emoji: '\u{1F358}', label: 'Cracker', group: 'grain' },
  { id: 'pasta', emoji: '\u{1F35D}', label: 'Pasta', group: 'grain' },
  { id: 'pretzel', emoji: '\u{1F968}', label: 'Pretzel', group: 'grain' },
  // Fruit
  { id: 'apple', emoji: '\u{1F34E}', label: 'Apple', group: 'fruit' },
  { id: 'banana', emoji: '\u{1F34C}', label: 'Banana', group: 'fruit' },
  { id: 'grapes', emoji: '\u{1F347}', label: 'Grapes', group: 'fruit' },
  { id: 'strawberry', emoji: '\u{1F353}', label: 'Strawberry', group: 'fruit' },
  { id: 'orange', emoji: '\u{1F34A}', label: 'Orange', group: 'fruit' },
  // Vegetable
  { id: 'carrot', emoji: '\u{1F955}', label: 'Carrot', group: 'vegetable' },
  { id: 'broccoli', emoji: '\u{1F966}', label: 'Broccoli', group: 'vegetable' },
  { id: 'cucumber', emoji: '\u{1F952}', label: 'Cucumber', group: 'vegetable' },
  { id: 'corn', emoji: '\u{1F33D}', label: 'Corn', group: 'vegetable' },
  { id: 'tomato', emoji: '\u{1F345}', label: 'Tomato', group: 'vegetable' },
  // Drink
  { id: 'milk', emoji: '\u{1F95B}', label: 'Milk', group: 'drink' },
  { id: 'juice', emoji: '\u{1F9C3}', label: 'Juice', group: 'drink' },
  { id: 'water', emoji: '\u{1F4A7}', label: 'Water', group: 'drink' },
  { id: 'smoothie', emoji: '\u{1F964}', label: 'Smoothie', group: 'drink' },
]

export const GROUPS = [
  { id: 'protein', label: 'Protein', color: '#f97316' },
  { id: 'grain', label: 'Grain', color: '#eab308' },
  { id: 'fruit', label: 'Fruit', color: '#ec4899' },
  { id: 'vegetable', label: 'Veggie', color: '#22c55e' },
  { id: 'drink', label: 'Drink', color: '#3b82f6' },
]

export const CUSTOMER_EMOJIS = [
  '\u{1F466}', '\u{1F467}', '\u{1F9D1}', '\u{1F469}', '\u{1F468}',
  '\u{1F475}', '\u{1F474}', '\u{1F47D}', '\u{1F916}', '\u{1F43B}',
]

export const DIFFICULTIES = {
  easy: {
    orders: 5,
    itemsPerOrder: 3,
    orderTime: 20,
    lives: 3,
    paletteSize: 12,
  },
  medium: {
    orders: 8,
    itemsPerOrder: 4,
    orderTime: 15,
    lives: 3,
    paletteSize: 18,
  },
  hard: {
    orders: 12,
    itemsPerOrder: 5,
    orderTime: 10,
    lives: 2,
    paletteSize: 24,
  },
}

export const STAR_THRESHOLDS = {
  easy: { three: 130, two: 80 },
  medium: { three: 280, two: 180 },
  hard: { three: 600, two: 400 },
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function generateOrders(difficulty) {
  const config = DIFFICULTIES[difficulty]
  const groupIds = GROUPS.map((g) => g.id)
  const itemsByGroup = {}
  for (const g of groupIds) {
    itemsByGroup[g] = FOOD_ITEMS.filter((f) => f.group === g)
  }

  const orders = []
  const usedCombos = new Set()

  for (let i = 0; i < config.orders; i++) {
    let items
    let comboKey
    let attempts = 0

    do {
      const selectedGroups = shuffle(groupIds).slice(0, config.itemsPerOrder)
      items = selectedGroups.map((g) => {
        const groupItems = itemsByGroup[g]
        return groupItems[Math.floor(Math.random() * groupItems.length)]
      })
      comboKey = items
        .map((it) => it.id)
        .sort()
        .join(',')
      attempts++
    } while (usedCombos.has(comboKey) && attempts < 50)

    usedCombos.add(comboKey)

    orders.push({
      id: `order-${i}`,
      items,
      customerEmoji: CUSTOMER_EMOJIS[i % CUSTOMER_EMOJIS.length],
    })
  }

  return orders
}

export function getPalette(difficulty) {
  const config = DIFFICULTIES[difficulty]
  return FOOD_ITEMS.slice(0, config.paletteSize)
}
