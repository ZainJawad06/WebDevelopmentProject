// src/App.jsx
// Main application component managing state, Supabase queries, and dashboard layout.

import { useState, useEffect } from 'react';
// Icons come from lucide-react. Each icon is a React component; size and color are props.
import { AlertCircle, X } from 'lucide-react';
import { supabase } from './supabaseClient.js';
import Sidebar from './components/Sidebar.jsx';
import Navbar from './components/Navbar.jsx';
import MedicineCard from './components/MedicineCard.jsx';
import MedicineList from './components/MedicineList.jsx';
import MedicineForm from './components/MedicineForm.jsx';
import Footer from './components/Footer.jsx';

function App() {
  const [medicineList, setMedicineList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentFilter, setCurrentFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // SUPABASE CALL: Fetches all medicine records from the database
  async function fetchMedicines() {
    try {
      setIsLoading(true);
      setErrorMessage('');
      const { data, error } = await supabase.from('medicines').select('*').order('scheduled_time', { ascending: true });
      if (error) throw error;
      if (data) setMedicineList(data);
    } catch (err) {
      setErrorMessage('Failed to load medicines from database. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchMedicines();
  }, []);

  // SUPABASE CALL: Inserts a newly entered specific medicine with stock into the database
  async function handleAddMedicine(newMedicineData) {
    try {
      setIsSubmitting(true);
      setErrorMessage('');
      const { data, error } = await supabase.from('medicines').insert([newMedicineData]).select();
      if (error) throw error;
      if (data) setMedicineList([...medicineList, data[0]]);
    } catch (err) {
      setErrorMessage('Could not add medicine reminder. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  // SUPABASE CALL: Updates taken status and adjusts medicine stock count
  async function handleToggleTaken(id, currentStatus, currentStock) {
    try {
      setErrorMessage('');
      const updatedStatus = !currentStatus;
      const updatedStock = updatedStatus ? Math.max(0, currentStock - 1) : currentStock + 1;

      let { error } = await supabase.from('medicines').update({ is_taken: updatedStatus, stock: updatedStock }).eq('id', id);
      if (error) {
        const retryResult = await supabase.from('medicines').update({ is_taken: updatedStatus }).eq('id', id);
        error = retryResult.error;
      }
      if (error) throw error;

      const updatedList = medicineList.map((item) => {
        if (item.id === id) {
          return { ...item, is_taken: updatedStatus, stock: updatedStock };
        }
        return item;
      });
      setMedicineList(updatedList);
    } catch (err) {
      setErrorMessage('Could not update medicine status. Please try again.');
    }
  }

  // SUPABASE CALL: Deletes a medicine record from the database by its ID
  async function handleDeleteMedicine(id) {
    try {
      setErrorMessage('');
      const { error } = await supabase.from('medicines').delete().eq('id', id);
      if (error) throw error;
      const updatedList = medicineList.filter((item) => item.id !== id);
      setMedicineList(updatedList);
    } catch (err) {
      setErrorMessage('Could not delete medicine reminder. Please try again.');
    }
  }

  // Filter medicines by active category tab and search input
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
      <Sidebar />
      <main className="main-canvas">
        <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

        {errorMessage ? (
          <div className="error-strip">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={16} />
              <span>{errorMessage}</span>
            </div>
            <button type="button" onClick={() => setErrorMessage('')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#dc2626' }}>
              <X size={15} />
            </button>
          </div>
        ) : null}

        <section className="section-header-row">
          <h2 className="section-title">My Prescriptions</h2>
          <div className="filter-pill-group">
            <button type="button" className={`filter-pill ${currentFilter === 'all' ? 'active' : ''}`} onClick={() => setCurrentFilter('all')}>All Prescriptions</button>
            <button type="button" className={`filter-pill ${currentFilter === 'pending' ? 'active' : ''}`} onClick={() => setCurrentFilter('pending')}>Pending</button>
            <button type="button" className={`filter-pill ${currentFilter === 'taken' ? 'active' : ''}`} onClick={() => setCurrentFilter('taken')}>Taken</button>
            <button type="button" className={`filter-pill ${currentFilter === 'low_stock' ? 'active' : ''}`} onClick={() => setCurrentFilter('low_stock')}>Low Stock</button>
          </div>
        </section>

        <section className="cards-row">
          {filteredMedicines.slice(0, 3).map((item, index) => (
            <MedicineCard key={item.id} medicine={item} index={index} onToggleTaken={handleToggleTaken} />
          ))}
          {filteredMedicines.length === 0 && !isLoading ? (
            <p style={{ gridColumn: '1 / -1', color: '#64748b', fontSize: '0.9rem' }}>No prescriptions match your selection. Enter a new medicine below.</p>
          ) : null}
        </section>

        <section className="bottom-grid">
          <MedicineList medicineList={filteredMedicines} isLoading={isLoading} onDeleteMedicine={handleDeleteMedicine} />
          <MedicineForm onAddMedicine={handleAddMedicine} isSubmitting={isSubmitting} />
        </section>

        <Footer />
      </main>
    </div>
  );
}

export default App;
