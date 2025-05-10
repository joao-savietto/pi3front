import React from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Import the component-specific styles
import styles from './Kanban.module.css'; // Adjust path if necessary

export default function Kanban({ columns, cards, onAddCard, onMoveCard, renderColumnHeader, renderCard }) {
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const activeCard = cards.find((card) => card.id === active.id);
    const overColumnId = over.data.current?.sortable.containerId;

    if (activeCard && overColumnId) {
      onMoveCard(active.id, overColumnId, activeCard);
    }
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      {/* Apply the board styles */}
      <div className={styles.kanbanBoard}>
        {columns.map((column) => (
          <div key={column.id} className={styles.kanbanColumn}>
            {/* Column Header */}
            {renderColumnHeader ? (
              renderColumnHeader(column)
            ) : (
              <h3 className="mb-0 text-primary font-weight-bold">{column.title}</h3>
            )}

            {/* Cards List */}
            <SortableContext
              items={cards.filter((card) => card.columnId === column.id).map((c) => c.id)}
              strategy={verticalListSortingStrategy}
            >
              {cards
                .filter((card) => card.columnId === column.id)
                .map((card, index) => (
                  <Card
                    key={card.id}
                    card={card}
                    index={index}
                    renderCard={renderCard}
                  />
                ))}
            </SortableContext>

            {/* Add Card Button */}
            <button
              onClick={() => onAddCard(column.id)}
              className="btn btn-outline-primary mt-2 w-100"
            >
              + Add Card
            </button>
          </div>
        ))}
      </div>
    </DndContext>
  );
}

function Card({ card, index, renderCard }) {
  const { attributes, listeners, setNodeRef, transform } = useSortable({
    id: card.id,
  });

  const style = {
    ...attributes.style,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      className={`${styles.kanbanCard} bg-white rounded shadow-sm p-3 mb-2`}
    >
      {renderCard ? renderCard(card, card.columnId) : (
        <div>
          <strong>{card.content}</strong>
        </div>
      )}
    </div>
  );
}
