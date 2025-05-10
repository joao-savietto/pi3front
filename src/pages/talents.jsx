import React, { useState, useEffect } from 'react';
import { Table, Form, Button, Container, Row, Col, Modal, Alert } from 'react-bootstrap';
import useAxios from '../services/hooks/useAxios';
import StructuredDataEditor from '../components/StructuredDataEditor';

export default function TalentManagementPage() {
  const axios = useAxios();
  const [talents, setTalents] = useState([]);
  const [filteredTalents, setFilteredTalents] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedTalent, setSelectedTalent] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTalent, setNewTalent] = useState({
    name: '',
    contacts: '',
    about: '',
    experiences: [],
    educations: [],
    interests: [],
    accomplishments: [],
    linkedin: ''
  });

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
    const date = new Date(dateString);
    if (isNaN(date)) {
      return 'Invalid Date';
    }
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

  // Handle form input changes for adding a new talent
  const handleAddInputChange = (e) => {
    const { name, value } = e.target;
    setNewTalent({
      ...newTalent,
      [name]: value
    });
  };

  // Submit the new talent form
  const handleSubmitAdd = async () => {
    try {
      // Check if all fields are empty
      const isEmpty = Object.values(newTalent).every(
        (value) => !value.trim()
      );

      if (isEmpty) {
        alert('Por favor, preencha ao menos um campo.');
        return;
      }

      // Convert structured data to JSON strings
      const payload = {
        ...newTalent,
        experiences: newTalent.experiences || [],
        educations: newTalent.educations || [],
        interests: newTalent.interests || [],
        accomplishments: newTalent.accomplishments || [],
      };

      await axios.post('/api/applicants/', payload);
      setTalents([...talents, { ...newTalent, id: Date.now() }]);
      setFilteredTalents([...filteredTalents, { ...newTalent, id: Date.now() }]);
      setShowAddModal(false);
      setNewTalent({
        name: '',
        contacts: '',
        about: '',
        experiences: [],
        educations: [],
        interests: [],
        accomplishments: [],
        linkedin: ''
      });
    } catch (err) {
      setError('Falha ao adicionar o talento. Por favor, tente novamente.');
      console.error(err);
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

      {/* Add Talent Button */}
      <div className="d-flex justify-content-end mt-3">
        <Button variant="success" onClick={() => setShowAddModal(true)}>
          Adicionar Talentos
        </Button>
      </div>

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
              <td>{talent.created_at ? formatDate(talent.created_at) : 'N/A'}</td>
              <td>{talent.updated_at ? formatDate(talent.updated_at) : 'N/A'}</td>
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

      {/* View Talent Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedTalent?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTalent && (
            <div>
              <p><strong>Sobre:</strong> {selectedTalent.about}</p>
              <p><strong>Contatos:</strong> {selectedTalent.contacts}</p>
              <p><strong>LinkedIn:</strong> {selectedTalent.linkedin || 'N/A'}</p>
              <p><strong>Criado Em:</strong> {formatDate(selectedTalent.created_at)}</p>
              <p><strong>Atualizado Em:</strong> {formatDate(selectedTalent.updated_at)}</p>

              {/* Experiences */}
              <h5>Experiências</h5>
              {selectedTalent.experiences?.length > 0 ? (
                <ul>
                  {selectedTalent.experiences.map((exp, i) => (
                    <li key={i}>{exp}</li>
                  ))}
                </ul>
              ) : (
                <p>Nenhuma experiência registrada</p>
              )}

              {/* Educations */}
              <h5>Educação</h5>
              {selectedTalent.educations?.length > 0 ? (
                <ul>
                  {selectedTalent.educations.map((edu, i) => (
                    <li key={i}>{edu}</li>
                  ))}
                </ul>
              ) : (
                <p>Nenhuma educação registrada</p>
              )}

              {/* Interests */}
              <h5>Interesses</h5>
              {selectedTalent.interests?.length > 0 ? (
                <ul>
                  {selectedTalent.interests.map((int, i) => (
                    <li key={i}>{int}</li>
                  ))}
                </ul>
              ) : (
                <p>Nenhum interesse registrado</p>
              )}

              {/* Accomplishments */}
              <h5>Conquistas</h5>
              {selectedTalent.accomplishments?.length > 0 ? (
                <ul>
                  {selectedTalent.accomplishments.map((acc, i) => (
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

      {/* Add Talent Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Adicionar Novo Talentos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formName" className="mb-3">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newTalent.name}
                onChange={handleAddInputChange}
                placeholder="Digite o nome do talento"
              />
            </Form.Group>

            <Form.Group controlId="formContacts" className="mb-3">
              <Form.Label>Contatos</Form.Label>
              <Form.Control
                type="text"
                name="contacts"
                value={newTalent.contacts}
                onChange={handleAddInputChange}
                placeholder="Digite os contatos do talento"
              />
            </Form.Group>

            <Form.Group controlId="formAbout" className="mb-3">
              <Form.Label>Sobre</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="about"
                value={newTalent.about}
                onChange={handleAddInputChange}
                placeholder="Digite uma breve descrição do talento"
              />
            </Form.Group>

            {/* Experiences */}
            <StructuredDataEditor
              label="Experiências"
              entries={newTalent.experiences || []}
              onEntriesChange={(updated) =>
                setNewTalent({ ...newTalent, experiences: updated })
              }
              onDelete={(index) => {
                const updated = [...newTalent.experiences];
                updated.splice(index, 1);
                setNewTalent({ ...newTalent, experiences: updated });
              }}
            />

            {/* Educations */}
            <StructuredDataEditor
              label="Educação"
              entries={newTalent.educations || []}
              onEntriesChange={(updated) =>
                setNewTalent({ ...newTalent, educations: updated })
              }
              onDelete={(index) => {
                const updated = [...newTalent.educations];
                updated.splice(index, 1);
                setNewTalent({ ...newTalent, educations: updated });
              }}
            />

            {/* Interests */}
            <StructuredDataEditor
              label="Interesses"
              entries={newTalent.interests || []}
              onEntriesChange={(updated) =>
                setNewTalent({ ...newTalent, interests: updated })
              }
              onDelete={(index) => {
                const updated = [...newTalent.interests];
                updated.splice(index, 1);
                setNewTalent({ ...newTalent, interests: updated });
              }}
            />

            {/* Accomplishments */}
            <StructuredDataEditor
              label="Conquistas"
              entries={newTalent.accomplishments || []}
              onEntriesChange={(updated) =>
                setNewTalent({ ...newTalent, accomplishments: updated })
              }
              onDelete={(index) => {
                const updated = [...newTalent.accomplishments];
                updated.splice(index, 1);
                setNewTalent({ ...newTalent, accomplishments: updated });
              }}
            />

            <Form.Group controlId="formLinkedin" className="mb-3">
              <Form.Label>LinkedIn</Form.Label>
              <Form.Control
                type="text"
                name="linkedin"
                value={newTalent.linkedin}
                onChange={handleAddInputChange}
                placeholder="Digite o link do LinkedIn"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancelar
          </Button>
          <Button variant="success" onClick={handleSubmitAdd}>
            Adicionar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
