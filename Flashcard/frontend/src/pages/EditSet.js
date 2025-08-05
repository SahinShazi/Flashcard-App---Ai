import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFlashcard } from '../context/FlashcardContext';
import { Plus, X, Save, ArrowLeft, Edit, Trash2 } from 'lucide-react';

const EditSet = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentSet, loading, fetchSet, updateSet, addCard, updateCard, deleteCard } = useFlashcard();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'General',
    tags: [],
    isPublic: false
  });
  
  const [cards, setCards] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [editingCard, setEditingCard] = useState(null);

  useEffect(() => {
    fetchSet(id);
  }, [id, fetchSet]);

  useEffect(() => {
    if (currentSet) {
      setFormData({
        title: currentSet.title,
        description: currentSet.description || '',
        category: currentSet.category || 'General',
        tags: currentSet.tags || [],
        isPublic: currentSet.isPublic || false
      });
      setCards(currentSet.cards || []);
    }
  }, [currentSet]);

  const handleSetChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCardChange = (index, field, value) => {
    const newCards = [...cards];
    newCards[index][field] = value;
    setCards(newCards);
  };

  const addNewCard = () => {
    setCards([...cards, { question: '', answer: '' }]);
  };

  const removeCard = async (cardId, index) => {
    if (cardId) {
      // Delete from server if card exists
      await deleteCard(currentSet.id, cardId);
    } else {
      // Remove from local state if new card
      const newCards = cards.filter((_, i) => i !== index);
      setCards(newCards);
    }
  };

  const saveCard = async (index) => {
    const card = cards[index];
    if (!card.question.trim() || !card.answer.trim()) {
      return;
    }

    if (card.id) {
      // Update existing card
      await updateCard(currentSet.id, card.id, {
        question: card.question,
        answer: card.answer
      });
    } else {
      // Add new card
      await addCard(currentSet.id, {
        question: card.question,
        answer: card.answer
      });
    }
    setEditingCard(null);
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const result = await updateSet(currentSet.id, formData);
      if (result.success) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Update set error:', error);
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="btn btn-secondary flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </button>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Edit Flashcard Set</h1>
        <p className="text-gray-600 mt-2">Modify your flashcard set and cards</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Set Details */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Set Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Set Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleSetChange}
                className={`input ${errors.title ? 'border-red-500' : ''}`}
                placeholder="Enter set title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleSetChange}
                className="input"
              >
                <option value="General">General</option>
                <option value="Science">Science</option>
                <option value="History">History</option>
                <option value="Language">Language</option>
                <option value="Math">Math</option>
                <option value="Literature">Literature</option>
                <option value="Geography">Geography</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleSetChange}
              rows={3}
              className="input"
              placeholder="Describe your flashcard set (optional)"
            />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm flex items-center space-x-1"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 hover:text-primary-900"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="input flex-1"
                placeholder="Add a tag"
              />
              <button
                type="button"
                onClick={addTag}
                className="btn btn-secondary"
              >
                Add
              </button>
            </div>
          </div>

          <div className="mt-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isPublic"
                checked={formData.isPublic}
                onChange={handleSetChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">
                Make this set public (visible to other users)
              </span>
            </label>
          </div>
        </div>

        {/* Cards */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Flashcards</h2>
            <button
              type="button"
              onClick={addNewCard}
              className="btn btn-primary flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Card</span>
            </button>
          </div>

          <div className="space-y-6">
            {cards.map((card, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Card {index + 1}
                  </h3>
                  <div className="flex space-x-2">
                    {editingCard === index ? (
                      <button
                        type="button"
                        onClick={() => saveCard(index)}
                        className="btn btn-success btn-sm flex items-center space-x-1"
                      >
                        <Save className="h-4 w-4" />
                        <span>Save</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setEditingCard(index)}
                        className="btn btn-secondary btn-sm flex items-center space-x-1"
                      >
                        <Edit className="h-4 w-4" />
                        <span>Edit</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeCard(card.id, index)}
                      className="btn btn-danger btn-sm flex items-center space-x-1"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Question
                    </label>
                    <textarea
                      value={card.question}
                      onChange={(e) => handleCardChange(index, 'question', e.target.value)}
                      className="input"
                      rows={3}
                      placeholder="Enter the question"
                      disabled={editingCard !== index}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Answer
                    </label>
                    <textarea
                      value={card.answer}
                      onChange={(e) => handleCardChange(index, 'answer', e.target.value)}
                      className="input"
                      rows={3}
                      placeholder="Enter the answer"
                      disabled={editingCard !== index}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary flex items-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditSet; 