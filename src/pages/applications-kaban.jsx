import { useState, useEffect } from 'react';
import useAxios from '../services/hooks/useAxios';
import KanbanV2 from '../components/KanbanV2';
import CustomCard from '../components/custom-card';
import styles from '../components/KanbanV2.module.css';
import homeStyles from './home.module.css';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useNavigate, useParams } from 'react-router-dom';

export default function ApplicationsKanbanPage() {
  const axios = useAxios();
  const [applications, setApplications] = useState([]);
  const [selectionProcess, setSelectionProcess] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define application steps (mirroring the Python enum)
  const applicationSteps = [
    { id: 'HR_INTERVIEW', title: 'Entrevista com a RH' },
    { id: 'TECHNICAL_CHALLENGE', title: 'Desafio Técnico' },
    { id: 'LEADERSHIP_INTERVIEW', title: 'Entrevista Líder' },
    { id: 'TECHNICAL_CHALLENGE_NOT_SUBMITTED', title: 'Desafio Não Enviado' },
    { id: 'REJECTED', title: 'Rejeitado' },
    { id: 'DECLINED', title: 'Recusado' },
    { id: 'OFFER_PHASE', title: 'Fase de Oferta' },
    { id: 'ONBOARDING', title: 'Onboarding' },
    { id: 'HUNTING', title: 'Caça a Talentos' },
    { id: 'DATABASE', title: 'Banco de Dados' },
    { id: 'STAND_BY', title: 'Em Espera' }
  ];

  // Fetch applications and selection process for the given selection process
  const { processId } = useParams();
  useEffect(() => {
    if (!axios || !processId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        
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

  return (
    <div className="d-flex flex-column h-100">
      <h2>Candidaturas no Processo Seletivo</h2>
      {selectionProcess && (
        <p className={homeStyles['subtitle']}>
          {selectionProcess.description}
        </p>
      )}
      
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
    </div>
  );
}
