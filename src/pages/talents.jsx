import React, { useState, useEffect } from 'react';
import { Table, Form, Button, Container, Row, Col, Modal, Alert } from 'react-bootstrap';
import useAxios from '../services/hooks/useAxios';

export default function TalentManagementPage() {
  const axios = useAxios();
  const [talents, setTalents] = useState([]);
  const [filteredTalents, setFilteredTalents] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedTalent, setSelectedTalent] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch talents from API
  useEffect(() => {
    const fetchTalents = async () => {
      try {
        const response = await axios.get('/api/applicants/');
        setTalents(response.data.results || response.data);
        setFilteredTalents(response.data.results || response.data);
      } catch (err) {
        setError('Falha ao carregar os talentos. Por favor, tente novamente mais tarde.');
        console.error(err);
      }
    };

    fetchTalents();
  }, [axios]);

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    });
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Apply filter on Enter key or button click
  const applyFilter = () => {
    if (searchQuery.trim() === '') {
      setFilteredTalents(talents);
    } else {
      const filtered = talents.filter(talent =>
        talent.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTalents(filtered);
    }
  };

  // Handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      applyFilter();
    }
  };

  // Handle delete confirmation
  const handleDeleteClick = (talent) => {
    setSelectedTalent(talent);
    setDeleteId(talent.id);
  };

  // Confirm deletion
  const confirmDelete = async () => {
    try {
      await axios.delete(`/api/applicants/${deleteId}/`);
      setTalents(talents.filter(talent => talent.id !== deleteId));
      setFilteredTalents(filteredTalents.filter(talent => talent.id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      setError('Falha ao excluir o talento. Por favor, tente novamente.');
      console.error(err);
      setDeleteId(null);
    }
  };

  return (
    <Container className="mt-4">
      {error && <Alert variant="danger">{error}</Alert>}
      
      <h2>Gestão de Talentos</h2>
      
      {/* Search and Filters */}
      <Row className="mb-3">
        <Col md={9}>
          <Form.Control
            type="text"
            placeholder="Pesquisar por nome..."
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
          />
        </Col>
        <Col md={3}>
          <Button variant="primary" onClick={applyFilter}>
            Aplicar Filtros
          </Button>
        </Col>
      </Row>

      {/* Table */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Contatos</th>
            <th>Sobre</th>
            <th>Criado Em</th>
            <th>Atualizado Em</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredTalents.map(talent => (
            <tr key={talent.id}>
              <td>{talent.name}</td>
              <td>{talent.contacts || 'N/A'}</td>
              <td>{talent.about || 'Nenhuma descrição disponível'}</td>
              <td>{formatDate(talent.created_at)}</td>
              <td>{formatDate(talent.updated_at)}</td>
              <td>
                <Button 
                  variant="outline-secondary" 
                  size="sm"
                  onClick={() => {
                    setSelectedTalent(talent);
                    setShowModal(true);
                  }}
                >
                  Ver
                </Button>
                <Button 
                  variant="outline-danger" 
                  size="sm" 
                  className="ms-2"
                  onClick={() => handleDeleteClick(talent)}
                >
                  Excluir
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Add Talent Button */}
      <div className="d-flex justify-content-end mt-3">
        <Button variant="success" onClick={() => alert('Funcionalidade de adicionar talento em breve')}>
          Adicionar Talentos
        </Button>
      </div>

      {/* View Talent Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedTalent?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTalent && (
            <div>
              <p><strong>Sobre:</strong> {selectedTalent.about}</p>
              <p><strong>Experiências:</strong> {selectedTalent.experiences}</p>
              <p><strong>Educação:</strong> {selectedTalent.educations}</p>
              <p><strong>Interesses:</strong> {selectedTalent.interests}</p>
              <p><strong>Conquistas:</strong> {selectedTalent.accomplishments}</p>
              <p><strong>Contatos:</strong> {selectedTalent.contacts}</p>
              <p><strong>Criado Em:</strong> {formatDate(selectedTalent.created_at)}</p>
              <p><strong>Atualizado Em:</strong> {formatDate(selectedTalent.updated_at)}</p>
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={!!deleteId} onHide={() => setDeleteId(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Excluir Talentos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Tem certeza que deseja excluir este talento?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDeleteId(null)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Confirmar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
