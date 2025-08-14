import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../styles/Boards.module.css';

const Boards = () => {
  const [boards, setBoards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get('/boards');
      setBoards(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching boards:', err);
      setError('Failed to load boards. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const createBoard = async (e) => {
    e.preventDefault();
    if (!newBoardTitle.trim()) return;
    
    try {
      setIsCreating(true);
      const response = await axiosInstance.post('/boards', {
        title: newBoardTitle.trim()
      });
      
      setBoards(prev => [...prev, response.data]);
      setNewBoardTitle('');
      setShowCreateModal(false);
      setError('');
    } catch (err) {
      console.error('Error creating board:', err);
      setError('Failed to create board. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const deleteBoard = async (boardId) => {
    if (!window.confirm('Are you sure you want to delete this board? This action cannot be undone.')) {
      return;
    }
    
    try {
      await axiosInstance.delete(`/boards/${boardId}`);
      setBoards(prev => prev.filter(board => board._id !== boardId));
      setError('');
    } catch (err) {
      console.error('Error deleting board:', err);
      setError('Failed to delete board. Please try again.');
    }
  };

  const openBoard = (boardId) => {
    navigate(`/boards/${boardId}`);
  };

  return (
    <div className={styles.pageWrapper}>
      <Header />
      
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>My Boards</h1>
            <button 
              className={styles.createButton}
              onClick={() => setShowCreateModal(true)}
            >
              <svg className={styles.plusIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Board
            </button>
          </div>

          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}

          {isLoading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.spinner}></div>
              <p>Loading your boards...</p>
            </div>
          ) : (
            <div className={styles.boardsGrid}>
              {boards.length === 0 ? (
                <div className={styles.emptyState}>
                  <svg className={styles.emptyIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <h3>No boards yet</h3>
                  <p>Create your first board to get started organizing your projects!</p>
                  <button 
                    className={styles.createFirstButton}
                    onClick={() => setShowCreateModal(true)}
                  >
                    Create Your First Board
                  </button>
                </div>
              ) : (
                boards.map(board => (
                  <div key={board._id} className={styles.boardCard}>
                    <div 
                      className={styles.boardContent}
                      onClick={() => openBoard(board._id)}
                    >
                      <h3 className={styles.boardTitle}>{board.title}</h3>
                      <p className={styles.boardDate}>
                        Created {new Date(board.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button 
                      className={styles.deleteButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteBoard(board._id);
                      }}
                      title="Delete board"
                    >
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>

      {showCreateModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Create New Board</h2>
              <button 
                className={styles.closeButton}
                onClick={() => setShowCreateModal(false)}
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={createBoard} className={styles.modalForm}>
              <div className={styles.inputGroup}>
                <label htmlFor="boardTitle" className={styles.label}>
                  Board Title
                </label>
                <input
                  type="text"
                  id="boardTitle"
                  value={newBoardTitle}
                  onChange={(e) => setNewBoardTitle(e.target.value)}
                  className={styles.input}
                  placeholder="Enter board title..."
                  autoFocus
                  required
                />
              </div>
              
              <div className={styles.modalActions}>
                <button 
                  type="button" 
                  className={styles.cancelButton}
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className={styles.submitButton}
                  disabled={isCreating || !newBoardTitle.trim()}
                >
                  {isCreating ? 'Creating...' : 'Create Board'}
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

export default Boards;