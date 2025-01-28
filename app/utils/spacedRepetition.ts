export enum Grade {
  WRONG = 0,
  HARD = 3,
  GOOD = 4,
  EASY = 5
}

export function calculateNextReview (card, grade) {
  let newEaseFactor = card.easeFactor
  let newInterval = card.interval
  let newRepetitions = card.repetitions

  if (grade >= Grade.HARD) {
    newEaseFactor = Math.max(
      1.3,
      card.easeFactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02))
    )
    newInterval =
      newRepetitions === 0
        ? 1
        : newRepetitions === 1
        ? 6
        : Math.round(card.interval * card.easeFactor)
    newRepetitions++
  } else {
    newRepetitions = 0
    newInterval = 1
    newEaseFactor = Math.max(1.3, card.easeFactor - 0.2)
  }

  const nextReview = new Date()
  nextReview.setDate(nextReview.getDate() + newInterval)

  return {
    ...card,
    easeFactor: newEaseFactor,
    interval: newInterval,
    repetitions: newRepetitions,
    lastReviewed: new Date(),
    nextReview
  }
}

export function createNewFlashcard (front, back) {
  return {
    id: crypto.randomUUID(),
    front,
    back,
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    lastReviewed: new Date(),
    nextReview: new Date()
  }
}
