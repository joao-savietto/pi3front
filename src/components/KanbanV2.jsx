import React, { useState, useEffect } from 'react';
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

  // Group cards by column
  const getCardsForColumn = (columnId) => {
    return cards.filter(card => card.columnId === columnId).map(card => ({
      id: card.id,
      content: card.content,
      columnId: card.columnId
    }));
  };

  // Calculate the number of columns based on screen size
  const [columnsPerRow, setColumnsPerRow] = useState(3);
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setColumnsPerRow(1);
      } else if (window.innerWidth < 992) {
        setColumnsPerRow(2);
      } else {
        setColumnsPerRow(3);
      }
    };
    
    // Set initial value
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="kanban-board d-flex flex-nowrap">
        {/* Display all columns in a single row */}
        {columns.map((column) => (
          <div 
            key={column.id} 
            className={`kanban-column kanban-test`} 
            data-column-id={column.id}
            style={{ minWidth: '250px', marginRight: '20px' }}
          >
            {/* Column Header */}
            {renderColumnHeader ? (
              renderColumnHeader(column)
            ) : (
              <h3 className="kanban-header">{column.title}</h3>
            )}

            {/* Cards List */}
            <SortableContext
              items={getCardsForColumn(column.id).map(c => c.id)}
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
                className={`btn btn-success btn-sm`}
                style={{ minWidth: 'auto', marginRight: 0 }}
              >
                + Adicionar Cartão
              </button>
            </div>
          </div>
        ))}
      </div>
    </DndContext>
  );
}
