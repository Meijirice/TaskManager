// src/components/CardModal.jsx
import React from "react";
import styles from "../styles/BoardView.module.css";

const CardModal = ({
  isOpen,
  onClose,
  onSubmit,
  newCardTitle,
  setNewCardTitle,
  newCardDescription,
  setNewCardDescription,
  isCreating,
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>Create New Card</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={onSubmit} className={styles.modalForm}>
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
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isCreating || !newCardTitle.trim()}
            >
              {isCreating ? "Creating..." : "Create Card"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CardModal;
