// src/components/Navbar.jsx
// Displays the top dashboard navigation bar with personalized greeting, search bar, and patient profile.

// Icons come from lucide-react. Each icon is a React component; size and color are props.
import { Search, Bell } from 'lucide-react';

function Navbar(props) {
  const searchQuery = props.searchQuery;
  const onSearchChange = props.onSearchChange;

  return (
    <header className="top-navbar">
      <div className="nav-brand">
        Welcome to <span>MediRemind</span>
      </div>

      <div className="nav-search-wrap">
        <input
          type="text"
          className="nav-search-input"
          placeholder="Search your medicines..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <button type="button" className="nav-search-btn" title="Search">
          <Search size={15} />
        </button>
      </div>

      <div className="nav-user-group">
        <button type="button" className="nav-bell-btn" title="Notifications">
          <Bell size={18} />
          <span className="nav-bell-dot"></span>
        </button>

        <div className="nav-profile">
          <div className="nav-avatar">SJ</div>
          <div className="nav-profile-text">
            <span className="nav-profile-name">Sarah Jenkins</span>
            <span className="nav-profile-role">Patient Portal</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
