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

  // Group cards by column and then by row
  const getRowsForColumn = (columnId) => {
    return cards.filter(card => card.columnId === columnId).map(card => ({
      id: card.id,
      content: card.content,
      columnId: card.columnId
    }));
  };

  // Calculate how many columns to show per row based on screen size
  const getColumnsPerRow = () => {
    return window.innerWidth < 768 ? 1 : 
           window.innerWidth < 992 ? 2 : 3;
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="kanban-board">
        {/* Use Bootstrap row for horizontal layout */}
        {columns.map((column, rowIndex) => {
          // Calculate which columns to show in this row
          const startIndex = rowIndex * getColumnsPerRow();
          const endIndex = startIndex + getColumnsPerRow();
          
          return (
            <div key={rowIndex} className="row g-4 mb-4">
              {columns.slice(startIndex, endIndex).map((column) => (
                <div 
                  key={column.id} 
                  className="col-md-6 col-lg-4" 
                  data-column-id={column.id}
                >
                  <div className="kanban-column">
                    {/* Column Header */}
                    {renderColumnHeader ? (
                      renderColumnHeader(column)
                    ) : (
                      <h3 className="kanban-header">{column.title}</h3>
                    )}

                    {/* Cards List */}
                    <SortableContext
                      items={getRowsForColumn(column.id).map(c => c.id)}
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
          );
        })}
      </div>
    </DndContext>
  );
}
