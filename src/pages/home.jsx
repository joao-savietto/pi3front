import { useState, useEffect } from 'react';
import useAxios from '../services/hooks/useAxios';
import KanbanV2 from '../components/KanbanV2';
import CustomCard from '../components/custom-card';
import styles from '../components/KanbanV2.module.css';
import homeStyles from './home.module.css';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import { convertUTCStringToLocalDate } from '../services/dates';

export default function HomePage() {
  const axios = useAxios();
  const [selectionProcesses, setSelectionProcesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [isEnded, setIsEnded] = useState(false);
  const [editingCardId, setEditingCardId] = useState(null);

  // Details modal state
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState(null);

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
      content: process.description,
      columnId: process.category,
      is_ended: process.is_ended || false
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
      let response;

      if (editingCardId) {
        // Update existing process
        await axios.put(`/api/selection-processes/${editingCardId}/`, {
          description: newDescription,
          category: newCategory,
          is_ended: isEnded
        });
      } else {
        // Create new process
        response = await axios.post('/api/selection-processes/', {
          description: newDescription,
          category: newCategory,
          is_ended: false
        });

        setSelectionProcesses([...selectionProcesses, response.data]);
      }

      // Refresh data after successful operation
      const updatedResponse = await axios.get('/api/selection-processes/');
      setSelectionProcesses(updatedResponse.data);

      handleModalToggle();
      resetFormFields();
    } catch (err) {
      console.error('Erro ao salvar processo seletivo:', err);
      alert('Falha ao salvar o processo.');
    }
  };

  const resetFormFields = () => {
    setNewDescription('');
    setNewCategory('');
    setIsEnded(false);
    setEditingCardId(null);
  };

  // Edit handler
  const handleEdit = (id) => {
    const processToEdit = selectionProcesses.find(p => p.id === id);
    if (!processToEdit) return;

    setEditingCardId(id);
    setNewDescription(processToEdit.description);
    setNewCategory(processToEdit.category);
    setIsEnded(processToEdit.is_ended || false);
    setShowModal(true);
  };

  // View Details handler
  const handleViewDetails = (id) => {
    const processToView = selectionProcesses.find(p => p.id === id);
    if (!processToView) return;

    setSelectedProcess(processToView);
    setShowDetailsModal(true);
  };

  const navigate = useNavigate();

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

      {/* Modal for adding/editing selection process */}
      <Modal show={showModal} onHide={handleModalToggle} centered>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>{editingCardId ? 'Editar Processo' : 'Novo Processo Seletivo'}</Modal.Title>
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

            <Form.Check
              type="checkbox"
              label="Processo Encerrado"
              checked={isEnded}
              onChange={(e) => setIsEnded(e.target.checked)}
            />
          </Modal.Body>
          <Modal.Footer>
            <button type="button" className="btn btn-secondary" onClick={handleModalToggle}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-success">
              {editingCardId ? 'Atualizar' : 'Adicionar'}
            </button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Modal for viewing process details */}
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Detalhes do Processo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProcess && (
            <>
              <p><strong>Descrição:</strong> {selectedProcess.description}</p>
              <p><strong>Categoria:</strong> 
                {processCategories.find(cat => cat.id === selectedProcess.category)?.title || 'Desconhecida'}
              </p>
              <p><strong>Status:</strong> {selectedProcess.is_ended ? "Encerrado" : "Aberto"}</p>
              <p><strong>Criado em:</strong> {convertUTCStringToLocalDate(selectedProcess.created_at)}</p>
              {selectedProcess.is_ended && (
                <p><strong>Encerrado em:</strong> {convertUTCStringToLocalDate(selectedProcess.ended_at)}</p>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={() => setShowDetailsModal(false)}>
            Fechar
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => navigate(`/applications/${selectedProcess?.id}`)}
          >
            Acessar
          </button>
        </Modal.Footer>
      </Modal>

      <div className="flex-grow-1 overflow-auto">
        <KanbanV2
          columns={processCategories}
          cards={cards}
          onMoveCard={handleMoveCard}
          renderColumnHeader={(column) => (
            <h3 className={styles['custom-kanban-header']}>{column.title}</h3>
          )}
          renderCard={(id, content) => {
            const card = cards.find(c => c.id === id);
            return (
              <CustomCard
                text={content}
                subtext={card.is_ended ? "Processo Encerrado" : "Processo Aberto"}
                onClick={() => console.log("View details for", id)}
                onEdit={() => handleEdit(id)}
                onViewDetails={() => handleViewDetails(id)}
              />
            );
          }}
        />
      </div>
    </div>
  );
}
