import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Filter, Search, Loader2, ChevronUp, ChevronDown, SlidersHorizontal, Eye, EyeOff } from 'lucide-react';
import Modal from '../components/Modal';
import Button from '../components/Button';
import FormInput from '../components/FormInput';
import { fetchUsers, addUser, updateUser, deleteUser } from '../api/userApi';
import FormDropDown from '../components/FormDropDown';

export default () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  
  // Advanced filtering state
  const [filters, setFilters] = useState({
    login: '',
    role: ''
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: 'login',
    direction: 'asc'
  });

  const [formData, setFormData] = useState({
    login: '',
    password: '',
    role: ''
  });

  // Unique values for filters
  const [uniqueRoles, setUniqueRoles] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      // Extract unique roles for filters
      const roles = [...new Set(users.map(u => u.role))];
      setUniqueRoles(roles.sort());
    }
  }, [users]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await fetchUsers();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
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
      login: '',
      role: ''
        });
    setSearchQuery('');
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setFormData({
      login: '',
      password: '',
      role: ''
    });
    setModalOpen(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      login: user.login,
      password: '', // Don't pre-fill password for security
      role: user.role
        });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this user?");
    if (confirm) {
      try {
        await deleteUser(id);
        setUsers(prev => prev.filter(u => u.id !== id));
      } catch (error) {
        console.error("Failed to delete user:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingUser) {
        const updated = await updateUser(editingUser.id, formData);
        setUsers(prev => prev.map(u => u.id === editingUser.id ? updated : u));
      } else {
        const newUser = await addUser(formData);
        setUsers(prev => [...prev, newUser]);
      }
      setModalOpen(false);
    } catch (error) {
      console.error("Failed to save user:", error);
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    setSortConfig({ key, direction });
  };

  // Filter and sort the users
  const getFilteredAndSortedUsers = () => {
    // First filter the users
    const filtered = users.filter(user => {
      const matchesLogin = !filters.login || user.login.toLowerCase().includes(filters.login.toLowerCase());
      const matchesRole = !filters.role || user.role === filters.role;
      
      // Search query
      const matchesSearch = !searchQuery || 
        user.login.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase());      
      return matchesLogin && matchesRole && matchesSearch;
    });
    
    // Then sort the filtered users
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

  const filteredAndSortedUsers = getFilteredAndSortedUsers();
  
  // Helper to render sort indicator
  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="w-4 h-4 inline ml-1" />
      : <ChevronDown className="w-4 h-4 inline ml-1" />;
  };

  return (
    <div className="p-6 space-y-6 bg-[#F6EEE0]/10">
      <h2 className="text-3xl font-semibold text-gray-800 drop-shadow-md">User Management</h2>

      <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-4">
        <Button 
          onClick={handleAddUser} 
          icon={<Plus className="w-5 h-5" />}
          className="bg-[#99BC85] hover:bg-[#99BC85]/80 text-white shadow-md hover:cursor-pointer"
        >
          Add User
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
            className="border-[#99BC85] text-[#99BC85] hover:bg-[#99BC85]/10 hover:cursor-pointer" 
            icon={<SlidersHorizontal className="w-5 h-5" />}
          >
            Filters
          </Button>
          
          {Object.values(filters).some(f => f !== '') && (
            <Button 
              variant="text"
              onClick={clearFilters}
              className="text-gray-600 hover:text-gray-800 hover:cursor-pointer"
            >
              Clear filters
            </Button>
          )}
          
          {/* Active filters display */}
          <div className="flex flex-wrap gap-2">
            {filters.login && (
              <span className="inline-flex items-center px-3 py-1 bg-[#BFD8AF] text-gray-700 rounded-full text-sm">
                Login: {filters.login}
              </span>
            )}
            {filters.role && (
              <span className="inline-flex items-center px-3 py-1 bg-[#BFD8AF] text-gray-700 rounded-full text-sm">
                Role: {filters.role}
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
                { key: 'login', label: 'Login' },
                { key: 'role', label: 'Role' },
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
                <td colSpan="5" className="text-center py-8">
                  <div className="flex justify-center">
                    <Loader2 className="w-8 h-8 text-[#99BC85] animate-spin" />
                  </div>
                </td>
              </tr>
            ) : filteredAndSortedUsers.length > 0 ? (
              filteredAndSortedUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-200 hover:bg-[#F6EEE0]/20">
                  <td className="px-6 py-4 font-medium">{user.login}</td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-2 py-1 bg-[#BFD8AF]/40 rounded-full text-xs">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex justify-center gap-4">
                    <button
                      onClick={() => handleEdit(user)}
                      className="p-1 text-[#99BC85] hover:text-[#99BC85]/80 hover:bg-gray-100 rounded hover:cursor-pointer"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="p-1 text-red-500 hover:text-red-600 hover:bg-gray-100 rounded hover:cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-12 text-gray-500">
                  <div className="flex flex-col items-center space-y-2">
                    <Filter className="w-12 h-12 text-gray-300" />
                    <p>No users match your filters.</p>
                    <Button 
                      variant="text" 
                      onClick={clearFilters}
                      className="text-[#99BC85] hover:text-[#99BC85]/80 hover:cursor-pointer"
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
        <span>Showing {filteredAndSortedUsers.length} of {users.length} users</span>
      </div>

      {/* Add/Edit User Modal */}
      <Modal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        title={editingUser ? "Edit User" : "Add New User"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Login"
            name="login"
            value={formData.login}
            onChange={handleInputChange}
            required
          />
          
          <div className="relative">
            <FormInput
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleInputChange}
              required={!editingUser} // Password not required for edits (unless changing)
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 hover:cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          
          <FormDropDown
            label="Role"
            name="role"      
            options={[
              { value: "admin", label: "Administrator" },
              { value: "manager", label: "Manager" },
              { value: "user", label: "Regular User" }
            ]}
            value={formData.role}
            onChange={handleInputChange}
            placeholder="Select role"
            required   
          />
          
          <div className="flex justify-end gap-3 mt-6">
            <Button 
              variant="secondary" 
              type="button" 
              onClick={() => setModalOpen(false)}
              children="hover:cursor-pointer"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-[#99BC85] hover:bg-[#99BC85]/80 text-white hover:cursor-pointer"
            >
              {editingUser ? "Update" : "Create"}
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
              Login
            </label>
            <input 
              type="text"
              name="login"
              value={filters.login}
              onChange={handleFilterChange}
              placeholder="Filter by login"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              name="role"
              value={filters.role}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white"
            >
              <option value="">All Roles</option>
              {uniqueRoles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
          
          <div className="flex justify-end gap-3 mt-6">
            <Button 
              variant="text" 
              type="button" 
              onClick={clearFilters}
              className='hover:cursor-pointer'
            >
              Clear All
            </Button>
            <Button 
              variant="secondary" 
              type="button" 
              onClick={() => setFilterModalOpen(false)}
              className='hover:cursor-pointer'
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={() => setFilterModalOpen(false)}
              className="bg-[#99BC85] hover:bg-[#99BC85]/80 text-white hover:cursor-pointer"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};