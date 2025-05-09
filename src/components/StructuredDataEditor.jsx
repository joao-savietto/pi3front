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
    <div>
      <h5>{label}</h5>
      {entries.map((entry, index) => (
        <div key={index} className="mb-2 p-2 border rounded">
          {editingIndex === index ? (
            <>
              <input
                type="text"
                value={newEntry}
                onChange={(e) => setNewEntry(e.target.value)}
              />
              <button onClick={handleSave}>Save</button>
              <button onClick={() => setEditingIndex(null)}>Cancel</button>
            </>
          ) : (
            <>
              <p>{entry || 'N/A'}</p>
              <button onClick={() => handleEdit(index)}>Edit</button>
            </>
          )}
        </div>
      ))}

      <div className="mt-3">
        <h6>Add New Entry</h6>
        <input
          type="text"
          value={newEntry}
          onChange={(e) => setNewEntry(e.target.value)}
          placeholder="Enter a new entry"
        />
        <button onClick={handleAdd}>Add</button>
      </div>
    </div>
  );
}
