// src/components/Footer.jsx
// Displays the application footer with safety disclaimer and team credits.

// Icons come from lucide-react. Each icon is a React component; size and color are props.
import { ShieldCheck } from 'lucide-react';

function Footer() {
  return (
    <footer className="canvas-footer">
      <div className="footer-health-notice">
        <ShieldCheck size={16} />
        <span>Always consult your physician before altering prescribed dosages.</span>
      </div>
      <p>MediRemind Digital Tracker &bull; Powered by React &amp; Supabase</p>
    </footer>
  );
}

export default Footer;
