import React, { useState } from 'react';
import { HiPlus } from 'react-icons/hi';
import { Pencil } from 'react-bootstrap-icons';

export default function StructuredDataEditor({ 
  label, 
  entries = [], 
  onEntriesChange,
  onDelete
}) {
  const [editingEntry, setEditingEntry] = useState('');
  const [addEntry, setAddEntry] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);

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
    if (window.confirm('Tem certeza que deseja excluir este item?')) {
      onDelete(index);
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
              <button 
                onClick={handleSave} 
                className="btn btn-primary me-2"
                type="button"
              >
                Salvar
              </button>
              <button 
                onClick={() => handleDelete(index)} 
                className="btn btn-sm btn-outline-danger me-2"
                type="button"
              >
                Excluir
              </button>
              <button 
                onClick={() => setEditingIndex(null)} 
                className="btn btn-secondary"
                type="button"
              >
                Cancelar
              </button>
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
    </div>
  );
}
