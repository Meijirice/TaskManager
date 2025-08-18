import React from "react";
import Card from "./Card";
import styles from "../styles/BoardView.module.css";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const List = ({
  list,
  cards,
  onDeleteList,
  onDeleteCard,
  onAddCard,
  onUpdateCard,
}) => {
  return (
    <div className={styles.listColumn}>
      <div className={styles.listHeader}>
        <h3 className={styles.listTitle}>{list.title}</h3>
        <button
          className={styles.deleteListButton}
          onClick={() => onDeleteList(list._id)}
          title="Delete list"
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>

      <div className={styles.cardsContainer}>
        {cards.map((card, index) => (
          <Draggable key={card._id} draggableId={card._id} index={index}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                style={{
                  ...provided.draggableProps.style,
                  opacity: snapshot.isDragging ? 0.7 : 1,
                }}
              >
                <Card
                  card={card}
                  onDelete={onDeleteCard}
                  onUpdate={onUpdateCard}
                />
              </div>
            )}
          </Draggable>
        ))}

        <button
          className={styles.addCardButton}
          onClick={() => onAddCard(list._id)}
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add a card
        </button>
      </div>
    </div>
  );
};

export default List;
