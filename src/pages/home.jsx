import { useState, useEffect } from 'react';
import useAxios from '../services/hooks/useAxios';
import KanbanV2 from '../components/KanbanV2';
import CustomCard from '../components/custom-card';

export default function HomePage() {
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

  // Helper to map selection processes into Kanban cards
  const mapToCards = (processes) => {
    return processes.map((process) => ({
      id: process.id,
      content: `${process.description}`,
      columnId: process.category
    }));
  };

  // Fetch selection processes from API
  useEffect(() => {
    if (!axios) return;

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

  const cards = mapToCards(selectionProcesses);

  // Handle card movement
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
      <button 
        className="btn btn-success mb-4" 
        onClick={() => alert('Adicionar novo processo seletivo')}
      >
        Adicionar Processo Seletivo
      </button>
      <KanbanV2
        columns={processCategories}
        cards={cards}
        onMoveCard={handleMoveCard}
        renderColumnHeader={(column) => (
          <h3 className="custom-kanban-header">{column.title}</h3>
        )}
        renderCard={(id, content) => (
          <CustomCard 
            text={content} 
            subtext={`Categoria: ${processCategories.find(c => c.id === id)?.title}`}
            onClick={() => console.log("View details for", id)}
          />
        )}
      />
    </div>
  );
}
