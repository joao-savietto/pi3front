import React, { useState, useEffect } from 'react';
import styles from './KanbanV2.module.css';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

/**
 * Renders a single column header.
 */
function ColumnHeader({ title }) {
  return (
    <h3 className={styles['custom-kanban-header']}>
      {title}
    </h3>
  );
}

/**
 * Renders an individual card in the Kanban board.
 */
function CardItem({ id, content, renderCard = null }) {
  const defaultRender = () => <div>{content}</div>;
  return (
    <div key={id} className={styles['custom-kanban-card']}>
      {renderCard ? renderCard(id, content) : defaultRender()}
    </div>
  );
}

/**
 * Main KanbanV2 component.
 */
export default function KanbanV2({ 
  columns = [], 
  cards = [],
  onMoveCard = () => {},
  renderColumnHeader = null,
  renderCard = null
}) {
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
    }));
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className={`${styles['kanban-board']} d-flex flex-nowrap`}>
        {columns.map((column) => {
          const columnCards = getCardsForColumn(column.id);
          return (
            <div 
              key={column.id}
              className={styles['custom-kanban-column']}
              data-column-id={column.id}
            >
              {/* Column Header */}
              {renderColumnHeader ? renderColumnHeader(column) : <ColumnHeader title={column.title} />}

              {/* Cards List */}
              <SortableContext
                items={columnCards.map(c => c.id)}
                strategy={verticalListSortingStrategy}
              >
                {columnCards.map(card => (
                  <CardItem key={card.id} id={card.id} content={card.content} renderCard={renderCard} />
                ))}
              </SortableContext>
            </div>
          );
        })}
      </div>
    </DndContext>
  );
}
