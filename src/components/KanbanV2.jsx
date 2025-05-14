import React, { useState, useEffect } from 'react';
import styles from './KanbanV2.module.css'; // Import the CSS module
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS as DndKitCSS } from '@dnd-kit/utilities'; // Renamed to avoid conflict


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
      <div className={`${styles['kanban-board']} d-flex flex-nowrap`}>
        {/* Display all columns in a single row */}
        {columns.map((column) => (
          <div 
            key={column.id} 
            className={styles['custom-kanban-column']}
            data-column-id={column.id}
            style={{ minWidth: '250px', marginRight: '20px' }}
          >
            {/* Column Header */}
            {renderColumnHeader ? (
              renderColumnHeader(column)
            ) : (
              <p className={styles['custom-kanban-header']}>
                {column.title}
              </p>
            )}

            {/* Cards List */}
            <SortableContext
              items={getCardsForColumn(column.id).map(c => c.id)}
              strategy={verticalListSortingStrategy}
            >
              {cards
                .filter((card) => card.columnId === column.id)
                .map((card, index) => (
                  <div key={card.id} className={styles['custom-kanban-card']}>
                    {renderCard ? renderCard(card, card.columnId) : (
                      <div>{card.content}</div>
                    )}
                  </div>
                ))}
            </SortableContext>

            {/* Removed the Add Card button from here */}
          </div>
        ))}
      </div>
    </DndContext>
  );
}
