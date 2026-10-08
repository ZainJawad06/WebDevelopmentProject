// src/components/Sidebar.jsx
// Interactive sidebar navigation allowing patients to switch between dashboard sections.

// Icons come from lucide-react. Each icon is a React component; size and color are props.
import { LayoutGrid, Pill, CalendarCheck, Package, Bookmark, Headphones, Settings, LogOut } from 'lucide-react';

function Sidebar(props) {
  const activeSection = props.activeSection;
  const onSectionChange = props.onSectionChange;

  return (
    <aside className="sidebar">
      <div className="sidebar-menu">
        <button
          type="button"
          className={`sidebar-btn ${activeSection === 'dashboard' ? 'active' : ''}`}
          onClick={() => onSectionChange('dashboard')}
          title="Overview Dashboard"
        >
          <LayoutGrid size={20} />
        </button>

        <button
          type="button"
          className={`sidebar-btn ${activeSection === 'prescriptions' ? 'active' : ''}`}
          onClick={() => onSectionChange('prescriptions')}
          title="My Prescriptions"
        >
          <Pill size={20} />
        </button>

        <button
          type="button"
          className={`sidebar-btn ${activeSection === 'schedule' ? 'active' : ''}`}
          onClick={() => onSectionChange('schedule')}
          title="Intake Schedule"
        >
          <CalendarCheck size={20} />
        </button>

        <button
          type="button"
          className={`sidebar-btn ${activeSection === 'stock' ? 'active' : ''}`}
          onClick={() => onSectionChange('stock')}
          title="Stock & Inventory"
        >
          <Package size={20} />
        </button>

        <button
          type="button"
          className={`sidebar-btn ${activeSection === 'saved' ? 'active' : ''}`}
          onClick={() => onSectionChange('saved')}
          title="Saved Medicines"
        >
          <Bookmark size={20} />
        </button>
      </div>

      <div className="sidebar-footer">
        <button
          type="button"
          className="sidebar-btn"
          title="Support & Help"
          onClick={() => alert('MediRemind 24/7 Patient Assistance')}
        >
          <Headphones size={20} />
        </button>
        <button
          type="button"
          className="sidebar-btn"
          title="Settings"
          onClick={() => alert('Settings: Notification & reminder preferences')}
        >
          <Settings size={20} />
        </button>
        <button
          type="button"
          className="sidebar-btn"
          title="Reset / Logout"
          onClick={() => {
            const confirmReset = window.confirm('Reload schedule?');
            if (confirmReset) window.location.reload();
          }}
        >
          <LogOut size={20} />
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
