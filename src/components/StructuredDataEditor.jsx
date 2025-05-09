import React, { useState } from 'react';
import { HiPlus } from 'react-icons/hi';
import { Pencil } from 'react-bootstrap-icons';
import { Modal, Button } from 'react-bootstrap';

export default function StructuredDataEditor({ 
  label, 
  entries = [], 
  onEntriesChange,
  onDelete
}) {
  const [editingEntry, setEditingEntry] = useState('');
  const [addEntry, setAddEntry] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const handleAdd = () => {
    if (addEntry.trim()) {
      onEntriesChange([...entries, addEntry]);
      setAddEntry('');
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditingEntry(entries[index]);
  };

  const handleSave = (e) => {
    e.preventDefault(); // Prevent form submission
    const updatedEntries = [...entries];
    updatedEntries[editingIndex] = editingEntry;
    onEntriesChange(updatedEntries);
    setEditingIndex(null);
    setEditingEntry('');
  };

  const handleDelete = (index) => {
    setDeleteIndex(index);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (deleteIndex !== null && onDelete) {
      onDelete(deleteIndex);
      setShowDeleteModal(false);
      setDeleteIndex(null);
    }
  };

  return (
    <div className="mb-4">
      <h5 className="mb-3">{label}</h5>
      {entries.map((entry, index) => (
        <div key={index} className="mb-2 p-2 border rounded">
          {editingIndex === index ? (
            <>
              <input
                type="text"
                value={editingEntry}
                onChange={(e) => setEditingEntry(e.target.value)}
                className="form-control mb-2"
              />
              <div className="d-flex">
                <button 
                  onClick={handleSave} 
                  className="btn btn-primary me-2"
                  type="button"
                >
                  Salvar
                </button>
                <button 
                  onClick={() => setEditingIndex(null)} 
                  className="btn btn-secondary me-2"
                  type="button"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => handleDelete(index)} 
                  className="btn btn-sm btn-outline-danger ms-auto"
                  type="button"
                >
                  Excluir
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="d-flex justify-content-end">
                <p className="mb-1 flex-grow-1">{entry || 'N/A'}</p>
                <button 
                  onClick={() => handleEdit(index)} 
                  className="btn btn-sm btn-outline-primary ms-2"
                >
                  <Pencil />
                </button>
              </div>
            </>
          )}
        </div>
      ))}

      <div className="mt-3">
        <div className="d-flex justify-content-end">
          <input
            type="text"
            value={addEntry}
            onChange={(e) => setAddEntry(e.target.value)}
            placeholder="Digite um novo item"
            className="form-control mb-2 me-2"
          />
          <button 
            onClick={handleAdd} 
            className="btn btn-success"
            type="button"
          >
            <HiPlus />
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Excluir Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tem certeza que deseja excluir este item?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Excluir
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
