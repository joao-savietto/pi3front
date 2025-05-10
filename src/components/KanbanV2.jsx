import React from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function KanbanV2({ columns, cards, onAddCard, onMoveCard, renderColumnHeader, renderCard }) {
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
      <div className="kanban-board">
        {/* Use Bootstrap row and columns for layout */}
        <div className="row g-4">
          {columns.map((column) => (
            <div key={column.id} className="col-md-6 col-lg-4" data-column-id={column.id}>
              <div className="kanban-column">
                {/* Column Header */}
                {renderColumnHeader ? (
                  renderColumnHeader(column)
                ) : (
                  <h3 className="kanban-header">{column.title}</h3>
                )}

                {/* Cards List */}
                <SortableContext
                  items={cards.filter((card) => card.columnId === column.id).map((c) => c.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {cards
                    .filter((card) => card.columnId === column.id)
                    .map((card, index) => (
                      <div key={card.id} className="kanban-card" data-id={card.id}>
                        {renderCard ? renderCard(card, card.columnId) : (
                          <div>{card.content}</div>
                        )}
                      </div>
                    ))}
                </SortableContext>

                {/* Add Card Button Container */}
                <div className="kanban-add-button-container">
                  <button
                    onClick={() => onAddCard(column.id)}
                    className="kanban-add-button"
                  >
                    + Adicionar Cartão
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DndContext>
  );
}
