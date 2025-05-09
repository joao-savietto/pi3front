import React, { useState } from 'react';

export default function StructuredDataEditor({ 
  label, 
  entries = [], 
  onEntriesChange,
}) {
  const [newEntry, setNewEntry] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);

  const handleAdd = () => {
    if (newEntry.trim()) {
      onEntriesChange([...entries, newEntry]);
      setNewEntry('');
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setNewEntry(entries[index]);
  };

  const handleSave = () => {
    const updatedEntries = [...entries];
    updatedEntries[editingIndex] = newEntry;
    onEntriesChange(updatedEntries);
    setEditingIndex(null);
    setNewEntry('');
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
                value={newEntry}
                onChange={(e) => setNewEntry(e.target.value)}
                className="form-control mb-2"
              />
              <button 
                onClick={handleSave} 
                className="btn btn-primary me-2"
              >
                Save
              </button>
              <button 
                onClick={() => setEditingIndex(null)} 
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <p className="mb-1">{entry || 'N/A'}</p>
              <button 
                onClick={() => handleEdit(index)} 
                className="btn btn-sm btn-outline-primary"
              >
                Edit
              </button>
            </>
          )}
        </div>
      ))}

      <div className="mt-3">
        <h6 className="mb-2">Add New Entry</h6>
        <input
          type="text"
          value={newEntry}
          onChange={(e) => setNewEntry(e.target.value)}
          placeholder="Enter a new entry"
          className="form-control mb-2"
        />
        <button 
          onClick={handleAdd} 
          className="btn btn-success"
        >
          Add
        </button>
      </div>
    </div>
  );
}
