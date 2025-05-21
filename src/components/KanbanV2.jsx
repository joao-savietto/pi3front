import styles from './KanbanV2.module.css';
import {
  DndProvider,
  useDrop,
  useDrag
} from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const ItemType = {
  CARD: 'card',
};

// Renders a single column header.
function ColumnHeader({ title }) {
  return (
    <h3 className={styles['custom-kanban-header']}>
      {title}
    </h3>
  );
}

// Renders an individual card in the Kanban board.
function CardItem({ id, content, renderCard }) {
  const [{ isDragging }, drag] = useDrag({
    type: ItemType.CARD,
    item: { id, },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  });
  const defaultRender = () => <div>{content}</div>;
  
  return (
    <div
      ref={drag}
      className={styles['custom-kanban-card']}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {renderCard ? renderCard(id, content) : defaultRender()}
    </div>
  );
}

function KanbanColumn({ column, cards, onMoveCard, renderCard }) {
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: ItemType.CARD,
    drop: (item) => {
      if (item.id) {
        onMoveCard(item.id, column.id);
      }
    },
    collect: monitor => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  });
  
  return (
    <div ref={drop} className={styles['custom-kanban-column']} data-column-id={column.id}>
      <ColumnHeader title={column.title} />
      {cards.map(card => (
        <CardItem key={card.id} id={card.id} content={card.content} renderCard={renderCard} />
      ))}
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
  renderCard = null
}) {
  const getCardsForColumn = (columnId) => {
    return cards.filter(card => card.columnId === columnId);
  };
  
  return (
    <DndProvider backend={HTML5Backend}>
      <div className={`${styles['kanban-board']} d-flex flex-nowrap h-100`}>
        {columns.map((column) => {
          const columnCards = getCardsForColumn(column.id);
          return (
            <KanbanColumn
              key={column.id}
              column={column}
              cards={columnCards}
              onMoveCard={onMoveCard}
              renderCard={renderCard}
            />
          );
        })}
      </div>
    </DndProvider>
  );
}