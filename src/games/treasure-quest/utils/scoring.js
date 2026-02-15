const RUSH_THRESHOLD_MS = 5000

export function calculateStars(attempts) {
  if (attempts === 1) return 3
  if (attempts === 2) return 2
  return 1
}

export function checkIfRushing(planStartTime) {
  if (!planStartTime) return false
  const elapsed = Date.now() - planStartTime
  return elapsed < RUSH_THRESHOLD_MS
}

export function validatePlan(playerPlan, level) {
  const correctOrder = level.steps.map((s) => s.id)
  const results = []

  for (let i = 0; i < correctOrder.length; i++) {
    const expected = correctOrder[i]
    const actual = playerPlan[i]

    if (!actual) {
      results.push({
        stepId: expected,
        success: false,
        message: `Missing step: "${level.steps[i].text}"`,
      })
      break
    }

    if (actual === expected) {
      results.push({
        stepId: actual,
        success: true,
        message: `${level.steps.find((s) => s.id === actual).text} — Success!`,
      })
    } else {
      const actualStep = level.steps.find((s) => s.id === actual)
      const expectedStep = level.steps.find((s) => s.id === expected)
      results.push({
        stepId: actual,
        success: false,
        message: `You tried to "${actualStep?.text}" but you needed to "${expectedStep.text}" first.`,
      })
      break
    }
  }

  if (playerPlan.length < correctOrder.length && results.every((r) => r.success)) {
    const missingIdx = playerPlan.length
    results.push({
      stepId: correctOrder[missingIdx],
      success: false,
      message: `You forgot a step: "${level.steps[missingIdx].text}"`,
    })
  }

  const allCorrect =
    playerPlan.length === correctOrder.length &&
    results.length === correctOrder.length &&
    results.every((r) => r.success)

  return { results, allCorrect }
}

export function checkBadges(levelId, attempts, usedHint, planTimeMs) {
  const badges = []

  if (attempts === 1) {
    badges.push({ id: 'first-try', name: 'First Try!', icon: 'target' })
  }

  if (attempts > 1) {
    badges.push({ id: 'resilient', name: 'Resilient Thinker', icon: 'brain' })
  }

  if (planTimeMs > 15000) {
    badges.push({ id: 'patient', name: 'Patient Planner', icon: 'hourglass' })
  }

  return badges
}
