import { useState, useEffect } from 'react';
import useAxios from '../services/hooks/useAxios';
import KanbanV2 from '../components/KanbanV2';
import CustomCard from '../components/custom-card';
import styles from '../components/KanbanV2.module.css';
import homeStyles from './home.module.css';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate, useParams } from 'react-router-dom';

export default function ApplicationsKanbanPage() {
  const axios = useAxios();
  const [applications, setApplications] = useState([]);
  const [selectionProcess, setSelectionProcess] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal and talent state
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [talents, setTalents] = useState([]);
  const [selectedTalentId, setSelectedTalentId] = useState(null);

  // Define application steps (mirroring the Python enum)
  const applicationSteps = [
    { id: 'HUNTING', title: 'Caça a Talentos' },
    { id: 'DATABASE', title: 'Banco de Talentos' },
    { id: 'HR_INTERVIEW', title: 'Entrevista com a RH' },
    { id: 'LEADERSHIP_INTERVIEW', title: 'Entrevista Líder' },
    { id: 'TECHNICAL_CHALLENGE', title: 'Desafio Técnico' },
    { id: 'TECHNICAL_CHALLENGE_NOT_SUBMITTED', title: 'Desafio Não Enviado' },
    { id: 'REJECTED', title: 'Rejeitado' },
    { id: 'DECLINED', title: 'Recusado' },
    { id: 'STAND_BY', title: 'Em Espera' },
    { id: 'OFFER_PHASE', title: 'Fase de Oferta' },
    { id: 'ONBOARDING', title: 'Onboarding' },
  ];

  // Fetch applications and selection process for the given selection process
  const { processId } = useParams();
  useEffect(() => {
    if (!axios || !processId) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch talents from API (similar to /talents)
        const talentsResponse = await axios.get('/api/applicants/');
        setTalents(talentsResponse.data.results || talentsResponse.data);

        // Fetch selection process description
        const processResponse = await axios.get(`/api/selection-processes/${processId}`);
        setSelectionProcess(processResponse.data);

        // Fetch applications for the given selection process
        const appsResponse = await axios.get(`/api/selection-processes/${processId}/applications`);
        setApplications(appsResponse.data);
      } catch (err) {
        setError('Falha ao carregar dados do processo seletivo ou candidaturas.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [axios, processId]);

  // Helper to map applications into Kanban cards
  const mapToCards = (apps) => {
    return apps.map((app) => ({
      id: app.id,
      content: `${app.talent.name} - ${app.talent.email}`,
      columnId: app.step || 'DATABASE',
      is_ended: false // Placeholder; adjust based on actual logic
    }));
  };

  const cards = mapToCards(applications);

  // Handle card movement (step change)
  const handleMoveCard = (fromColumn, toColumn, card) => {
    alert(
      `Movido candidatura "${card.content}" de "${fromColumn}" para "${toColumn}"`
    );
    // TODO: Update application step via API
  };

  if (loading) return <div className="container mt-5">Carregando...</div>;
  if (error) return <div className="container mt-5 text-danger">{error}</div>;

  const handleRegisterTalent = async () => {
    try {
      await axios.post(`/api/selection-processes/${processId}/applications`, {
        talent_id: selectedTalentId
      });
      alert('Talento registrado com sucesso!');
      setShowRegisterModal(false);
      setSelectedTalentId(null);

      // Optionally refresh applications after registration
      const appsResponse = await axios.get(`/api/selection-processes/${processId}/applications`);
      setApplications(appsResponse.data);
    } catch (err) {
      setError('Falha ao registrar o talento.');
      console.error(err);
    }
  };

  return (
    <div className="d-flex flex-column h-100">
      <h2>Candidaturas no Processo Seletivo</h2>
      {selectionProcess && (
        <p className={homeStyles['subtitle']}>
          {selectionProcess.description}
        </p>
      )}

      {/* Register Talent Button */}
      <Button
        variant="success"
        onClick={() => setShowRegisterModal(true)}
        className="mt-3 mb-4"
      >
        Registrar Talentos
      </Button>

      <div className="flex-grow-1 overflow-auto">
        <KanbanV2
          columns={applicationSteps}
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
                subtext="Detalhes da candidatura"
                onClick={() => console.log("View details for", id)}
                onEdit={() => alert('Editar candidatura')}
                onViewDetails={() => alert('Ver detalhes')}
              />
            );
          }}
        />
      </div>

      {/* Register Talent Modal */}
      <Modal
        show={showRegisterModal}
        onHide={() => {
          setShowRegisterModal(false);
          setSelectedTalentId(null);
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Registrar Talento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formSelectTalent" className="mb-3">
            <Form.Label>Selecione um talento:</Form.Label>
            <Form.Select
              value={selectedTalentId || ''}
              onChange={(e) => setSelectedTalentId(e.target.value)}
            >
              <option value="">-- Selecione --</option>
              {talents.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowRegisterModal(false);
              setSelectedTalentId(null);
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="success"
            disabled={!selectedTalentId}
            onClick={handleRegisterTalent}
          >
            Registrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
