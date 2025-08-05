import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFlashcard } from '../context/FlashcardContext';
import { 
  ArrowLeft, 
  ArrowRight, 
  RotateCcw, 
  Check, 
  X,
  BarChart3,
  Play,
  Pause
} from 'lucide-react';
import Confetti from 'react-confetti';

const PracticeSet = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentSet, loading, fetchSet, reviewCard } = useFlashcard();
  
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [practiceMode, setPracticeMode] = useState('normal'); // normal, review
  const [isPaused, setIsPaused] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    fetchSet(id);
  }, [id, fetchSet]);

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCardFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNextCard = () => {
    if (currentCardIndex < currentSet.cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleReview = async (isCorrect) => {
    if (currentSet && currentSet.cards[currentCardIndex]) {
      await reviewCard(currentSet.id, currentSet.cards[currentCardIndex].id, isCorrect);
    }
  };

  const handleRestart = () => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setShowResults(false);
  };

  const getProgressPercentage = () => {
    if (!currentSet || currentSet.cards.length === 0) return 0;
    return ((currentCardIndex + 1) / currentSet.cards.length) * 100;
  };

  const getReviewedCards = () => {
    if (!currentSet) return 0;
    return currentSet.cards.filter(card => card.isCorrect !== null).length;
  };

  const getCorrectAnswers = () => {
    if (!currentSet) return 0;
    return currentSet.cards.filter(card => card.isCorrect === true).length;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!currentSet) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Set not found</h2>
        <button
          onClick={() => navigate('/dashboard')}
          className="btn btn-primary"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const currentCard = currentSet.cards[currentCardIndex];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="btn btn-secondary flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="btn btn-secondary flex items-center space-x-2"
            >
              {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              <span>{isPaused ? 'Resume' : 'Pause'}</span>
            </button>
            
            <button
              onClick={handleRestart}
              className="btn btn-secondary flex items-center space-x-2"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Restart</span>
            </button>
          </div>
        </div>
        
        <div className="mt-4">
          <h1 className="text-3xl font-bold text-gray-900">{currentSet.title}</h1>
          {currentSet.description && (
            <p className="text-gray-600 mt-2">{currentSet.description}</p>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Progress: {currentCardIndex + 1} of {currentSet.cards.length}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round(getProgressPercentage())}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="card p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <BarChart3 className="h-5 w-5 text-primary-600" />
          </div>
          <p className="text-sm text-gray-600">Reviewed</p>
          <p className="text-2xl font-bold text-gray-900">{getReviewedCards()}</p>
        </div>
        
        <div className="card p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Check className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-sm text-gray-600">Correct</p>
          <p className="text-2xl font-bold text-gray-900">{getCorrectAnswers()}</p>
        </div>
        
        <div className="card p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <X className="h-5 w-5 text-red-600" />
          </div>
          <p className="text-sm text-gray-600">Incorrect</p>
          <p className="text-2xl font-bold text-gray-900">
            {getReviewedCards() - getCorrectAnswers()}
          </p>
        </div>
      </div>

      {/* Flashcard */}
      <div className="mb-8">
        <div 
          className={`flashcard mx-auto ${isFlipped ? 'animate-flip' : ''}`}
          onClick={handleCardFlip}
        >
          <div className="flashcard-front">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-4">Question</p>
              <p className="text-xl font-semibold text-gray-900 leading-relaxed">
                {currentCard.question}
              </p>
              <p className="text-sm text-gray-500 mt-6">Click to reveal answer</p>
            </div>
          </div>
          <div className="flashcard-back">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-4">Answer</p>
              <p className="text-xl font-semibold text-gray-900 leading-relaxed">
                {currentCard.answer}
              </p>
              <p className="text-sm text-gray-500 mt-6">Click to hide answer</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation and Review */}
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
        <div className="flex space-x-4">
          <button
            onClick={handlePrevCard}
            disabled={currentCardIndex === 0}
            className="btn btn-secondary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Previous</span>
          </button>
          
          <button
            onClick={handleNextCard}
            disabled={currentCardIndex === currentSet.cards.length - 1}
            className="btn btn-secondary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Next</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {isFlipped && (
          <div className="flex space-x-4">
            <button
              onClick={() => handleReview(false)}
              className="btn btn-danger flex items-center space-x-2"
            >
              <X className="h-4 w-4" />
              <span>Incorrect</span>
            </button>
            
            <button
              onClick={() => handleReview(true)}
              className="btn btn-success flex items-center space-x-2"
            >
              <Check className="h-4 w-4" />
              <span>Correct</span>
            </button>
          </div>
        )}
      </div>

      {/* Completion Celebration */}
      {currentCardIndex === currentSet.cards.length - 1 && getReviewedCards() === currentSet.cards.length && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              🎉 Practice Complete!
            </h2>
            <p className="text-gray-600 mb-6">
              You've completed all cards in this set. Great job!
            </p>
            <div className="mb-6">
              <p className="text-lg font-semibold text-gray-900">
                Score: {getCorrectAnswers()}/{currentSet.cards.length}
              </p>
              <p className="text-sm text-gray-500">
                {Math.round((getCorrectAnswers() / currentSet.cards.length) * 100)}% accuracy
              </p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleRestart}
                className="btn btn-primary flex-1"
              >
                Practice Again
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="btn btn-secondary flex-1"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
          <Confetti
            width={windowDimensions.width}
            height={windowDimensions.height}
            recycle={false}
            numberOfPieces={200}
          />
        </div>
      )}
    </div>
  );
};

export default PracticeSet; 