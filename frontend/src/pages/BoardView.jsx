import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance'; // Adjust path as needed
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../styles/BoardView.module.css';

const BoardView = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();
  
  const [board, setBoard] = useState(null);
  const [lists, setLists] = useState([]);
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [showListModal, setShowListModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [selectedListId, setSelectedListId] = useState('');
  const [newListTitle, setNewListTitle] = useState('');
  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardDescription, setNewCardDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (boardId) {
      fetchBoardData();
    }
  }, [boardId, refreshTrigger]);

  const fetchBoardData = async () => {
    try {
      setIsLoading(true);
      setError('');
      const [boardResponse, listsResponse, cardsResponse] = await Promise.all([
        axiosInstance.get(`/boards/${boardId}`),
        axiosInstance.get(`/lists/${boardId}`),
        axiosInstance.get(`/cards/board/${boardId}`)
      ]);
      
      setBoard(boardResponse.data);
      setLists(listsResponse.data.lists);
      setCards(cardsResponse.data.cards);
    } catch (err) {
      console.error('Error fetching board data:', err);
      if (err.response?.status === 404) {
        setError('Board not found.');
      } else {
        setError('Failed to load board data. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const createList = async (e) => {
    e.preventDefault();
    if (!newListTitle.trim()) return;
    
    try {
      setIsCreating(true);
      const response = await axiosInstance.post('/lists', {
        title: newListTitle.trim(),
        boardId: boardId
      });
      
      setLists(prev => [...prev, response.data]);
      setNewListTitle('');
      setShowListModal(false);
      triggerRefresh();
    } catch (err) {
      console.error('Error creating list:', err);
      setError('Failed to create list. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const createCard = async (e) => {
  e.preventDefault();
  if (!newCardTitle.trim() || !selectedListId) return;
  
  try {
    setIsCreating(true);
    const listCards = cards.filter(card => card.listId === selectedListId);
    const position = listCards.length;
    
    const response = await axiosInstance.post('/cards', {
      title: newCardTitle.trim(),
      description: newCardDescription.trim(),
      listId: selectedListId,
      boardId: boardId,
      position: position
    });
    
    setCards(prev => [...prev, response.data]);
    
    setNewCardTitle('');
    setNewCardDescription('');
    setSelectedListId('');
    setShowCardModal(false);
    setError('');
    triggerRefresh();
  } catch (err) {
    console.error('Error creating card:', err);
    setError('Failed to create card. Please try again.');
  } finally {
    setIsCreating(false);
  }
};
  const deleteList = async (listId) => {
    if (!window.confirm('Are you sure you want to delete this list and all its cards?')) {
      return;
    }
    
    try {
      await axiosInstance.delete(`/lists/${listId}`);
      setLists(prev => prev.filter(list => list._id !== listId));
      setCards(prev => prev.filter(card => card.listId !== listId));
    } catch (err) {
      console.error('Error deleting list:', err);
      setError('Failed to delete list. Please try again.');
    }
  };

  const deleteCard = async (cardId) => {
    if (!window.confirm('Are you sure you want to delete this card?')) {
      return;
    }
    
    try {
      await axiosInstance.delete(`/cards/${cardId}`);
      setCards(prev => prev.filter(card => card._id !== cardId));
    } catch (err) {
      console.error('Error deleting card:', err);
      setError('Failed to delete card. Please try again.');
    }
  };

  const getCardsForList = (listId) => {
    return cards
      .filter(card => card.listId === listId)
      .sort((a, b) => a.position - b.position);
  };

  const openCreateCardModal = (listId) => {
    setSelectedListId(listId);
    setShowCardModal(true);
  };

  if (isLoading) {
    return (
      <div className={styles.pageWrapper}>
        <Header />
        <main className={styles.main}>
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Loading board...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error && !board) {
    return (
      <div className={styles.pageWrapper}>
        <Header />
        <main className={styles.main}>
          <div className={styles.errorContainer}>
            <div className={styles.errorMessage}>
              {error}
              <button 
                className={styles.backButton}
                onClick={() => navigate('/boards')}
              >
                Back to Boards
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <Header />
      
      <main className={styles.main}>
        <div className={styles.boardHeader}>
          <button 
            className={styles.backButton}
            onClick={() => navigate('/boards')}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Boards
          </button>
          
          <h1 className={styles.boardTitle}>{board?.title}</h1>
          
          <button 
            className={styles.addListButton}
            onClick={() => setShowListModal(true)}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add List
          </button>
        </div>

        {error && (
          <div className={styles.errorBanner}>
            {error}
          </div>
        )}

        <div className={styles.listsContainer}>
          {lists.length === 0 ? (
            <div className={styles.emptyState}>
              <svg className={styles.emptyIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <h3>No lists yet</h3>
              <p>Create your first list to start organizing tasks!</p>
              <button 
                className={styles.createFirstListButton}
                onClick={() => setShowListModal(true)}
              >
                Create Your First List
              </button>
            </div>
          ) : (
            <div className={styles.lists}>
              {lists.map(list => (
                <div key={list._id} className={styles.listColumn}>
                  <div className={styles.listHeader}>
                    <h3 className={styles.listTitle}>{list.title}</h3>
                    <button 
                      className={styles.deleteListButton}
                      onClick={() => deleteList(list._id)}
                      title="Delete list"
                    >
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className={styles.cardsContainer}>
                    {getCardsForList(list._id).map(card => (
                      <div key={card._id} className={styles.card}>
                        <div className={styles.cardContent}>
                          <h4 className={styles.cardTitle}>{card.title}</h4>
                          {card.description && (
                            <p className={styles.cardDescription}>{card.description}</p>
                          )}
                        </div>
                        <button 
                          className={styles.deleteCardButton}
                          onClick={() => deleteCard(card._id)}
                          title="Delete card"
                        >
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    
                    <button 
                      className={styles.addCardButton}
                      onClick={() => openCreateCardModal(list._id)}
                    >
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add a card
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Create List Modal */}
      {showListModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Create New List</h2>
              <button 
                className={styles.closeButton}
                onClick={() => setShowListModal(false)}
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={createList} className={styles.modalForm}>
              <div className={styles.inputGroup}>
                <label htmlFor="listTitle" className={styles.label}>
                  List Title
                </label>
                <input
                  type="text"
                  id="listTitle"
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                  className={styles.input}
                  placeholder="Enter list title..."
                  autoFocus
                  required
                />
              </div>
              
              <div className={styles.modalActions}>
                <button 
                  type="button" 
                  className={styles.cancelButton}
                  onClick={() => setShowListModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className={styles.submitButton}
                  disabled={isCreating || !newListTitle.trim()}
                >
                  {isCreating ? 'Creating...' : 'Create List'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Card Modal */}
      {showCardModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Create New Card</h2>
              <button 
                className={styles.closeButton}
                onClick={() => setShowCardModal(false)}
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={createCard} className={styles.modalForm}>
              <div className={styles.inputGroup}>
                <label htmlFor="cardTitle" className={styles.label}>
                  Card Title
                </label>
                <input
                  type="text"
                  id="cardTitle"
                  value={newCardTitle}
                  onChange={(e) => setNewCardTitle(e.target.value)}
                  className={styles.input}
                  placeholder="Enter card title..."
                  autoFocus
                  required
                />
              </div>
              
              <div className={styles.inputGroup}>
                <label htmlFor="cardDescription" className={styles.label}>
                  Description (Optional)
                </label>
                <textarea
                  id="cardDescription"
                  value={newCardDescription}
                  onChange={(e) => setNewCardDescription(e.target.value)}
                  className={styles.textarea}
                  placeholder="Enter card description..."
                  rows={3}
                />
              </div>
              
              <div className={styles.modalActions}>
                <button 
                  type="button" 
                  className={styles.cancelButton}
                  onClick={() => setShowCardModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className={styles.submitButton}
                  disabled={isCreating || !newCardTitle.trim()}
                >
                  {isCreating ? 'Creating...' : 'Create Card'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default BoardView;