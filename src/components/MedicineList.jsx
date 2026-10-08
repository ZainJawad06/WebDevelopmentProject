// src/components/MedicineList.jsx
// Displays the medication intake schedule list matching the reference bottom-left lessons layout.

// Icons come from lucide-react. Each icon is a React component; size and color are props.
import { Check, Clock, Trash2, Pill, Loader2 } from 'lucide-react';

function MedicineList(props) {
  const medicineList = props.medicineList;
  const isLoading = props.isLoading;
  const onDeleteMedicine = props.onDeleteMedicine;
  const onToggleTaken = props.onToggleTaken;
  const onSwitchToSchedule = props.onSwitchToSchedule;

  // Prompts before deleting a prescription
  function handleDelete(id, name) {
    const shouldDelete = window.confirm(`Remove ${name} from schedule?`);
    if (shouldDelete) {
      onDeleteMedicine(id);
    }
  }

  return (
    <div className="schedule-panel">
      <div className="panel-header-row">
        <h3 className="panel-title">Daily Intake Schedule</h3>
        {onSwitchToSchedule ? (
          <button
            type="button"
            className="panel-subtitle-link"
            style={{ background: 'transparent', border: 'none' }}
            onClick={onSwitchToSchedule}
          >
            View all lessons &bull;
          </button>
        ) : null}
      </div>

      {isLoading ? (
        <div className="state-box">
          <Loader2 size={28} className="state-spinner" />
          <p>Loading schedule...</p>
        </div>
      ) : medicineList.length === 0 ? (
        <div className="state-box">
          <Pill size={32} color="#94a3b8" />
          <p>No medicines scheduled yet. Add your specific prescription on the right.</p>
        </div>
      ) : (
        <div className="schedule-list">
          {medicineList.map((item) => {
            const stockCount = item.stock !== undefined && item.stock !== null ? Number(item.stock) : 15;
            const isLow = stockCount <= 5;

            return (
              <div key={item.id} className="schedule-row">
                <div className="schedule-item-info">
                  <button
                    type="button"
                    className={`schedule-bullet-pill ${item.is_taken ? 'taken' : ''}`}
                    style={{ border: 'none', cursor: 'pointer' }}
                    onClick={() => onToggleTaken && onToggleTaken(item.id, item.is_taken, stockCount)}
                    title={item.is_taken ? 'Mark as pending' : 'Mark as taken'}
                  >
                    {item.is_taken ? <Check size={16} /> : <Clock size={16} />}
                  </button>

                  <div className="schedule-text-details">
                    <span className={`schedule-name ${item.is_taken ? 'strike' : ''}`}>
                      {item.name}
                    </span>
                    <span className="schedule-sub">
                      {item.dosage} {item.notes ? `• ${item.notes}` : ''}
                    </span>
                  </div>
                </div>

                <div className="schedule-meta-right">
                  <span className={`schedule-stock-tag ${isLow ? 'warning' : ''}`}>
                    {isLow ? `Low: ${stockCount} left` : `${stockCount} in stock`}
                  </span>

                  <span className="schedule-time-label">
                    {item.scheduled_time}
                  </span>

                  <button
                    type="button"
                    className="schedule-action-btn"
                    onClick={() => handleDelete(item.id, item.name)}
                    title="Delete reminder"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MedicineList;
