const express = require('express');
const FlashcardSet = require('../models/FlashcardSet');
const { authenticateToken, checkOwnership } = require('../middleware/auth');
const { 
  validateFlashcardSet, 
  validateFlashcard, 
  validateFlashcardUpdate,
  validateFlashcardSetUpdate,
  validateReview
} = require('../middleware/validation');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

/**
 * @route   GET /api/sets
 * @desc    Get all flashcard sets for the authenticated user
 * @access  Private
 */
router.get('/', async (req, res) => {
  try {
    const sets = await FlashcardSet.findByUser(req.user._id);
    
    res.json({
      sets: sets.map(set => ({
        id: set._id,
        title: set.title,
        description: set.description,
        cardCount: set.cards.length,
        category: set.category,
        tags: set.tags,
        isPublic: set.isPublic,
        totalReviews: set.totalReviews,
        averageScore: set.averageScore,
        createdAt: set.createdAt,
        updatedAt: set.updatedAt
      }))
    });
  } catch (error) {
    console.error('Get sets error:', error);
    res.status(500).json({
      error: 'Failed to get sets',
      message: 'Failed to retrieve flashcard sets'
    });
  }
});

/**
 * @route   POST /api/sets
 * @desc    Create a new flashcard set
 * @access  Private
 */
router.post('/', validateFlashcardSet, async (req, res) => {
  try {
    const { title, description, category, tags, isPublic, cards } = req.body;

    const flashcardSet = new FlashcardSet({
      title,
      description: description || '',
      category: category || 'General',
      tags: tags || [],
      isPublic: isPublic || false,
      user: req.user._id,
      cards: cards || []
    });

    await flashcardSet.save();

    res.status(201).json({
      message: 'Flashcard set created successfully',
      set: {
        id: flashcardSet._id,
        title: flashcardSet.title,
        description: flashcardSet.description,
        cardCount: flashcardSet.cards.length,
        category: flashcardSet.category,
        tags: flashcardSet.tags,
        isPublic: flashcardSet.isPublic,
        createdAt: flashcardSet.createdAt
      }
    });
  } catch (error) {
    console.error('Create set error:', error);
    res.status(500).json({
      error: 'Failed to create set',
      message: 'Failed to create flashcard set'
    });
  }
});

/**
 * @route   GET /api/sets/:id
 * @desc    Get a specific flashcard set with all cards
 * @access  Private
 */
router.get('/:id', checkOwnership(FlashcardSet), async (req, res) => {
  try {
    const set = req.resource;
    
    res.json({
      set: {
        id: set._id,
        title: set.title,
        description: set.description,
        category: set.category,
        tags: set.tags,
        isPublic: set.isPublic,
        totalReviews: set.totalReviews,
        averageScore: set.averageScore,
        cards: set.cards.map(card => ({
          id: card._id,
          question: card.question,
          answer: card.answer,
          isCorrect: card.isCorrect,
          lastReviewed: card.lastReviewed,
          reviewCount: card.reviewCount
        })),
        createdAt: set.createdAt,
        updatedAt: set.updatedAt
      }
    });
  } catch (error) {
    console.error('Get set error:', error);
    res.status(500).json({
      error: 'Failed to get set',
      message: 'Failed to retrieve flashcard set'
    });
  }
});

/**
 * @route   PUT /api/sets/:id
 * @desc    Update a flashcard set
 * @access  Private
 */
router.put('/:id', checkOwnership(FlashcardSet), validateFlashcardSetUpdate, async (req, res) => {
  try {
    const set = req.resource;
    const { title, description, category, tags, isPublic } = req.body;

    // Update fields if provided
    if (title !== undefined) set.title = title;
    if (description !== undefined) set.description = description;
    if (category !== undefined) set.category = category;
    if (tags !== undefined) set.tags = tags;
    if (isPublic !== undefined) set.isPublic = isPublic;

    await set.save();

    res.json({
      message: 'Flashcard set updated successfully',
      set: {
        id: set._id,
        title: set.title,
        description: set.description,
        cardCount: set.cards.length,
        category: set.category,
        tags: set.tags,
        isPublic: set.isPublic,
        updatedAt: set.updatedAt
      }
    });
  } catch (error) {
    console.error('Update set error:', error);
    res.status(500).json({
      error: 'Failed to update set',
      message: 'Failed to update flashcard set'
    });
  }
});

