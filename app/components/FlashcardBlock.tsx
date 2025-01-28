import React, { useState } from 'react'
import { motion } from 'motion/react'
import {
  Grade,
  calculateNextReview,
  createNewFlashcard
} from '../utils/spacedRepetition'

interface Flashcard {
  id: string
  front: string
  back: string
  lastReviewed?: Date
  nextReview?: Date
  easeFactor: number
  interval: number
  repetitions: number
}

interface FlashcardBlockProps {
  cards: Flashcard[]
  onUpdate: (cards: Flashcard[]) => void
}

export function FlashcardBlock ({ cards, onUpdate }: FlashcardBlockProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [viewMode, setViewMode] = useState<'review' | 'list'>('review')
  const [showAllCards, setShowAllCards] = useState(false)

  const dueCards = cards.filter(
    card => !card.nextReview || card.nextReview <= new Date()
  )
  const cardsToReview = showAllCards ? cards : dueCards

  const handleGrade = (grade: Grade) => {
    const updatedCards = [...cards]
    const updatedCard = calculateNextReview(cards[currentIndex], grade)
    updatedCards[currentIndex] = updatedCard
    onUpdate(updatedCards)

    setIsFlipped(false)
    if (currentIndex < dueCards.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setCurrentIndex(0)
    }
  }

  const handleAddCard = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const front = formData.get('front') as string
    const back = formData.get('back') as string

    const newCard = createNewFlashcard(front, back)
    onUpdate([...cards, newCard])
    setIsAdding(false)
  }

  const handleDeleteCard = (cardId: string) => {
    const updatedCards = cards.filter(card => card.id !== cardId)
    onUpdate(updatedCards)
  }

  if (isAdding) {
    return (
      <div className='card-container'>
        <form onSubmit={handleAddCard} className='flex flex-col gap-4'>
          <div className='space-y-1'>
            <label className='form-label'>
              Front of card
              <input
                name='front'
                className='form-input'
                placeholder='Enter question or prompt'
              />
            </label>
          </div>
          <div className='space-y-1'>
            <label className='form-label'>
              Back of card
              <textarea
                name='back'
                className='form-input'
                placeholder='Enter answer'
                rows={3}
              />
            </label>
          </div>
          <div className='flex justify-end gap-3'>
            <button
              type='button'
              onClick={() => setIsAdding(false)}
              className='rounded-md px-3 py-1.5 text-sm font-medium transition-colors bg-zinc-200 text-gray-900 hover:bg-zinc-300 active:bg-zinc-400'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='rounded-md px-3 py-1.5 text-sm font-medium transition-colors bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700'
            >
              Add Card
            </button>
          </div>
        </form>
      </div>
    )
  }

  if (viewMode === 'list') {
    return (
      <div className='card-container'>
        <div className='card-header'>
          <div className='header-group'>
            <button
              onClick={() => setViewMode('review')}
              className='rounded-md px-3 py-1.5 text-sm font-medium transition-colors bg-zinc-200 text-gray-900 hover:bg-zinc-300 active:bg-zinc-400'
            >
              Review Mode
            </button>
            {dueCards.length > 0 && (
              <span className='rounded-full bg-blue-500/20 px-2 py-1 text-sm font-medium text-blue-300'>
                {dueCards.length} due
              </span>
            )}
          </div>
          <button
            onClick={() => setIsAdding(true)}
            className='rounded-md px-3 py-1.5 text-sm font-medium transition-colors bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700'
          >
            Add Card
          </button>
        </div>
        <div className='space-y-3'>
          {cards.map(card => (
            <div key={card.id} className='list-item'>
              <div className='mb-2 flex items-start justify-between gap-4'>
                <div className='flex-1'>
                  <p className='font-medium text-white'>{card.front}</p>
                  <p className='mt-1 text-sm text-zinc-400'>{card.back}</p>
                </div>
                <button
                  onClick={() => handleDeleteCard(card.id)}
                  className='rounded-md p-1 text-zinc-400 hover:bg-red-500/10 hover:text-red-400'
                >
                  <svg
                    className='h-5 w-5'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                    />
                  </svg>
                </button>
              </div>
              <div className='text-xs text-zinc-500'>
                Next review:{' '}
                {card.nextReview
                  ? new Date(card.nextReview).toLocaleDateString()
                  : 'Due now'}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (cardsToReview.length === 0) {
    return (
      <div className='card-container'>
        <div className='card-header'>
          <div className='header-group'>
            <button
              onClick={() => setViewMode('list')}
              className='rounded-md px-3 py-1.5 text-sm font-medium transition-colors bg-zinc-200 text-gray-900 hover:bg-zinc-300 active:bg-zinc-400'
            >
              List View
            </button>
            <button
              onClick={() => setShowAllCards(true)}
              className={`${'rounded-md px-3 py-1.5 text-sm font-medium transition-colors bg-zinc-200 text-gray-900 hover:bg-zinc-300 active:bg-zinc-400'} ${
                showAllCards ? 'bg-blue-500 text-white' : ''
              }`}
            >
              Review All
            </button>
          </div>
          <button
            onClick={() => setIsAdding(true)}
            className='rounded-md px-3 py-1.5 text-sm font-medium transition-colors bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700'
          >
            Add Card
          </button>
        </div>
        <div className='text-center text-zinc-400'>
          <p className='mb-4'>All caught up! No cards due for review.</p>
          <p className='text-sm'>
            {cards.length === 0
              ? 'Add some cards to get started'
              : 'Click "Review All" to practice anyway'}
          </p>
        </div>
      </div>
    )
  }

  const currentCard = cardsToReview[currentIndex]

  return (
    <div className='card-container'>
      <div className='card-header'>
        <div className='header-group'>
          <button
            onClick={() => setViewMode('list')}
            className='rounded-md px-3 py-1.5 text-sm font-medium transition-colors bg-zinc-200 text-gray-900 hover:bg-zinc-300 active:bg-zinc-400'
          >
            List View
          </button>
          <button
            onClick={() => setShowAllCards(!showAllCards)}
            className={`${'rounded-md px-3 py-1.5 text-sm font-medium transition-colors bg-zinc-200 text-gray-900 hover:bg-zinc-300 active:bg-zinc-400'} ${
              showAllCards ? 'bg-blue-500 text-white' : ''
            }`}
          >
            {showAllCards ? 'Due Only' : 'Review All'}
          </button>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className='rounded-md px-3 py-1.5 text-sm font-medium transition-colors bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700'
        >
          Add Card
        </button>
      </div>

      <motion.div
        className='flashcard'
        onClick={() => setIsFlipped(!isFlipped)}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div
          className='flashcard-content'
          style={{
            transform: isFlipped ? 'rotateY(180deg)' : 'none',
            backfaceVisibility: 'hidden'
          }}
        >
          {isFlipped ? currentCard.back : currentCard.front}
        </div>
      </motion.div>

      {isFlipped && (
        <div className='btn-group'>
          <button
            onClick={() => handleGrade(Grade.WRONG)}
            className='btn-grade-wrong'
          >
            Wrong
          </button>
          <button
            onClick={() => handleGrade(Grade.HARD)}
            className='btn-grade-hard'
          >
            Hard
          </button>
          <button
            onClick={() => handleGrade(Grade.GOOD)}
            className='btn-grade-good'
          >
            Good
          </button>
          <button
            onClick={() => handleGrade(Grade.EASY)}
            className='btn-grade-easy'
          >
            Easy
          </button>
        </div>
      )}

      <div className='text-center text-sm text-zinc-400'>
        Card {currentIndex + 1} of {cardsToReview.length}
        {!showAllCards && cards.length > dueCards.length && (
          <span className='ml-2'>
            ({cards.length - dueCards.length} more available)
          </span>
        )}
      </div>
    </div>
  )
}
