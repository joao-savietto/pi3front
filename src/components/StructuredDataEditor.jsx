import React, { useState } from 'react';

export default function StructuredDataEditor({ 
  label, 
  entries = [], 
  onEntriesChange, 
  fieldConfig = {} // e.g., { company: "Company", role: "Role" }
}) {
  const [newEntry, setNewEntry] = useState({});
  const [editingIndex, setEditingIndex] = useState(null);

  const handleAdd = () => {
    if (Object.values(newEntry).some(val => val.trim())) {
      onEntriesChange([...entries, { ...newEntry }]);
      setNewEntry({});
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setNewEntry(entries[index]);
  };

  const handleUpdate = (e) => {
    const { name, value } = e.target;
    setNewEntry({ ...newEntry, [name]: value });
  };

  const handleSave = () => {
    const updatedEntries = [...entries];
    updatedEntries[editingIndex] = newEntry;
    onEntriesChange(updatedEntries);
    setEditingIndex(null);
    setNewEntry({});
  };

  return (
    <div>
      <h5>{label}</h5>
      {entries.map((entry, index) => (
        <div key={index} className="mb-2 p-2 border rounded">
          {editingIndex === index ? (
            <>
              {Object.entries(fieldConfig).map(([key, label]) => (
                <div key={key} className="mb-1">
                  <label>{label}</label>
                  <input
                    type="text"
                    name={key}
                    value={newEntry[key] || ''}
                    onChange={handleUpdate}
                  />
                </div>
              ))}
              <button onClick={handleSave}>Save</button>
              <button onClick={() => setEditingIndex(null)}>Cancel</button>
            </>
          ) : (
            <>
              {Object.entries(fieldConfig).map(([key, label]) => (
                <p key={key}>
                  <strong>{label}:</strong> {entry[key] || 'N/A'}
                </p>
              ))}
              <button onClick={() => handleEdit(index)}>Edit</button>
            </>
          )}
        </div>
      ))}

      <div className="mt-3">
        <h6>Add New Entry</h6>
        {Object.entries(fieldConfig).map(([key, label]) => (
          <div key={key} className="mb-1">
            <label>{label}</label>
            <input
              type="text"
              name={key}
              value={newEntry[key] || ''}
              onChange={handleUpdate}
            />
          </div>
        ))}
        <button onClick={handleAdd}>Add</button>
      </div>
    </div>
  );
}
