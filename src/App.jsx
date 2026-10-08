// src/App.jsx
// Main application component managing state, Supabase queries, and dashboard layout.

import { useState, useEffect } from 'react';
// Icons come from lucide-react. Each icon is a React component; size and color are props.
import { CheckCircle2, Info, X, PlusCircle, RefreshCw } from 'lucide-react';
import { supabase } from './supabaseClient.js';
import Sidebar from './components/Sidebar.jsx';
import Navbar from './components/Navbar.jsx';
import MedicineCard from './components/MedicineCard.jsx';
import MedicineList from './components/MedicineList.jsx';
import MedicineForm from './components/MedicineForm.jsx';
import Footer from './components/Footer.jsx';

const STORAGE_KEY = 'mediremind_data';

// Default initial medicines matching the reference screenshot
const demoMedicines = [
  { id: 101, name: 'Amoxicillin', dosage: '500mg, 1 capsule', scheduled_time: '08:00', stock: 22, notes: 'Take after breakfast', is_taken: false },
  { id: 102, name: 'Vitamin D3', dosage: '1000 IU, 1 drop', scheduled_time: '13:00', stock: 12, notes: 'Take with water', is_taken: true },
  { id: 103, name: 'Metformin', dosage: '500mg, 1 tablet', scheduled_time: '20:30', stock: 4, notes: 'Take with dinner', is_taken: false }
];

