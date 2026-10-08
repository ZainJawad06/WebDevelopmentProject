// src/components/MedicineForm.jsx
// Dark card panel allowing patients to enter specific medicine details and starting stock quantities.

import { useState } from 'react';
// Icons come from lucide-react. Each icon is a React component; size and color are props.
import { PlusCircle } from 'lucide-react';

function MedicineForm(props) {
  const onAddMedicine = props.onAddMedicine;
  const isSubmitting = props.isSubmitting;

  const [medicineName, setMedicineName] = useState('');
  const [dosage, setDosage] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [stockCount, setStockCount] = useState(30);
  const [notes, setNotes] = useState('');

  // Handles form submission for adding a custom medicine with inventory
  function handleSubmit(event) {
    event.preventDefault();

    if (!medicineName.trim() || !dosage.trim() || !scheduledTime) {
      alert('Please fill in medicine name, dosage, and scheduled time.');
      return;
    }

    const newMedicineData = {
      name: medicineName.trim(),
      dosage: dosage.trim(),
      scheduled_time: scheduledTime,
      stock: Number(stockCount) > 0 ? Number(stockCount) : 10,
      notes: notes.trim(),
      is_taken: false,
    };

    onAddMedicine(newMedicineData);

    // Reset inputs back to clean defaults
    setMedicineName('');
    setDosage('');
    setScheduledTime('');
    setStockCount(30);
    setNotes('');
  }

  return (
    <div className="dark-form-panel">
      <div>
        <span className="dark-card-tag">Stock &amp; Inventory</span>
        <h3 className="dark-card-title">Add Your Specific Medicine</h3>

        <form className="dark-form-fields" onSubmit={handleSubmit}>
          <input
            className="dark-input"
            type="text"
            placeholder="Medicine name (e.g. Paracetamol)"
            value={medicineName}
            onChange={(e) => setMedicineName(e.target.value)}
            required
          />

          <input
            className="dark-input"
            type="text"
            placeholder="Dosage (e.g. 500mg, 1 tablet)"
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
            required
          />

          <div className="dark-input-row">
            <input
              className="dark-input"
              type="time"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              required
            />
            <input
              className="dark-input"
              type="number"
              min="1"
              max="200"
              placeholder="Stock (pills)"
              value={stockCount}
              onChange={(e) => setStockCount(e.target.value)}
              required
            />
          </div>

          <input
            className="dark-input"
            type="text"
            placeholder="Notes (optional, e.g. after food)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <button
            type="submit"
            className="btn-dark-submit"
            disabled={isSubmitting}
          >
            <PlusCircle size={18} />
            <span>{isSubmitting ? 'Saving...' : 'Register Medicine'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}

export default MedicineForm;
