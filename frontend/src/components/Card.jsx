import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/BoardView.module.css";

const Chevron = ({ open }) => (
  <svg
    className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

export default function Card({ card, onDelete, onUpdate }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);

  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || "");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    setTitle(card.title);
    setDescription(card.description || "");
  }, [card._id, card.title, card.description]);

  const detailsRef = useRef(null);
  const [maxH, setMaxH] = useState(0);
  useEffect(() => {
    if (!detailsRef.current) return;
    const h = detailsRef.current.scrollHeight;
    setMaxH(open ? h : 0);
  }, [open, editing, title, description]);

  const handleSave = async () => {
    if (!title.trim()) return;
    try {
      setSaving(true);
      setErr("");
      await onUpdate({
        ...card,
        title: title.trim(),
        description: description.trim(),
      });
      setEditing(false);
    } catch (e) {
      console.error(e);
      setErr("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`${styles.card} ${open ? styles.cardOpen : ""}`}>
      <button
        type="button"
        className={styles.cardHeader}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={`card-details-${card._id}`}
      >
        <div className={styles.cardHeaderText}>
          <h4 className={styles.cardTitle}>{card.title}</h4>
        </div>
        <Chevron open={open} />
      </button>

      <div
        id={`card-details-${card._id}`}
        ref={detailsRef}
        className={styles.cardDetails}
        style={{ maxHeight: `${maxH}px`, opacity: open ? 1 : 0 }}
      >
        {!editing ? (
          <div className={styles.cardBody} onClick={(e) => e.stopPropagation()}>
            <p className={styles.cardDescription}>
              {card.description?.trim()
                ? card.description
                : "No description yet."}
            </p>
            <div className={styles.cardActions}>
              <button
                className={styles.secondaryButton}
                onClick={() => setEditing(true)}
              >
                Edit
              </button>
              <button
                className={styles.deleteCardButton}
                title="Delete card"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(card._id);
                }}
              >
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
          </div>
        ) : (
          <div
            className={styles.cardEditForm}
            onClick={(e) => e.stopPropagation()}
          >
            {err && <div className={styles.errorBanner}>{err}</div>}
            <label className={styles.label} htmlFor={`title-${card._id}`}>
              Title
            </label>
            <input
              id={`title-${card._id}`}
              className={styles.input}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <label className={styles.label} htmlFor={`desc-${card._id}`}>
              Description
            </label>
            <textarea
              id={`desc-${card._id}`}
              className={styles.textarea}
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <div className={styles.modalActions}>
              <button
                className={styles.cancelButton}
                onClick={() => {
                  setEditing(false);
                  setTitle(card.title);
                  setDescription(card.description || "");
                }}
              >
                Cancel
              </button>
              <button
                className={styles.submitButton}
                disabled={saving || !title.trim()}
                onClick={handleSave}
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