function App() {
  const [medicineList, setMedicineList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [isCloudSynced, setIsCloudSynced] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [currentFilter, setCurrentFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // SUPABASE CALL: Attempts to fetch medicines from Supabase with local fallback
  async function fetchMedicines() {
    setIsLoading(true);
    setStatusMessage('');

    try {
      const { data, error } = await supabase
        .from('medicines')
        .select('*')
        .order('scheduled_time', { ascending: true });

      if (error) {
        // Table does not exist in Supabase yet: load from localStorage or demo medicines
        setIsCloudSynced(false);
        const localSaved = localStorage.getItem(STORAGE_KEY);
        if (localSaved) {
          setMedicineList(JSON.parse(localSaved));
        } else {
          setMedicineList(demoMedicines);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(demoMedicines));
        }
        setStatusMessage('Local Mode Active: You can add and manage medicines. Run the SQL script in Supabase to sync to the cloud.');
      } else if (data && data.length > 0) {
        setIsCloudSynced(true);
        setMedicineList(data);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } else {
        setIsCloudSynced(true);
        const localSaved = localStorage.getItem(STORAGE_KEY);
        setMedicineList(localSaved ? JSON.parse(localSaved) : demoMedicines);
      }
    } catch (err) {
      setIsCloudSynced(false);
      const localSaved = localStorage.getItem(STORAGE_KEY);
      setMedicineList(localSaved ? JSON.parse(localSaved) : demoMedicines);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchMedicines();
  }, []);

  // SUPABASE CALL: Adds a new medicine locally and syncs to Supabase
  async function handleAddMedicine(newMedicineData) {
    setIsSubmitting(true);

    const localId = Date.now();
    const temporaryMedicine = { ...newMedicineData, id: localId };

    // Always update local state immediately so patient is never blocked
    const updatedList = [...medicineList, temporaryMedicine];
    setMedicineList(updatedList);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));

    try {
      const { data, error } = await supabase
        .from('medicines')
        .insert([newMedicineData])
        .select();

      if (error) {
        setIsCloudSynced(false);
        setStatusMessage('Medicine registered in Local Storage! (Run SQL in Supabase to enable Cloud Sync).');
      } else if (data && data[0]) {
        setIsCloudSynced(true);
        // Replace temp ID with Supabase database ID
        const syncedList = medicineList.concat(data[0]);
        setMedicineList(syncedList);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(syncedList));
        setStatusMessage('Medicine successfully synced to Supabase Cloud!');
      }
    } catch (err) {
      setIsCloudSynced(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  // SUPABASE CALL: Toggles taken status and updates stock level
  async function handleToggleTaken(id, currentStatus, currentStock) {
    const updatedStatus = !currentStatus;
    const updatedStock = updatedStatus ? Math.max(0, currentStock - 1) : currentStock + 1;

    // Update local state immediately
    const updatedList = medicineList.map((item) => {
      if (item.id === id) {
        return { ...item, is_taken: updatedStatus, stock: updatedStock };
      }
      return item;
    });
    setMedicineList(updatedList);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));

    // Sync changes to Supabase cloud
    try {
      await supabase
        .from('medicines')
        .update({ is_taken: updatedStatus, stock: updatedStock })
        .eq('id', id);
    } catch (err) {
      // Local copy already saved
    }
  }

  // Quick Restock helper (+5 doses)
  function handleRestock(id) {
    const updatedList = medicineList.map((item) => {
      if (item.id === id) {
        const newStock = (Number(item.stock) || 0) + 5;
        return { ...item, stock: newStock };
      }
      return item;
    });
    setMedicineList(updatedList);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
  }

  // SUPABASE CALL: Deletes a medicine reminder
  async function handleDeleteMedicine(id) {
    const updatedList = medicineList.filter((item) => item.id !== id);
    setMedicineList(updatedList);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));

    try {
      await supabase.from('medicines').delete().eq('id', id);
    } catch (err) {
      // Local copy already updated
    }
  }

  // Filter medicines based on active tab and search query
  const filteredMedicines = medicineList.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const stockVal = item.stock !== undefined && item.stock !== null ? Number(item.stock) : 15;

    if (!matchesSearch) return false;
    if (currentFilter === 'pending') return item.is_taken === false;
    if (currentFilter === 'taken') return item.is_taken === true;
    if (currentFilter === 'low_stock') return stockVal <= 5;
    return true;
  });

  return (
    <div className="dashboard-shell">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      <main className="main-canvas">
        <Navbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {statusMessage ? (
          <div className="status-notification-banner">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Info size={16} color={isCloudSynced ? '#16a34a' : '#ea580c'} />
              <span>{statusMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setStatusMessage('')}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}
            >
              <X size={15} />
            </button>
          </div>
        ) : null}

        {/* SECTION 1: MAIN DASHBOARD & PRESCRIPTIONS OVERVIEW */}
        {(activeSection === 'dashboard' || activeSection === 'prescriptions') && (
          <>
            <section className="section-header-row">
              <h2 className="section-title">My Prescriptions</h2>
              <div className="filter-pill-group">
                <button
                  type="button"
                  className={`filter-pill ${currentFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setCurrentFilter('all')}
                >
                  All Prescriptions
                </button>
                <button
                  type="button"
                  className={`filter-pill ${currentFilter === 'pending' ? 'active' : ''}`}
                  onClick={() => setCurrentFilter('pending')}
                >
                  Pending
                </button>
                <button
                  type="button"
                  className={`filter-pill ${currentFilter === 'taken' ? 'active' : ''}`}
                  onClick={() => setCurrentFilter('taken')}
                >
                  Taken
                </button>
                <button
                  type="button"
                  className={`filter-pill ${currentFilter === 'low_stock' ? 'active' : ''}`}
                  onClick={() => setCurrentFilter('low_stock')}
                >
                  Low Stock
                </button>
              </div>
            </section>

            <section className="cards-row">
              {filteredMedicines.slice(0, 3).map((item, index) => (
                <MedicineCard
                  key={item.id}
                  medicine={item}
                  index={index}
                  onToggleTaken={handleToggleTaken}
                />
              ))}
              {filteredMedicines.length === 0 && !isLoading ? (
                <p style={{ gridColumn: '1 / -1', color: '#64748b', fontSize: '0.9rem' }}>
                  No prescriptions found matching this filter.
                </p>
              ) : null}
            </section>

            <section className="bottom-grid">
              <MedicineList
                medicineList={filteredMedicines}
                isLoading={isLoading}
                onDeleteMedicine={handleDeleteMedicine}
                onToggleTaken={handleToggleTaken}
                onSwitchToSchedule={() => setActiveSection('schedule')}
              />
              <MedicineForm
                onAddMedicine={handleAddMedicine}
                isSubmitting={isSubmitting}
              />
            </section>
          </>
        )}

        {/* SECTION 2: EXPANDED DAILY INTAKE SCHEDULE */}
        {activeSection === 'schedule' && (
          <section style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="section-header-row">
              <h2 className="section-title">Full Medication Schedule</h2>
              <button
                type="button"
                className="filter-pill active"
                onClick={() => setActiveSection('dashboard')}
              >
                &larr; Back to Dashboard
              </button>
            </div>
            <MedicineList
              medicineList={filteredMedicines}
              isLoading={isLoading}
              onDeleteMedicine={handleDeleteMedicine}
              onToggleTaken={handleToggleTaken}
            />
          </section>
        )}

        {/* SECTION 3: STOCK & INVENTORY MANAGER */}
        {activeSection === 'stock' && (
          <section style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="section-header-row">
              <h2 className="section-title">Stock &amp; Inventory Tracker</h2>
              <button
                type="button"
                className="filter-pill active"
                onClick={() => setActiveSection('dashboard')}
              >
                &larr; Back to Dashboard
              </button>
            </div>
            <div className="cards-row">
              {medicineList.map((item, index) => {
                const stockCount = Number(item.stock) || 0;
                return (
                  <div key={item.id} className="prescription-card card-theme-yellow" style={{ minHeight: '180px' }}>
                    <h3 className="card-medicine-title">{item.name}</h3>
                    <p className="card-dosage-text">{item.dosage}</p>
                    <div className="card-stock-section">
                      <div className="stock-label-row">
                        <span>Remaining: {stockCount} doses</span>
                        <span>{stockCount <= 5 ? 'Restock Needed!' : 'Sufficient'}</span>
                      </div>
                    </div>
                    <div className="card-bottom-row" style={{ marginTop: '0.75rem' }}>
                      <span className="stock-pill-badge">{item.scheduled_time}</span>
                      <button
                        type="button"
                        className="btn-continue"
                        onClick={() => handleRestock(item.id)}
                      >
                        <RefreshCw size={12} />
                        <span>+5 Refill</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* SECTION 4: SAVED PRESCRIPTIONS ARCHIVE */}
        {activeSection === 'saved' && (
          <section style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="section-header-row">
              <h2 className="section-title">Saved Prescriptions Library</h2>
              <button
                type="button"
                className="filter-pill active"
                onClick={() => setActiveSection('dashboard')}
              >
                &larr; Back to Dashboard
              </button>
            </div>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
              You have {medicineList.length} total active prescriptions configured in your health profile.
            </p>
            <div className="cards-row">
              {medicineList.map((item, index) => (
                <MedicineCard
                  key={item.id}
                  medicine={item}
                  index={index}
                  onToggleTaken={handleToggleTaken}
                />
              ))}
            </div>
          </section>
        )}

        <Footer />
      </main>
    </div>
  );
}

export default App;
