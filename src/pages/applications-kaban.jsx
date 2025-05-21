import { useState, useEffect } from 'react';
import useAxios from '../services/hooks/useAxios';
import KanbanV2 from '../components/KanbanV2';
import CustomCard from '../components/custom-card';
import styles from '../components/KanbanV2.module.css';
import homeStyles from './home.module.css';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useParams } from 'react-router-dom';
import Toast from 'react-bootstrap/Toast';

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

  // Delete confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteCardId, setDeleteCardId] = useState(null);

  // View details modal state
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  // Toast states
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Define application steps (mirroring the Python enum)
  const applicationSteps = [
    { id: 'Hunting', title: 'Caça a Talentos' },
    { id: 'Database', title: 'Banco de Talentos' },
    { id: 'HR Interview', title: 'Entrevista com a RH' },
    { id: 'Leadership Interview', title: 'Entrevista Líder' },
    { id: 'Technical Challenge', title: 'Desafio Técnico' },
    { id: 'Technical Challenge Not Submitted', title: 'Desafio Não Enviado' },
    { id: 'Rejected', title: 'Rejeitado' },
    { id: 'Declined', title: 'Recusado' },
    { id: 'Stand By', title: 'Em Espera' },
    { id: 'Offer Phase', title: 'Fase de Oferta' },
    { id: 'Onboarding', title: 'Onboarding' },
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
      content: `${app.applicant_data.name}`,
      columnId: app.current_step || 'Database',
      is_ended: false // Placeholder; adjust based on actual logic
    }));
  };

  const cards = mapToCards(applications);

  // Handle card movement (step change)
  const handleMoveCard = async (card_id, column_id) => {
    try {
      
      await axios.patch(`/api/applications/${card_id}/`, { current_step: column_id });

      // Refresh data after successful update
      const appsResponse = await axios.get(`/api/selection-processes/${processId}/applications`);
      setApplications(appsResponse.data);
    } catch (err) {
      console.error('Erro ao atualizar etapa da candidatura:', err);
      alert('Falha ao atualizar a etapa da candidatura.');
    }
  };

  // Handle card deletion
  const handleDelete = async (card_id) => {
    try {
      await axios.delete(`/api/applications/${card_id}/`);

      setToastMessage('Candidatura excluída com sucesso!');
      setShowSuccessToast(true);

      // Refresh data after successful deletion
      const appsResponse = await axios.get(`/api/selection-processes/${processId}/applications`);
      setApplications(appsResponse.data);
    } catch (err) {
      console.error('Erro ao excluir candidatura:', err);
      setToastMessage('Falha ao excluir a candidatura.');
      setShowErrorToast(true);
    }
  };

  // Show confirmation modal before deletion
  const handleConfirmDelete = (id) => {
    setDeleteCardId(id);
    setShowDeleteModal(true);
  };

  // Confirm and perform the actual delete action
  const handleDeleteConfirmed = async () => {
    await handleDelete(deleteCardId);
    setShowDeleteModal(false);
  };

  // Cancel deletion confirmation
  const handleCloseDeleteModal = () => {
    setDeleteCardId(null);
    setShowDeleteModal(false);
  };

  // Show view details modal with selected application data
  const handleViewDetails = (id) => {
    const appToView = applications.find(app => app.id === id);
    if (!appToView) return;
    
    setSelectedApplication(appToView);
    setShowDetailsModal(true);
  };

  // Close the view details modal
  const handleCloseDetailsModal = () => {
    setSelectedApplication(null);
    setShowDetailsModal(false);
  };

  // Format date for display (same as in TalentManagementPage)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return 'N/A';
    
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    });
  };

  if (loading) return <div className="container mt-5">Carregando...</div>;
  if (error) return <div className="container mt-5 text-danger">{error}</div>;

  const handleRegisterTalent = async () => {
    try {
      await axios.post('/api/applications/', {
        applicant: selectedTalentId,
        selection_process: processId,
        current_step: 'Database' // Default step
      });
      
      setToastMessage('Talento registrado com sucesso!');
      setShowSuccessToast(true);
      
      setShowRegisterModal(false);
      setSelectedTalentId(null);

      // Optionally refresh applications after registration
      const appsResponse = await axios.get(`/api/selection-processes/${processId}/applications`);
      setApplications(appsResponse.data);
    } catch (err) {
      setError('Falha ao registrar o talento.');
      console.error(err);
      setToastMessage('Falha ao registrar o talento.');
      setShowErrorToast(true);
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
        size="sm" // Added to reduce button width
        onClick={() => setShowRegisterModal(true)}
        className={`mt-3 mb-4 ${homeStyles['custom-button-width']}`} // Now includes custom class
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
            return (
              <CustomCard
                text={content}
                subtext="Detalhes da candidatura"
                onClick={() => handleViewDetails(id)} // Triggers view details modal
                onViewDetails={() => handleViewDetails(id)}
                onDelete={() => handleConfirmDelete(id)} // Triggers confirmation modal
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

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tem certeza de que deseja excluir esta candidatura?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirmed}>
            Excluir
          </Button>
        </Modal.Footer>
      </Modal>

      {/* View Details Modal */}
      <Modal show={showDetailsModal} onHide={handleCloseDetailsModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedApplication?.applicant_data.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedApplication && (
            <div>
              <p><strong>Sobre:</strong> {selectedApplication.applicant_data.about || 'Nenhuma descrição disponível'}</p>
              <p><strong>Contatos:</strong> {selectedApplication.applicant_data.contacts || 'N/A'}</p>
              <p><strong>Criado Em:</strong> {formatDate(selectedApplication.applicant_data.created_at)}</p>
              <p><strong>Atualizado Em:</strong> {formatDate(selectedApplication.applicant_data.updated_at)}</p>

              {/* Experiences */}
              <h5>Experiências</h5>
              {selectedApplication.applicant_data.experiences?.length > 0 ? (
                <ul>
                  {selectedApplication.applicant_data.experiences.map((exp, i) => (
                    <li key={i}>{exp}</li>
                  ))}
                </ul>
              ) : (
                <p>Nenhuma experiência registrada</p>
              )}

              {/* Educations */}
              <h5>Educação</h5>
              {selectedApplication.applicant_data.educations?.length > 0 ? (
                <ul>
                  {selectedApplication.applicant_data.educations.map((edu, i) => (
                    <li key={i}>{edu}</li>
                  ))}
                </ul>
              ) : (
                <p>Nenhuma educação registrada</p>
              )}

              {/* Interests */}
              <h5>Interesses</h5>
              {selectedApplication.applicant_data.interests?.length > 0 ? (
                <ul>
                  {selectedApplication.applicant_data.interests.map((int, i) => (
                    <li key={i}>{int}</li>
                  ))}
                </ul>
              ) : (
                <p>Nenhum interesse registrado</p>
              )}

              {/* Accomplishments */}
              <h5>Conquistas</h5>
              {selectedApplication.applicant_data.accomplishments?.length > 0 ? (
                <ul>
                  {selectedApplication.applicant_data.accomplishments.map((acc, i) => (
                    <li key={i}>{acc}</li>
                  ))}
                </ul>
              ) : (
                <p>Nenhuma conquista registrada</p>
              )}
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Success Toast */}
      <Toast 
        show={showSuccessToast} 
        onClose={() => setShowSuccessToast(false)} 
        autohide 
        delay={3000}
        className="position-fixed bottom-0 end-0 m-3"
      >
        <Toast.Header>
          <strong className="me-auto">Sucesso</strong>
        </Toast.Header>
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast>

      {/* Error Toast */}
      <Toast 
        show={showErrorToast} 
        onClose={() => setShowErrorToast(false)} 
        autohide 
        delay={3000}
        bg="danger"
        className="position-fixed bottom-0 end-0 m-3 text-white"
      >
        <Toast.Header>
          <strong className="me-auto">Erro</strong>
        </Toast.Header>
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast>
    </div>
  );
}
