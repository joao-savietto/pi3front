import PropTypes from 'prop-types';
import { Card, Row, Col, Dropdown } from "react-bootstrap";
import { GearFill } from "react-bootstrap-icons";
import styles from '../components/KanbanV2.module.css';
import { useState } from 'react';

export default function CustomCard({ text, subtext, onEdit, onViewDetails, onDelete }) {
  CustomCard.propTypes = {
    text: PropTypes.string.isRequired,
    subtext: PropTypes.string.isRequired,
    onEdit: PropTypes.func,
    onViewDetails: PropTypes.func,
    onDelete: PropTypes.func
  };

  const [open, setOpen] = useState(false);

  const handleToggle = (nextOpen) => {
    setOpen(nextOpen);
  };

  const handleDropdownItemClick = (callback) => {
    setOpen(false); // Fecha o dropdown ao clicar em um item
    callback();
  };

  return (
    <Card 
      className={`${styles['custom-kanban-card']} mt-2`}
      style={{ cursor: 'grab' }}
    >
      <Card.Body>
        <Row className="align-items-center">
          <Col>
            <h6 className="card-title" style={{ marginBottom: 0 }}>{text}</h6>
            <hr />
            <div className="d-flex justify-content-between align-items-center">
              <small>{subtext}</small>
              <Dropdown 
                drop="down" 
                autoClose="outside"
                show={open} 
                onToggle={handleToggle}
              >
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
                    <Dropdown.Item onClick={() => handleDropdownItemClick(onEdit)}>Editar</Dropdown.Item>
                  )}
                  {onViewDetails && (
                    <Dropdown.Item onClick={() => handleDropdownItemClick(onViewDetails)}>Detalhes</Dropdown.Item>
                  )}
                  {onDelete && (
                    <Dropdown.Item onClick={() => handleDropdownItemClick(onDelete)}>Excluir</Dropdown.Item>
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