/**
 * @route   DELETE /api/sets/:id
 * @desc    Delete a flashcard set
 * @access  Private
 */
router.delete('/:id', checkOwnership(FlashcardSet), async (req, res) => {
  try {
    const set = req.resource;
    await set.remove();

    res.json({
      message: 'Flashcard set deleted successfully'
    });
  } catch (error) {
    console.error('Delete set error:', error);
    res.status(500).json({
      error: 'Failed to delete set',
      message: 'Failed to delete flashcard set'
    });
  }
});

/**
 * @route   POST /api/sets/:id/cards
 * @desc    Add a card to a flashcard set
 * @access  Private
 */
router.post('/:id/cards', checkOwnership(FlashcardSet), validateFlashcard, async (req, res) => {
  try {
    const set = req.resource;
    const { question, answer } = req.body;

    await set.addCard(question, answer);

    res.status(201).json({
      message: 'Card added successfully',
      card: {
        id: set.cards[set.cards.length - 1]._id,
        question,
        answer
      }
    });
  } catch (error) {
    console.error('Add card error:', error);
    res.status(500).json({
      error: 'Failed to add card',
      message: 'Failed to add card to flashcard set'
    });
  }
});

/**
 * @route   PUT /api/sets/:id/cards/:cardId
 * @desc    Update a card in a flashcard set
 * @access  Private
 */
router.put('/:id/cards/:cardId', checkOwnership(FlashcardSet), validateFlashcardUpdate, async (req, res) => {
  try {
    const set = req.resource;
    const { cardId } = req.params;
    const { question, answer } = req.body;

    await set.updateCard(cardId, question, answer);

    res.json({
      message: 'Card updated successfully',
      card: {
        id: cardId,
        question,
        answer
      }
    });
  } catch (error) {
    console.error('Update card error:', error);
    if (error.message === 'Card not found') {
      return res.status(404).json({
        error: 'Card not found',
        message: 'The specified card does not exist'
      });
    }
    res.status(500).json({
      error: 'Failed to update card',
      message: 'Failed to update card in flashcard set'
    });
  }
});

/**
 * @route   DELETE /api/sets/:id/cards/:cardId
 * @desc    Delete a card from a flashcard set
 * @access  Private
 */
router.delete('/:id/cards/:cardId', checkOwnership(FlashcardSet), async (req, res) => {
  try {
    const set = req.resource;
    const { cardId } = req.params;

    await set.removeCard(cardId);

    res.json({
      message: 'Card deleted successfully'
    });
  } catch (error) {
    console.error('Delete card error:', error);
    res.status(500).json({
      error: 'Failed to delete card',
      message: 'Failed to delete card from flashcard set'
    });
  }
});

/**
 * @route   POST /api/sets/:id/cards/:cardId/review
 * @desc    Mark a card as reviewed (correct/incorrect)
 * @access  Private
 */
router.post('/:id/cards/:cardId/review', checkOwnership(FlashcardSet), validateReview, async (req, res) => {
  try {
    const set = req.resource;
    const { cardId } = req.params;
    const { isCorrect } = req.body;

    await set.markCardReviewed(cardId, isCorrect);

    res.json({
      message: 'Card review recorded successfully',
      review: {
        cardId,
        isCorrect,
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error('Review card error:', error);
    if (error.message === 'Card not found') {
      return res.status(404).json({
        error: 'Card not found',
        message: 'The specified card does not exist'
      });
    }
    res.status(500).json({
      error: 'Failed to record review',
      message: 'Failed to record card review'
    });
  }
});

/**
 * @route   GET /api/sets/public
 * @desc    Get public flashcard sets
 * @access  Public (optional auth)
 */
router.get('/public', async (req, res) => {
  try {
    const sets = await FlashcardSet.findPublic();
    
    res.json({
      sets: sets.map(set => ({
        id: set._id,
        title: set.title,
        description: set.description,
        cardCount: set.cards.length,
        category: set.category,
        tags: set.tags,
        user: set.user.username,
        createdAt: set.createdAt
      }))
    });
  } catch (error) {
    console.error('Get public sets error:', error);
    res.status(500).json({
      error: 'Failed to get public sets',
      message: 'Failed to retrieve public flashcard sets'
    });
  }
});

module.exports = router; 