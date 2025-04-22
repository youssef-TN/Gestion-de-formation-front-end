import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Filter, Search, Loader2, ChevronUp, ChevronDown, SlidersHorizontal } from 'lucide-react';
import Modal from '../components/Modal';
import Button from '../components/Button';
import FormInput from '../components/FormInput';
import { fetchParticipants, addParticipant, updateParticipant, deleteParticipant } from '../api/participantApi';
import FormRadio from '../components/FormRadio';
import FormDropDown from '../components/FormDropDown';

export default () => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState(null);
  
  // Advanced filtering state
  const [filters, setFilters] = useState({
    firstName: '',
    lastName: '',
    structure: '',
    profile: '',
    email: '',
    tel: ''
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: 'firstName',
    direction: 'asc'
  });

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    structure: '',
    profile: '',
    email: '',
    tel: ''
  });

  // Unique values for filters
  const [uniqueStructures, setUniqueStructures] = useState([]);
  const [uniqueProfiles, setUniqueProfiles] = useState([]);

  useEffect(() => {
    loadParticipants();
  }, []);

  useEffect(() => {
    if (participants.length > 0) {
      // Extract unique structures and profiles for filters
      const structures = [...new Set(participants.map(p => p.structure))];
      const profiles = [...new Set(participants.map(p => p.profile))];
      setUniqueStructures(structures.sort());
      setUniqueProfiles(profiles.sort());
    }
  }, [participants]);

  const loadParticipants = async () => {
    try {
      setLoading(true);
      const data = await fetchParticipants();
      setParticipants(data);
    } catch (error) {
      console.error("Failed to fetch participants:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    // console.log(e.target.name, e.target.value);
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFilterChange = (e) => {
    // console.log(e.target.name, e.target.value);
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      firstName: '',
      lastName: '',
      structure: '',
      profile: '',
      email: '',
      tel: ''
    });
    setSearchQuery('');
  };

  const handleAddParticipant = () => {
    setEditingParticipant(null);
    setFormData({
      firstName: '',
      lastName: '',
      structure: '',
      profile: '',
      email: '',
      tel: ''
    });
    setModalOpen(true);
  };

  const handleEdit = (participant) => {
    setEditingParticipant(participant);
    setFormData({
      firstName: participant.firstName,
      lastName: participant.lastName,
      structure: participant.structure,
      profile: participant.profile,
      email: participant.email,
      tel: participant.tel
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this participant?");
    if (confirm) {
      try {
        await deleteParticipant(id);
        setParticipants(prev => prev.filter(p => p.id !== id));
      } catch (error) {
        console.error("Failed to delete participant:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingParticipant) {
        const updated = await updateParticipant(editingParticipant.id, formData);
        setParticipants(prev => prev.map(p => p.id === editingParticipant.id ? updated : p));
      } else {
        const newParticipant = await addParticipant(formData);
        setParticipants(prev => [...prev, newParticipant]);
      }
      setModalOpen(false);
    } catch (error) {
      console.error("Failed to save participant:", error);
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    setSortConfig({ key, direction });
  };

  // Filter and sort the participants
  const getFilteredAndSortedParticipants = () => {
    // First filter the participants
    const filtered = participants.filter(participant => {
      const matchesFirstName = !filters.firstName || participant.firstName.toLowerCase().includes(filters.firstName.toLowerCase());
      const matchesLastName = !filters.lastName || participant.lastName.toLowerCase().includes(filters.lastName.toLowerCase());
      const matchesStructure = !filters.structure || participant.structure === filters.structure;
      const matchesProfile = !filters.profile || participant.profile === filters.profile;
      const matchesEmail = !filters.email || participant.email.toLowerCase().includes(filters.email.toLowerCase());
      const matchesTel = !filters.tel || participant.tel.includes(filters.tel);
      
      // Search query
      const matchesSearch = !searchQuery || 
        participant.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        participant.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        participant.structure.toLowerCase().includes(searchQuery.toLowerCase()) ||
        participant.profile.toLowerCase().includes(searchQuery.toLowerCase()) ||
        participant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        participant.tel.includes(searchQuery.toLowerCase());
      
      return matchesFirstName && matchesLastName && matchesStructure && 
             matchesProfile && matchesEmail && matchesTel && matchesSearch;
    });
    
    // Then sort the filtered participants
    return [...filtered].sort((a, b) => {
      // Sort alphabetically for strings
      const aValue = a[sortConfig.key].toLowerCase();
      const bValue = b[sortConfig.key].toLowerCase();
      
      if (sortConfig.direction === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });
  };

  const filteredAndSortedParticipants = getFilteredAndSortedParticipants();
  
  // Helper to render sort indicator
  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="w-4 h-4 inline ml-1" />
      : <ChevronDown className="w-4 h-4 inline ml-1" />;
  };

  return (
    <div className="p-6 space-y-6 bg-[#F6EEE0]/10">
      <h2 className="text-3xl font-semibold text-gray-800 drop-shadow-md">Participant Management</h2>

      <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-4">
        <Button 
          onClick={handleAddParticipant} 
          icon={<Plus className="w-5 h-5" />}
          className="bg-[#99BC85] hover:bg-[#99BC85]/80 text-white shadow-md"
        >
          Add Participant
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
            {filters.structure && (
              <span className="inline-flex items-center px-3 py-1 bg-[#BFD8AF] text-gray-700 rounded-full text-sm">
                Structure: {filters.structure}
              </span>
            )}
            {filters.profile && (
              <span className="inline-flex items-center px-3 py-1 bg-[#BFD8AF] text-gray-700 rounded-full text-sm">
                Profile: {filters.profile}
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
                { key: 'structure', label: 'Structure' },
                { key: 'profile', label: 'Profile' },
                { key: 'email', label: 'Email' },
                { key: 'tel', label: 'Phone' },
                { key: '', label: '' }
              ].map((col) => (
                <th 
                  key={col.key} 
                  className={`py-3 px-6 text-sm font-medium uppercase ${col.key === '' ? 'text-center' : ''}`}
                  onClick={() => col.key && handleSort(col.key)}
                  style={{ cursor: col.key ? 'pointer' : 'default' }}
                >
                  {col.label}
                  {col.key && getSortIndicator(col.key)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white text-sm text-gray-700">
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-8">
                  <div className="flex justify-center">
                    <Loader2 className="w-8 h-8 text-[#99BC85] animate-spin" />
                  </div>
                </td>
              </tr>
            ) : filteredAndSortedParticipants.length > 0 ? (
              filteredAndSortedParticipants.map((participant) => (
                <tr key={participant.id} className="border-b border-gray-200 hover:bg-[#F6EEE0]/20">
                  <td className="px-6 py-4 font-medium">{participant.firstName}</td>
                  <td className="px-6 py-4">{participant.lastName}</td>
                  <td className="px-6 py-4">{participant.structure}</td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-2 py-1 bg-[#BFD8AF]/40 rounded-full text-xs">
                      {participant.profile}
                    </span>
                  </td>
                  <td className="px-6 py-4">{participant.email}</td>
                  <td className="px-6 py-4">{participant.tel}</td>
                  <td className="px-6 py-4 flex justify-center gap-4">
                    <button
                      onClick={() => handleEdit(participant)}
                      className="p-1 text-[#99BC85] hover:text-[#99BC85]/80 hover:bg-gray-100 rounded"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(participant.id)}
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
                <td colSpan="7" className="text-center py-12 text-gray-500">
                  <div className="flex flex-col items-center space-y-2">
                    <Filter className="w-12 h-12 text-gray-300" />
                    <p>No participants match your filters.</p>
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

      {/* Pagination - could be implemented if needed */}
      <div className="flex justify-between items-center text-sm text-gray-600">
        <span>Showing {filteredAndSortedParticipants.length} of {participants.length} participants</span>
      </div>

      {/* Add/Edit Participant Modal */}
      <Modal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        title={editingParticipant ? "Edit Participant" : "Add New Participant"}
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
          
          <FormRadio
            label="Choose your structure"
            name="structure"
            options={[
              { value: 'Direction regional', label: 'Direction regional ' },
              { value: 'Direction central', label: 'Direction central' },
    
            ]}
            value={formData.structure}
            onChange={handleInputChange}
            required
          />
          
          <FormDropDown
            label="Choose your profile"
            name="profile"      
            options={[
              { value: "Informaticien-bac-5", label: "Informaticien (bac + 5)" },
              { value: "Informaticien-bac-3", label: "Informaticien (bac + 3)" },
              { value: "Gestionnaire", label: "Gestionnaire" },
              { value: "Juriste", label: "Juriste" },
              { value: "Technicien-superieur", label: "Technicien supérieur" }
            ]}
            value={formData.profile}
            onChange={handleInputChange}
            placeholder="Select profile"
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
              {editingParticipant ? "Update" : "Create"}
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
        <div className="space-y-4">
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
              Structure
            </label>
            <select
              name="structure"
              value={filters.structure}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white"
            >
              <option value="">All Structures</option>
              {uniqueStructures.map(structure => (
                <option key={structure} value={structure}>{structure}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Profile
            </label>
            <select
              name="profile"
              value={filters.profile}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white"
            >
              <option value="">All Profiles</option>
              {uniqueProfiles.map(profile => (
                <option key={profile} value={profile}>{profile}</option>
              ))}
            </select>
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