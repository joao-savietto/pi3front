import React, { useState, useEffect } from 'react';
import useAxios from '../services/hooks/useAxios';
import Kanban from '../components/Kanban';

export default function EmptyHome() {
  const axios = useAxios();
  const [selectionProcesses, setSelectionProcesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define process categories (from enum)
  const processCategories = [
    { id: 'administrative_financial', title: 'Administrative & Financial' },
    { id: 'commercial', title: 'Commercial' },
    { id: 'communication_marketing', title: 'Communication & Marketing' },
    { id: 'development', title: 'Development' },
    { id: 'innovation', title: 'Innovation' },
    { id: 'people', title: 'People' },
    { id: 'products', title: 'Products' },
    { id: 'operations', title: 'Operations' },
    { id: 'quality', title: 'Quality' }
  ];

  // Fetch selection processes from API
  useEffect(() => {
    const fetchSelectionProcesses = async () => {
      try {
        const response = await axios.get('/api/selection-processes/');
        setSelectionProcesses(response.data);
      } catch (err) {
        setError('Failed to load selection processes.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSelectionProcesses();
  }, [axios]);

  // Format cards for Kanban
  const cards = selectionProcesses.map((process) => ({
    id: process.id,
    content: `${process.title} (ID: ${process.id})`,
    columnId: process.category
  }));

  // Handle card addition (placeholder)
  const handleAddCard = (columnId) => {
    alert(`Add new selection process to category: ${columnId}`);
  };

  // Handle card movement (placeholder)
  const handleMoveCard = (fromColumn, toColumn, card) => {
    alert(
      `Moved card "${card.content}" from "${fromColumn}" to "${toColumn}"`
    );
  };

  if (loading) return <div className="container mt-5">Loading...</div>;
  if (error) return <div className="container mt-5 text-danger">{error}</div>;

  return (
    <div className="container mt-5">
      <h2>Selection Processes</h2>
      <Kanban
        columns={processCategories}
        cards={cards}
        onAddCard={handleAddCard}
        onMoveCard={handleMoveCard}
        renderColumnHeader={(column) => (
          <h3 className="mb-0 text-primary font-weight-bold">{column.title}</h3>
        )}
        renderCard={(card, columnId) => (
          <div className="p-2 bg-light rounded">
            <strong>{card.content}</strong>
          </div>
        )}
      />
    </div>
  );
}
