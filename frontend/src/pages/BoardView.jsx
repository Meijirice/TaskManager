import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance"; // Adjust path as needed
import Header from "../components/Header";
import Footer from "../components/Footer";
import List from "../components/List";
import ListModal from "../components/ListModal";
import CardModal from "../components/CardModal";
import styles from "../styles/BoardView.module.css";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const BoardView = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();

  const [board, setBoard] = useState(null);
  const [lists, setLists] = useState([]);
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [showListModal, setShowListModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [selectedListId, setSelectedListId] = useState("");
  const [newListTitle, setNewListTitle] = useState("");
  const [newCardTitle, setNewCardTitle] = useState("");
  const [newCardDescription, setNewCardDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const [selectedCard, setSelectedCard] = useState(null);
  const [isCardDetailOpen, setIsCardDetailOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (boardId) {
      fetchBoardData();
    }
  }, [boardId, refreshTrigger]);

  const fetchBoardData = async () => {
    try {
      setIsLoading(true);
      setError("");
      const [boardResponse, listsResponse, cardsResponse] = await Promise.all([
        axiosInstance.get(`/boards/${boardId}`),
        axiosInstance.get(`/lists/${boardId}`),
        axiosInstance.get(`/cards/board/${boardId}`),
      ]);

      setBoard(boardResponse.data);
      setLists(listsResponse.data.lists);
      setCards(cardsResponse.data.cards);
    } catch (err) {
      console.error("Error fetching board data:", err);
      if (err.response?.status === 404) {
        setError("Board not found.");
      } else {
        setError("Failed to load board data. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const createList = async (e) => {
    e.preventDefault();
    if (!newListTitle.trim()) return;

    try {
      setIsCreating(true);
      const response = await axiosInstance.post("/lists", {
        title: newListTitle.trim(),
        boardId: boardId,
      });

      setLists((prev) => [...prev, response.data]);
      setNewListTitle("");
      setShowListModal(false);
      triggerRefresh();
    } catch (err) {
      console.error("Error creating list:", err);
      setError("Failed to create list. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const createCard = async (e) => {
    e.preventDefault();
    if (!newCardTitle.trim() || !selectedListId) return;

    try {
      setIsCreating(true);
      const listCards = cards.filter((card) => card.listId === selectedListId);
      const position = listCards.length;

      console.log(newCardDescription.trim());

      const response = await axiosInstance.post("/cards", {
        title: newCardTitle.trim(),
        description: newCardDescription.trim(),
        listId: selectedListId,
        boardId: boardId,
        position: position,
      });

      setCards((prev) => [...prev, response.data]);

      setNewCardTitle("");
      setNewCardDescription("");
      setSelectedListId("");
      setShowCardModal(false);
      setError("");
      triggerRefresh();
    } catch (err) {
      console.error("Error creating card:", err);
      setError("Failed to create card. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };
  const deleteList = async (listId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this list and all its cards?"
      )
    ) {
      return;
    }

    try {
      await axiosInstance.delete(`/lists/${listId}`);
      setLists((prev) => prev.filter((list) => list._id !== listId));
      setCards((prev) => prev.filter((card) => card.listId !== listId));
    } catch (err) {
      console.error("Error deleting list:", err);
      setError("Failed to delete list. Please try again.");
    }
  };

  const deleteCard = async (cardId) => {
    if (!window.confirm("Are you sure you want to delete this card?")) {
      return;
    }

    try {
      await axiosInstance.delete(`/cards/${cardId}`);
      setCards((prev) => prev.filter((card) => card._id !== cardId));
    } catch (err) {
      console.error("Error deleting card:", err);
      setError("Failed to delete card. Please try again.");
    }
  };

  const getCardsForList = (listId) => {
    return cards
      .filter((card) => card.listId === listId)
      .sort((a, b) => a.position - b.position);
  };

  const openCreateCardModal = (listId) => {
    setSelectedListId(listId);
    setShowCardModal(true);
  };

  const openUpdateCardModal = (cardId) => {};

  const updateCard = async (updated) => {
    try {
      const res = await axiosInstance.put(`/cards/${updated._id}`, {
        title: updated.title,
        description: updated.description,
      });
      setCards((prev) =>
        prev.map((c) =>
          c._id === updated._id
            ? {
                ...c,
                title: res.data.title ?? updated.title,
                description: res.data.description ?? updated.description,
              }
            : c
        )
      );
    } catch (err) {
      console.error("Error updating card:", err);
      setError("Failed to update card. Please try again.");
      throw err;
    }
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const cardId = draggableId;
    const newListId = destination.droppableId;
    const newPosition = destination.index;

    setCards((prev) => {
      let updated = [...prev];
      const card = updated.find((c) => c._id === cardId);
      if (!card) return prev;

      updated = updated.filter((c) => c._id !== cardId);
      updated.splice(newPosition, 0, {
        ...card,
        listId: newListId,
        position: newPosition,
      });
      return updated;
    });

    try {
      await axiosInstance.put(`/cards/${cardId}`, {
        listId: newListId,
        position: newPosition,
      });
    } catch (err) {
      console.error("Error moving card:", err);
      setError("Failed to move card. Refresh might fix it.");
    }
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
                onClick={() => navigate("/boards")}
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
            onClick={() => navigate("/boards")}
          >
            &lt; &nbsp; Back to Boards
          </button>

          <h1 className={styles.boardTitle}>{board?.title}</h1>

          <button
            className={styles.addListButton}
            onClick={() => setShowListModal(true)}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add List
          </button>
        </div>

        {error && <div className={styles.errorBanner}>{error}</div>}

        <div className={styles.listsContainer}>
          {lists.length === 0 ? (
            <div className={styles.emptyState}>
              <svg
                className={styles.emptyIcon}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
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
            <DragDropContext onDragEnd={onDragEnd}>
              <div className={styles.lists}>
                {lists.map((list) => (
                  <Droppable
                    droppableId={String(list._id)}
                    key={String(list._id)}
                  >
                    {(provided) => (
                      <div
                        className={styles.listColumn}
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                      >
                        <List
                          list={list}
                          cards={getCardsForList(list._id)}
                          onDeleteList={deleteList}
                          onDeleteCard={deleteCard}
                          onAddCard={openCreateCardModal}
                          onUpdateCard={updateCard}
                        />
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                ))}
              </div>
            </DragDropContext>
          )}
        </div>
      </main>

      {showListModal && (
        <ListModal
          isOpen={showListModal}
          onClose={() => setShowListModal(false)}
          onSubmit={createList}
          newListTitle={newListTitle}
          setNewListTitle={setNewListTitle}
          isCreating={isCreating}
        />
      )}

      {showCardModal && (
        <CardModal
          isOpen={showCardModal}
          onClose={() => setShowCardModal(false)}
          onSubmit={createCard}
          newCardTitle={newCardTitle}
          setNewCardTitle={setNewCardTitle}
          newCardDescription={newCardDescription}
          setNewCardDescription={setNewCardDescription}
          isCreating={isCreating}
        />
      )}

      <Footer />
    </div>
  );
};

export default BoardView;
