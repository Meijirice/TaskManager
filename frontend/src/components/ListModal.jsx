import React from "react";
import styles from "../styles/BoardView.module.css";

const ListModal = ({
  isOpen,
  onClose,
  onSubmit,
  newListTitle,
  setNewListTitle,
  isCreating,
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>Create New List</h2>
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
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isCreating || !newListTitle.trim()}
            >
              {isCreating ? "Creating..." : "Create List"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ListModal;
