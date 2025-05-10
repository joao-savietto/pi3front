import React from 'react';
import { DndProvider, DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export default function Kanban({ columns, cards, onAddCard, onMoveCard, renderColumnHeader, renderCard }) {
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const card = cards.find((card) => card.id === result.draggableId);

    if (source.droppableId !== destination.droppableId && card) {
      onMoveCard(source.droppableId, destination.droppableId, card);
    }
  };

  return (
    <DndProvider>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="kanban-board">
          {columns.map((column) => (
            <div key={column.id} className="kanban-column">
              {renderColumnHeader ? (
                renderColumnHeader(column)
              ) : (
                <h3>{column.title}</h3>
              )}
              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="kanban-column-content"
                  >
                    {cards
                      .filter((card) => card.columnId === column.id)
                      .map((card, index) => (
                        <Draggable key={card.id} draggableId={card.id} index={index}>
                          {(provided) => (
                            <div
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              ref={provided.innerRef}
                              className="kanban-card"
                            >
                              {renderCard ? renderCard(card, column.id) : <div>{card.content}</div>}
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              <button
                onClick={() => onAddCard(column.id)}
                className="btn btn-outline-primary mt-2"
              >
                Add Card
              </button>
            </div>
          ))}
        </div>
      </DragDropContext>
    </DndProvider>
  );
}
