import React, { useState, useEffect } from 'react';
import { Table, Form, Button, Container, Row, Col, Modal, Alert } from 'react-bootstrap';
import { useAxios } from '../services/hooks/useAxios';

export default function TalentManagementPage() {
  const axios = useAxios();
  const [talents, setTalents] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedTalent, setSelectedTalent] = useState(null);

  // Fetch talents from API
  useEffect(() => {
    const fetchTalents = async () => {
      try {
        const response = await axios.get('/api/talents/');
        setTalents(response.data.results || response.data);
      } catch (err) {
        setError('Failed to load talents. Please try again later.');
        console.error(err);
      }
    };

    fetchTalents();
  }, [axios]);

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    });
  };

  return (
    <Container className="mt-4">
      {error && <Alert variant="danger">{error}</Alert>}
      
      <h2>Talent Management</h2>
      
      {/* Search and Filters */}
      <Row className="mb-3">
        <Col md={6}>
          <Form.Control type="text" placeholder="Search by name..." />
        </Col>
        <Col md={3}>
          <Form.Select>
            <option>Status</option>
            <option>Available</option>
            <option>On Hold</option>
            <option>Rejected</option>
          </Form.Select>
        </Col>
        <Col md={3}>
          <Button variant="primary">Apply Filters</Button>
        </Col>
      </Row>

      {/* Table */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Contacts</th>
            <th>About</th>
            <th>Created At</th>
            <th>Updated At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {talents.map(talent => (
            <tr key={talent.id}>
              <td>{talent.name}</td>
              <td>{talent.contacts || 'N/A'}</td>
              <td>{talent.about || 'No description available'}</td>
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
                  View
                </Button>
                <Button 
                  variant="outline-danger" 
                  size="sm" 
                  className="ms-2"
                  onClick={() => alert(`Delete talent ${talent.name}`)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Add Talent Button */}
      <div className="d-flex justify-content-end mt-3">
        <Button variant="success" onClick={() => alert('Add talent functionality coming soon')}>
          Add Talent
        </Button>
      </div>

      {/* View Talent Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedTalent?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTalent && (
            <div>
              <p><strong>About:</strong> {selectedTalent.about}</p>
              <p><strong>Experiences:</strong> {selectedTalent.experiences}</p>
              <p><strong>Educations:</strong> {selectedTalent.educations}</p>
              <p><strong>Interests:</strong> {selectedTalent.interests}</p>
              <p><strong>Accomplishments:</strong> {selectedTalent.accomplishments}</p>
              <p><strong>Contacts:</strong> {selectedTalent.contacts}</p>
              <p><strong>Created At:</strong> {formatDate(selectedTalent.created_at)}</p>
              <p><strong>Updated At:</strong> {formatDate(selectedTalent.updated_at)}</p>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
}
