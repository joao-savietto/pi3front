import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import styles from '../components/KanbanV2.module.css';

export default function CustomCard({text, subtext, onClick}) {
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
            <hr/>
            <small className="sub-text" style={{ marginTop: 0 }}>{subtext}</small>
          </Col>          
        </Row>
      </Card.Body>
    </Card>
  );
};
