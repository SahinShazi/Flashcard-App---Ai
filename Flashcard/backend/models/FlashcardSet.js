const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Question is required'],
    trim: true,
    maxlength: [1000, 'Question cannot exceed 1000 characters']
  },
  answer: {
    type: String,
    required: [true, 'Answer is required'],
    trim: true,
    maxlength: [2000, 'Answer cannot exceed 2000 characters']
  },
  isCorrect: {
    type: Boolean,
    default: null // null = not attempted, true = correct, false = incorrect
  },
  lastReviewed: {
    type: Date,
    default: null
  },
  reviewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const flashcardSetSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Set title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    default: ''
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  cards: [flashcardSchema],
  isPublic: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [20, 'Tag cannot exceed 20 characters']
  }],
  category: {
    type: String,
    trim: true,
    maxlength: [50, 'Category cannot exceed 50 characters'],
    default: 'General'
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  averageScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.cardCount = ret.cards ? ret.cards.length : 0;
      return ret;
    }
  }
});

// Virtual for card count
flashcardSetSchema.virtual('cardCount').get(function() {
  return this.cards ? this.cards.length : 0;
});

// Instance method to add a card
flashcardSetSchema.methods.addCard = function(question, answer) {
  this.cards.push({ question, answer });
  return this.save();
};

// Instance method to remove a card
flashcardSetSchema.methods.removeCard = function(cardId) {
  this.cards = this.cards.filter(card => card._id.toString() !== cardId.toString());
  return this.save();
};

// Instance method to update a card
flashcardSetSchema.methods.updateCard = function(cardId, question, answer) {
  const card = this.cards.id(cardId);
  if (card) {
    card.question = question;
    card.answer = answer;
    return this.save();
  }
  throw new Error('Card not found');
};

// Instance method to mark card as reviewed
flashcardSetSchema.methods.markCardReviewed = function(cardId, isCorrect) {
  const card = this.cards.id(cardId);
  if (card) {
    card.isCorrect = isCorrect;
    card.lastReviewed = new Date();
    card.reviewCount += 1;
    
    // Update set statistics
    this.totalReviews += 1;
    this.updateAverageScore();
    
    return this.save();
  }
  throw new Error('Card not found');
};

// Instance method to update average score
flashcardSetSchema.methods.updateAverageScore = function() {
  const reviewedCards = this.cards.filter(card => card.isCorrect !== null);
  if (reviewedCards.length > 0) {
    const correctCount = reviewedCards.filter(card => card.isCorrect === true).length;
    this.averageScore = Math.round((correctCount / reviewedCards.length) * 100);
  }
};

// Static method to find sets by user
flashcardSetSchema.statics.findByUser = function(userId) {
  return this.find({ user: userId }).sort({ updatedAt: -1 });
};

// Static method to find public sets
flashcardSetSchema.statics.findPublic = function() {
  return this.find({ isPublic: true }).populate('user', 'username').sort({ createdAt: -1 });
};

// Index for better query performance
flashcardSetSchema.index({ user: 1, createdAt: -1 });
flashcardSetSchema.index({ isPublic: 1, createdAt: -1 });
flashcardSetSchema.index({ tags: 1 });

module.exports = mongoose.model('FlashcardSet', flashcardSetSchema); 