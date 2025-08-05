import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const FlashcardContext = createContext();

export const useFlashcard = () => {
  const context = useContext(FlashcardContext);
  if (!context) {
    throw new Error('useFlashcard must be used within a FlashcardProvider');
  }
  return context;
};

export const FlashcardProvider = ({ children }) => {
  const [sets, setSets] = useState([]);
  const [currentSet, setCurrentSet] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch user's flashcard sets
  const fetchSets = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/sets');
      setSets(response.data.sets);
    } catch (error) {
      console.error('Failed to fetch sets:', error);
      toast.error('Failed to load flashcard sets');
    } finally {
      setLoading(false);
    }
  };

  // Create new flashcard set
  const createSet = async (setData) => {
    try {
      const response = await axios.post('/api/sets', setData);
      const newSet = response.data.set;
      setSets(prev => [newSet, ...prev]);
      toast.success('Flashcard set created successfully!');
      return { success: true, set: newSet };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create set';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Update flashcard set
  const updateSet = async (setId, setData) => {
    try {
      const response = await axios.put(`/api/sets/${setId}`, setData);
      const updatedSet = response.data.set;
      setSets(prev => prev.map(set => 
        set.id === setId ? updatedSet : set
      ));
      toast.success('Flashcard set updated successfully!');
      return { success: true, set: updatedSet };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update set';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Delete flashcard set
  const deleteSet = async (setId) => {
    try {
      await axios.delete(`/api/sets/${setId}`);
      setSets(prev => prev.filter(set => set.id !== setId));
      toast.success('Flashcard set deleted successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete set';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Fetch specific flashcard set
  const fetchSet = async (setId) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/sets/${setId}`);
      setCurrentSet(response.data.set);
      return { success: true, set: response.data.set };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch set';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Add card to set
  const addCard = async (setId, cardData) => {
    try {
      const response = await axios.post(`/api/sets/${setId}/cards`, cardData);
      const newCard = response.data.card;
      
      // Update current set if it's the one being modified
      if (currentSet && currentSet.id === setId) {
        setCurrentSet(prev => ({
          ...prev,
          cards: [...prev.cards, newCard]
        }));
      }
      
      // Update sets list
      setSets(prev => prev.map(set => {
        if (set.id === setId) {
          return { ...set, cardCount: set.cardCount + 1 };
        }
        return set;
      }));
      
      toast.success('Card added successfully!');
      return { success: true, card: newCard };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add card';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Update card in set
  const updateCard = async (setId, cardId, cardData) => {
    try {
      const response = await axios.put(`/api/sets/${setId}/cards/${cardId}`, cardData);
      const updatedCard = response.data.card;
      
      // Update current set if it's the one being modified
      if (currentSet && currentSet.id === setId) {
        setCurrentSet(prev => ({
          ...prev,
          cards: prev.cards.map(card => 
            card.id === cardId ? { ...card, ...updatedCard } : card
          )
        }));
      }
      
      toast.success('Card updated successfully!');
      return { success: true, card: updatedCard };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update card';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Delete card from set
  const deleteCard = async (setId, cardId) => {
    try {
      await axios.delete(`/api/sets/${setId}/cards/${cardId}`);
      
      // Update current set if it's the one being modified
      if (currentSet && currentSet.id === setId) {
        setCurrentSet(prev => ({
          ...prev,
          cards: prev.cards.filter(card => card.id !== cardId)
        }));
      }
      
      // Update sets list
      setSets(prev => prev.map(set => {
        if (set.id === setId) {
          return { ...set, cardCount: Math.max(0, set.cardCount - 1) };
        }
        return set;
      }));
      
      toast.success('Card deleted successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete card';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Mark card as reviewed
  const reviewCard = async (setId, cardId, isCorrect) => {
    try {
      await axios.post(`/api/sets/${setId}/cards/${cardId}/review`, { isCorrect });
      
      // Update current set if it's the one being modified
      if (currentSet && currentSet.id === setId) {
        setCurrentSet(prev => ({
          ...prev,
          cards: prev.cards.map(card => 
            card.id === cardId 
              ? { 
                  ...card, 
                  isCorrect, 
                  lastReviewed: new Date().toISOString(),
                  reviewCount: card.reviewCount + 1
                }
              : card
          )
        }));
      }
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to record review';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const value = {
    sets,
    currentSet,
    loading,
    fetchSets,
    createSet,
    updateSet,
    deleteSet,
    fetchSet,
    addCard,
    updateCard,
    deleteCard,
    reviewCard,
    setCurrentSet
  };

  return (
    <FlashcardContext.Provider value={value}>
      {children}
    </FlashcardContext.Provider>
  );
}; 