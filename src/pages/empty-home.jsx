import React, { useState, useEffect } from 'react';
import useAxios from '../services/hooks/useAxios';
import KanbanV2 from '../components/KanbanV2';

export default function EmptyHome() {
  const axios = useAxios();
  const [selectionProcesses, setSelectionProcesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define process categories (from enum)
  const processCategories = [
    { id: 'administrative_financial', title: 'Administrativo' },
    { id: 'commercial', title: 'Comercial' },
    { id: 'communication_marketing', title: 'Comunicação e Marketing' },
    { id: 'development', title: 'Desenvolvimento' },
    { id: 'innovation', title: 'Inovação' },
    { id: 'people', title: 'Pessoas' },
    { id: 'products', title: 'Produtos' },
    { id: 'operations', title: 'Operações' },
    { id: 'quality', title: 'Qualidade' }
  ];

  // Fetch selection processes from API
  useEffect(() => {
    const fetchSelectionProcesses = async () => {
      try {
        const response = await axios.get('/api/selection-processes/');
        setSelectionProcesses(response.data);
      } catch (err) {
        setError('Falha ao carregar processos seletivos.');
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
    content: `${process.description}`,
    columnId: process.category
  }));

  // Handle card addition (placeholder)
  const handleAddCard = (columnId) => {
    alert(`Adicionar novo processo seletivo à categoria: ${columnId}`);
  };

  // Handle card movement (placeholder)
  const handleMoveCard = (fromColumn, toColumn, card) => {
    alert(
      `Movido cartão "${card.content}" de "${fromColumn}" para "${toColumn}"`
    );
  };

  if (loading) return <div className="container mt-5">Carregando...</div>;
  if (error) return <div className="container mt-5 text-danger">{error}</div>;

  return (
    <div className="container mt-5 overflow-auto">
      <h2>Processos Seletivos</h2>
      <KanbanV2
        columns={processCategories}
        cards={cards}
        onAddCard={handleAddCard}
        onMoveCard={handleMoveCard}
        renderColumnHeader={(column) => (
          <h3 className="kanban-header">{column.title}</h3> // Updated class name
        )}
        renderCard={(card, columnId) => (
          <div className="kanban-card">
            <strong>{card.content}</strong>
          </div>
        )}
      />
    </div>
  );
}
