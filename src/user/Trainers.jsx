import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Filter, Search, Loader2, ChevronUp, ChevronDown, SlidersHorizontal } from 'lucide-react';
import Modal from '../components/Modal';
import Button from '../components/Button';
import FormInput from '../components/FormInput';
import FormRadio from '../components/FormRadio';
import { fetchTrainers, addTrainer, updateTrainer, deleteTrainer } from '../api/trainerApi';

export default () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState(null);
  
  // Advanced filtering state
  const [filters, setFilters] = useState({
    firstName: '',
    lastName: '',
    email: '',
    tel: '',
    style: '',
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: 'firstName',
    direction: 'asc'
  });

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    tel: '',
    style: 'interne',
  });

  useEffect(() => {
    loadTrainers();
  }, []);

  const loadTrainers = async () => {
    try {
      setLoading(true);
      const data = await fetchTrainers();
      setTrainers(data);
    } catch (error) {
      console.error("Failed to fetch trainers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      firstName: '',
      lastName: '',
      email: '',
      tel: '',
      style: '',
    });
    setSearchQuery('');
  };

  const handleAddTrainer = () => {
    setEditingTrainer(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      tel: '',
      style: 'interne',
    });
    setModalOpen(true);
  };

  const handleEdit = (trainer) => {
    setEditingTrainer(trainer);
    setFormData({
      firstName: trainer.firstName,
      lastName: trainer.lastName,
      email: trainer.email,
      tel: trainer.tel,
      style: trainer.style || 'interne',
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this trainer?");
    if (confirm) {
      try {
        await deleteTrainer(id);
        setTrainers(prev => prev.filter(t => t.id !== id));
      } catch (error) {
        console.error("Failed to delete trainer:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingTrainer) {
        const updated = await updateTrainer(editingTrainer.id, formData);
        setTrainers(prev => prev.map(t => t.id === editingTrainer.id ? updated : t));
      } else {
        const newTrainer = await addTrainer(formData);
        setTrainers(prev => [...prev, newTrainer]);
      }
      setModalOpen(false);
    } catch (error) {
      console.error("Failed to save trainer:", error);
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    setSortConfig({ key, direction });
  };

  // Filter and sort the trainers
  const getFilteredAndSortedTrainers = () => {
    // First filter the trainers
    const filtered = trainers.filter(trainer => {
      const matchesFirstName = !filters.firstName || trainer.firstName.toLowerCase().includes(filters.firstName.toLowerCase());
      const matchesLastName = !filters.lastName || trainer.lastName.toLowerCase().includes(filters.lastName.toLowerCase());
      const matchesEmail = !filters.email || trainer.email.toLowerCase().includes(filters.email.toLowerCase());
      const matchesTel = !filters.tel || trainer.tel.includes(filters.tel);
      const matchesStyle = !filters.style || trainer.style === filters.style;
      
      // Search query
      const matchesSearch = !searchQuery || 
        trainer.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trainer.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trainer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trainer.tel.includes(searchQuery.toLowerCase()) ||
        (trainer.style && trainer.style.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesFirstName && matchesLastName && matchesEmail && matchesTel && matchesStyle && matchesSearch;
    });
    
    // Then sort the filtered trainers
    return [...filtered].sort((a, b) => {
      // Sort alphabetically for strings
      const aValue = a[sortConfig.key]?.toLowerCase() || '';
      const bValue = b[sortConfig.key]?.toLowerCase() || '';
      
      if (sortConfig.direction === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });
  };

  const filteredAndSortedTrainers = getFilteredAndSortedTrainers();
  
  // Helper to render sort indicator
  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="w-4 h-4 inline ml-1" />
      : <ChevronDown className="w-4 h-4 inline ml-1" />;
  };

  return (
    <div className="p-6 space-y-6 bg-[#F6EEE0]/10">
      <h2 className="text-3xl font-semibold text-gray-800 drop-shadow-md">Trainer Management</h2>

      <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-4">
        <Button 
          onClick={handleAddTrainer} 
          icon={<Plus className="w-5 h-5" />}
          className="bg-[#99BC85] hover:bg-[#99BC85]/80 text-white shadow-md"
        >
          Add Trainer
        </Button>

        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative min-w-[200px]">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F6EEE0] pl-8 pr-4 py-2 rounded-full border border-gray-300 shadow-sm"
            />
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => setFilterModalOpen(true)}
            className="border-[#99BC85] text-[#99BC85] hover:bg-[#99BC85]/10"
            icon={<SlidersHorizontal className="w-5 h-5" />}
          >
            Filters
          </Button>
          
          {Object.values(filters).some(f => f !== '') && (
            <Button 
              variant="text"
              onClick={clearFilters}
              className="text-gray-600 hover:text-gray-800"
            >
              Clear filters
            </Button>
          )}
          
          {/* Active filters display */}
          <div className="flex flex-wrap gap-2">
            {filters.firstName && (
              <span className="inline-flex items-center px-3 py-1 bg-[#BFD8AF] text-gray-700 rounded-full text-sm">
                First Name: {filters.firstName}
              </span>
            )}
            {filters.lastName && (
              <span className="inline-flex items-center px-3 py-1 bg-[#BFD8AF] text-gray-700 rounded-full text-sm">
                Last Name: {filters.lastName}
              </span>
            )}
            {filters.style && (
              <span className="inline-flex items-center px-3 py-1 bg-[#BFD8AF] text-gray-700 rounded-full text-sm">
                Style: {filters.style}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl shadow-lg border border-gray-200">
        <table className="min-w-full text-left">
          <thead>
            <tr className="bg-[#BFD8AF] text-gray-800">
              {[
                { key: 'firstName', label: 'First Name' },
                { key: 'lastName', label: 'Last Name' },
                { key: 'email', label: 'Email' },
                { key: 'tel', label: 'Phone' },
                { key: 'style', label: 'Style' },
                { key: 'actions', label: 'Actions' }
              ].map((col) => (
                <th 
                  key={col.key} 
                  className={`py-3 px-6 text-sm font-medium uppercase ${col.key === 'actions' ? 'text-center' : ''}`}
                  onClick={() => col.key && col.key !== 'actions' && handleSort(col.key)}
                  style={{ cursor: col.key && col.key !== 'actions' ? 'pointer' : 'default' }}
                >
                  {col.label}
                  {col.key && col.key !== 'actions' && getSortIndicator(col.key)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white text-sm text-gray-700">
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-8">
                  <div className="flex justify-center">
                    <Loader2 className="w-8 h-8 text-[#99BC85] animate-spin" />
                  </div>
                </td>
              </tr>
            ) : filteredAndSortedTrainers.length > 0 ? (
              filteredAndSortedTrainers.map((trainer) => (
                <tr key={trainer.id} className="border-b border-gray-200 hover:bg-[#F6EEE0]/20">
                  <td className="px-6 py-4 font-medium">{trainer.firstName}</td>
                  <td className="px-6 py-4">{trainer.lastName}</td>
                  <td className="px-6 py-4">{trainer.email}</td>
                  <td className="px-6 py-4">{trainer.tel}</td>
                  <td className="px-6 py-4">{trainer.style}</td>
                  <td className="px-6 py-4 flex justify-center gap-4">
                    <button
                      onClick={() => handleEdit(trainer)}
                      className="p-1 text-[#99BC85] hover:text-[#99BC85]/80 hover:bg-gray-100 rounded"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(trainer.id)}
                      className="p-1 text-red-500 hover:text-red-600 hover:bg-gray-100 rounded"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-12 text-gray-500">
                  <div className="flex flex-col items-center space-y-2">
                    <Filter className="w-12 h-12 text-gray-300" />
                    <p>No trainers match your filters.</p>
                    <Button 
                      variant="text" 
                      onClick={clearFilters}
                      className="text-[#99BC85] hover:text-[#99BC85]/80"
                    >
                      Clear all filters
                    </Button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between bg- items-center text-sm text-gray-600">
        <span>Showing {filteredAndSortedTrainers.length} of {trainers.length} trainers</span>
      </div>

      {/* Add/Edit Trainer Modal */}
      <Modal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        title={editingTrainer ? "Edit Trainer" : "Add New Trainer"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
          />
          
          <FormInput
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            required
          />
          
          <FormInput
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          
          <FormInput
            label="Phone"
            name="tel"
            value={formData.tel}
            onChange={handleInputChange}
            required
          />
          
          <FormRadio
            label="Style"
            name="style"
            options={[
              { value: 'interne', label: 'Interne' },
              { value: 'externe', label: 'Externe' }
            ]}
            value={formData.style}
            onChange={handleInputChange}
            required={true}
          />
          
          <div className="flex justify-end gap-3 mt-6">
            <Button 
              variant="secondary" 
              type="button" 
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-[#99BC85] hover:bg-[#99BC85]/80 text-white"
            >
              {editingTrainer ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Modal>
      
      {/* Advanced Filter Modal */}
      <Modal
        isOpen={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        title="Advanced Filters"
      >
        <div className="space-y-4 ">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input 
              type="text"
              name="firstName"
              value={filters.firstName}
              onChange={handleFilterChange}
              placeholder="Filter by first name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input 
              type="text"
              name="lastName"
              value={filters.lastName}
              onChange={handleFilterChange}
              placeholder="Filter by last name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input 
              type="text"
              name="email"
              value={filters.email}
              onChange={handleFilterChange}
              placeholder="Filter by email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input 
              type="text"
              name="tel"
              value={filters.tel}
              onChange={handleFilterChange}
              placeholder="Filter by phone"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          
          <FormRadio
            label="Style"
            name="style"
            options={[
              { value: '', label: 'All' },
              { value: 'interne', label: 'Interne' },
              { value: 'externe', label: 'Externe' }
            ]}
            value={filters.style}
            onChange={handleFilterChange}
            required={true}
          />
          
          <div className="flex justify-end gap-3 mt-6">
            <Button 
              variant="text" 
              type="button" 
              onClick={clearFilters}
            >
              Clear All
            </Button>
            <Button 
              variant="secondary" 
              type="button" 
              onClick={() => setFilterModalOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={() => setFilterModalOpen(false)}
              className="bg-[#99BC85] hover:bg-[#99BC85]/80 text-white"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};