import React from "react";
import { Card, Row, Col, Dropdown } from "react-bootstrap";
import { GearFill } from "react-bootstrap-icons";
import styles from '../components/KanbanV2.module.css';

export default function CustomCard({ text, subtext, onClick, onEdit, onViewDetails }) {
  return (
    <Card 
      className={`${styles['custom-kanban-card']} mt-2`}
      style={{ cursor: 'pointer' }}
      onClick={onClick}
    >
      <Card.Body>
        <Row className="align-items-center">
          <Col>
            <h6 className="card-title" style={{ marginBottom: 0 }}>{text}</h6>
            <hr />
            <div className="d-flex justify-content-between align-items-center">
              <small>{subtext}</small>
              <Dropdown drop="end" autoClose="outside">
                <Dropdown.Toggle
                  variant="light"
                  size="sm"
                  id="dropdown-basic"
                  className="dropdown"
                >
                  <GearFill />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {onEdit && (
                    <Dropdown.Item onClick={onEdit}>Editar</Dropdown.Item>
                  )}
                  {onViewDetails && (
                    <Dropdown.Item onClick={onViewDetails}>Detalhes</Dropdown.Item>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}
