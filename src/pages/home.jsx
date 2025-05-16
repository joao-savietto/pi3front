import { useState, useEffect } from 'react';
import useAxios from '../services/hooks/useAxios';
import KanbanV2 from '../components/KanbanV2';
import CustomCard from '../components/custom-card';
import styles from '../components/KanbanV2.module.css';
import homeStyles from './home.module.css';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

export default function HomePage() {
  const axios = useAxios();
  const [selectionProcesses, setSelectionProcesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState('');

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

  // Modal toggle and form submission logic
  const handleModalToggle = () => setShowModal(!showModal);
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newDescription || !newCategory) {
      alert('Preencha todos os campos.');
      return;
    }

    try {
      await axios.post('/api/selection-processes/', {
        description: newDescription,
        category: newCategory
      });

      // Refresh data after successful creation
      const response = await axios.get('/api/selection-processes/');
      setSelectionProcesses(response.data);

      handleModalToggle();
      setNewDescription('');
      setNewCategory('');
    } catch (err) {
      console.error('Erro ao criar processo seletivo:', err);
      alert('Falha ao adicionar novo processo.');
    }
  };

  if (loading) return <div className="container mt-5">Carregando...</div>;
  if (error) return <div className="container mt-5 text-danger">{error}</div>;

  return (
    <div className="d-flex flex-column h-100">
      <h2>Processos Seletivos</h2>
      <button
        className={`btn btn-success mb-4 ${homeStyles['btn--normal-size']}`}
        onClick={handleModalToggle}
      >
        Adicionar Processo Seletivo
      </button>

      {/* Modal for adding new selection process */}
      <Modal show={showModal} onHide={handleModalToggle} centered>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Novo Processo Seletivo</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="formDescription">
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite a descrição do processo"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formCategory">
              <Form.Label>Categoria</Form.Label>
              <Form.Select
                aria-label="Selecione a categoria"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              >
                <option value="">Selecione uma categoria</option>
                {processCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.title}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <button type="button" className="btn btn-secondary" onClick={handleModalToggle}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-success">
              Adicionar Processo
            </button>
          </Modal.Footer>
        </Form>
      </Modal>

      <div className="flex-grow-1 overflow-auto">
        <KanbanV2
          columns={processCategories}
          cards={cards}
          onMoveCard={handleMoveCard}
          renderColumnHeader={(column) => (
            <h3 className={styles['custom-kanban-header']}>{column.title}</h3>
          )}
          renderCard={(id, content) => (
            <CustomCard
              text={content}
              subtext={content.is_ended ? "Processo Encerrado" : "Processo Aberto"}
              onClick={() => console.log("View details for", id)}
            />
          )}
        />
      </div>
    </div>
  );
}
