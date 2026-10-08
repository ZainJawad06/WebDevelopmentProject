// src/components/Sidebar.jsx
// Renders the slim dark sidebar navigation with icon buttons matching the tablet dashboard aesthetic.

// Icons come from lucide-react. Each icon is a React component; size and color are props.
import { LayoutGrid, Pill, CalendarCheck, Clock, Bookmark, Headphones, Settings, LogOut } from 'lucide-react';

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-menu">
        <button type="button" className="sidebar-btn" title="Dashboard">
          <LayoutGrid size={20} />
        </button>
        <button type="button" className="sidebar-btn active" title="Prescriptions">
          <Pill size={20} />
        </button>
        <button type="button" className="sidebar-btn" title="Intake Schedule">
          <CalendarCheck size={20} />
        </button>
        <button type="button" className="sidebar-btn" title="Timers">
          <Clock size={20} />
        </button>
        <button type="button" className="sidebar-btn" title="Saved Prescriptions">
          <Bookmark size={20} />
        </button>
      </div>

      <div className="sidebar-footer">
        <button type="button" className="sidebar-btn" title="Support">
          <Headphones size={20} />
        </button>
        <button type="button" className="sidebar-btn" title="Settings">
          <Settings size={20} />
        </button>
        <button type="button" className="sidebar-btn" title="Exit">
          <LogOut size={20} />
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
