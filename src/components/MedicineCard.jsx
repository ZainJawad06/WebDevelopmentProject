// src/components/MedicineCard.jsx
// Displays a pastel-styled medicine card featuring stock tracking progress and intake action.

// Icons come from lucide-react. Each icon is a React component; size and color are props.
import { Bookmark, Check, RotateCcw, Package } from 'lucide-react';

function MedicineCard(props) {
  const medicine = props.medicine;
  const index = props.index;
  const onToggleTaken = props.onToggleTaken;

  // Cycle through the reference image's pastel color themes
  const colorThemes = ['card-theme-yellow', 'card-theme-purple', 'card-theme-blue'];
  const themeClass = colorThemes[index % colorThemes.length];

  // Stock tracking calculations (fallback to safe defaults if not provided)
  const currentStock = medicine.stock !== undefined && medicine.stock !== null ? Number(medicine.stock) : 15;
  const totalStock = 30;
  const stockPercentage = Math.min(100, Math.max(0, Math.round((currentStock / totalStock) * 100)));
  const isLowStock = currentStock <= 5;

  // Handles clicking the take dose / undo button
  function handleActionClick() {
    onToggleTaken(medicine.id, medicine.is_taken, currentStock);
  }

  return (
    <div className={`prescription-card ${themeClass}`}>
      <div className="card-top-bar">
        <span className="card-tag">
          <Package size={12} />
          <span>{medicine.scheduled_time || 'Daily'}</span>
        </span>
        <Bookmark size={18} className="card-bookmark-icon" />
      </div>

      <h3 className="card-medicine-title">{medicine.name}</h3>
      <p className="card-dosage-text">{medicine.dosage}</p>

      <div className="card-stock-section">
        <div className="stock-label-row">
          <span>Stock Level</span>
          <span>{currentStock} / {totalStock} doses</span>
        </div>
        <div className="progress-track">
          <div
            className={`progress-fill ${isLowStock ? 'low-stock' : ''}`}
            style={{ width: `${stockPercentage}%` }}
          />
        </div>
      </div>

      <div className="card-bottom-row">
        <span className="stock-pill-badge">
          {isLowStock ? 'Low Stock!' : `${currentStock} left`}
        </span>

        <button
          type="button"
          className={`btn-continue ${medicine.is_taken ? 'completed' : ''}`}
          onClick={handleActionClick}
        >
          {medicine.is_taken ? (
            <>
              <RotateCcw size={13} />
              <span>Undo</span>
            </>
          ) : (
            <>
              <Check size={13} />
              <span>Take Dose</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default MedicineCard;
