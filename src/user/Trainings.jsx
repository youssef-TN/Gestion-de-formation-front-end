import { useState, useEffect } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Filter,
  Search,
  Loader2,
  ChevronUp,
  ChevronDown,
  SlidersHorizontal,
} from "lucide-react";
import Modal from "../components/Modal";
import Button from "../components/Button";
import FormInput from "../components/FormInput";
import {
  fetchTrainings,
  addTraining,
  updateTraining,
  deleteTraining,
} from "../api/trainingApi";
import FormCounter from "../components/FormCounter";

export default () => {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [editingTraining, setEditingTraining] = useState(null);

  // Advanced filtering state
  const [filters, setFilters] = useState({
    year: "",
    field: "",
    minBudget: "",
    maxBudget: "",
    maxDuration: "",
    minDuration: "",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "title",
    direction: "asc",
  });

  const [formData, setFormData] = useState({
    title: "",
    year: new Date().getFullYear(),
    duration: "",
    field: "",
    budget: "",
  });

  // Unique values for filters
  const [uniqueYears, setUniqueYears] = useState([]);
  const [uniqueFields, setUniqueFields] = useState([]);

  useEffect(() => {
    loadTrainings();
  }, []);

  useEffect(() => {
    if (trainings.length > 0) {
      // Extract unique years and fields for filters
      const years = [...new Set(trainings.map((t) => t.year.toString()))];
      const fields = [...new Set(trainings.map((t) => t.field))];

      setUniqueYears(years.sort((a, b) => b - a)); // Sort years descending
      setUniqueFields(fields.sort());
    }
  }, [trainings]);

  const loadTrainings = async () => {
    try {
      setLoading(true);
      const data = await fetchTrainings();
      setTrainings(data);
    } catch (error) {
      console.error("Failed to fetch trainings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      year: "",
      field: "",
      minBudget: "",
      maxBudget: "",
      maxDuration: "",
      minDuration: "",
    });
    setSearchQuery("");
  };

  const handleAddTraining = () => {
    setEditingTraining(null);
    setFormData({
      title: "",
      year: new Date().getFullYear(),
      duration: "",
      field: "",
      budget: "",
    });
    setModalOpen(true);
  };

  const handleEdit = (training) => {
    setEditingTraining(training);
    setFormData({
      title: training.title,
      year: training.year,
      duration: training.duration,
      field: training.field,
      budget: training.budget,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this training?"
    );
    if (confirm) {
      try {
        await deleteTraining(id);
        setTrainings((prev) => prev.filter((t) => t.id !== id));
      } catch (error) {
        console.error("Failed to delete training:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingTraining) {
        const updated = await updateTraining(editingTraining.id, formData);
        setTrainings((prev) =>
          prev.map((t) => (t.id === editingTraining.id ? updated : t))
        );
      } else {
        const newTraining = await addTraining(formData);
        setTrainings((prev) => [...prev, newTraining]);
      }
      setModalOpen(false);
    } catch (error) {
      console.error("Failed to save training:", error);
    }
  };

  const handleSort = (key) => {
    let direction = "asc";

    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    setSortConfig({ key, direction });
  };

  // Filter and sort the trainings
  const getFilteredAndSortedTrainings = () => {
    // First filter the trainings
    const filtered = trainings.filter((training) => {
      const matchesYear =
        !filters.year || training.year.toString() === filters.year;
      const matchesField = !filters.field || training.field === filters.field;
      const matchesDuration =
        !filters.duration || training.duration.toString() === filters.duration;

      // Budget range filtering
      const budget = parseInt(training.budget);
      const matchesMinBudget =
        !filters.minBudget || budget >= parseInt(filters.minBudget);
      const matchesMaxBudget =
        !filters.maxBudget || budget <= parseInt(filters.maxBudget);

      // Duration range filtering
      const duration = parseInt(training.duration);
      const matchesMinDuration =
        !filters.minDuration || duration >= parseInt(filters.minDuration);
      const matchesMaxDuration =
        !filters.maxDuration || duration <= parseInt(filters.maxDuration);

      // Search query
      const matchesSearch =
        !searchQuery ||
        training.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        training.field.toLowerCase().includes(searchQuery.toLowerCase());

      return (
        matchesYear &&
        matchesField &&
        matchesDuration &&
        matchesMinBudget &&
        matchesMaxBudget &&
        matchesMaxDuration &&
        matchesMinDuration &&
        matchesSearch
      );
    });

    // Then sort the filtered trainings
    return [...filtered].sort((a, b) => {
      if (
        sortConfig.key === "year" ||
        sortConfig.key === "duration" ||
        sortConfig.key === "budget"
      ) {
        // Sort numerically for year
        const aValue = parseInt(a[sortConfig.key]);
        const bValue = parseInt(b[sortConfig.key]);

        if (sortConfig.direction === "asc") {
          return aValue - bValue;
        } else {
          return bValue - aValue;
        }
      } else {
        // Sort alphabetically for strings
        const aValue = a[sortConfig.key].toLowerCase();
        const bValue = b[sortConfig.key].toLowerCase();

        if (sortConfig.direction === "asc") {
          return aValue.localeCompare(bValue);
        } else {
          return bValue.localeCompare(aValue);
        }
      }
    });
  };

  const filteredAndSortedTrainings = getFilteredAndSortedTrainings();

  // Helper to render sort indicator
  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;

    return sortConfig.direction === "asc" ? (
      <ChevronUp className="w-4 h-4 inline ml-1" />
    ) : (
      <ChevronDown className="w-4 h-4 inline ml-1" />
    );
  };

  return (
    <div className="p-6 space-y-6 bg-[#F6EEE0]/10 ">
      <h2 className="text-3xl font-semibold text-gray-800 drop-shadow-md">
        Training Management
      </h2>

      <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-4">
        <Button
          onClick={handleAddTraining}
          icon={<Plus className="w-5 h-5" />}
          className="bg-[#99BC85] hover:bg-[#99BC85]/80 text-white shadow-md"
        >
          Add Training
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

          {Object.values(filters).some((f) => f !== "") && (
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
            {filters.year && (
              <span className="inline-flex items-center px-3 py-1 bg-[#BFD8AF] text-gray-700 rounded-full text-sm">
                Year: {filters.year}
              </span>
            )}
            {filters.field && (
              <span className="inline-flex items-center px-3 py-1 bg-[#BFD8AF] text-gray-700 rounded-full text-sm">
                Field: {filters.field}
              </span>
            )}
            {(filters.minBudget || filters.maxBudget) && (
              <span className="inline-flex items-center px-3 py-1 bg-[#BFD8AF] text-gray-700 rounded-full text-sm">
                Budget: {filters.minBudget ? `$${filters.minBudget}` : "$0"} -{" "}
                {filters.maxBudget ? `$${filters.maxBudget}` : "∞"}
              </span>
            )}
            {(filters.minDuration || filters.maxDuration) && (
              <span className="inline-flex items-center px-3 py-1 bg-[#BFD8AF] text-gray-700 rounded-full text-sm">
                Duration: {filters.minDuration ? `$${filters.minDuration}` : "$0"} -{" "}
                {filters.maxDuration ? `$${filters.maxDuration}` : "∞"}
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
                { key: "title", label: "Title" },
                { key: "year", label: "Year" },
                { key: "duration", label: "Duration" },
                { key: "field", label: "Field" },
                { key: "budget", label: "Budget" },
                { key: "", label: "" },
              ].map((col) => (
                <th
                  key={col.key}
                  className={`py-3 px-6 text-sm font-medium uppercase ${
                    col.key === "" ? "text-center" : ""
                  }`}
                  onClick={() => col.key && handleSort(col.key)}
                  style={{ cursor: col.key ? "pointer" : "default" }}
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
                <td colSpan="6" className="text-center py-8">
                  <div className="flex justify-center">
                    <Loader2 className="w-8 h-8 text-[#99BC85] animate-spin" />
                  </div>
                </td>
              </tr>
            ) : filteredAndSortedTrainings.length > 0 ? (
              filteredAndSortedTrainings.map((training) => (
                <tr
                  key={training.id}
                  className="border-b border-gray-200 hover:bg-[#F6EEE0]/20"
                >
                  <td className="px-6 py-4 font-medium">{training.title}</td>
                  <td className="px-6 py-4">{training.year}</td>
                  <td className="px-6 py-4">{training.duration}</td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-2 py-1 bg-[#BFD8AF]/40 rounded-full text-xs">
                      {training.field}
                    </span>
                  </td>
                  <td className="px-6 py-4">${training.budget}</td>
                  <td className="px-6 py-4 flex justify-center gap-4">
                    <button
                      onClick={() => handleEdit(training)}
                      className="p-1 text-[#99BC85] hover:text-[#99BC85]/80 hover:bg-gray-100 rounded"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(training.id)}
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
                    <p>No trainings match your filters.</p>
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
        <span>
          Showing {filteredAndSortedTrainings.length} of {trainings.length}{" "}
          trainings
        </span>
      </div>

      {/* Add/Edit Training Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingTraining ? "Edit Training" : "Add New Training"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />

          <FormInput
            label="Year"
            name="year"
            type="number"
            value={formData.year}
            onChange={handleInputChange}
            required
          />

          <FormCounter
            label="Duration (days)"
            name="duration"
            value={formData.duration}
            onChange={handleInputChange}
            required
            min={1}
            max={365}
          />
          <FormInput
            label="Field"
            name="field"
            placeholder="e.g., IT, Management"
            value={formData.field}
            onChange={handleInputChange}
            required
            list="field-options"
          />
          <datalist id="field-options">
            {uniqueFields.map((field) => (
              <option key={field} value={field} />
            ))}
          </datalist>

          <FormInput
            label="Budget"
            name="budget"
            type="number"
            placeholder="e.g., 1000"
            value={formData.budget}
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
              {editingTraining ? "Update" : "Create"}
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
              Year
            </label>
            <select
              name="year"
              value={filters.year}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white"
            >
              <option value="">All Years</option>
              {uniqueYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Field
            </label>
            <select
              name="field"
              value={filters.field}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white"
            >
              <option value="">All Fields</option>
              {uniqueFields.map((field) => (
                <option key={field} value={field}>
                  {field}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration Contains
            </label>
            <input
              type="text"
              name="duration"
              value={filters.duration}
              onChange={handleFilterChange}
              placeholder="e.g., week, day, month"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Budget ($)
              </label>
              <input
                type="number"
                name="minBudget"
                value={filters.minBudget}
                onChange={handleFilterChange}
                placeholder="Min"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Budget ($)
              </label>
              <input
                type="number"
                name="maxBudget"
                value={filters.maxBudget}
                onChange={handleFilterChange}
                placeholder="Max"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Duration (Days)
              </label>
              <input
                type="number"
                name="minDuration"
                value={filters.minDuration}
                onChange={handleFilterChange}
                placeholder="Min"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Duration (Days)
              </label>
              <input
                type="number"
                name="maxDuration"
                value={filters.maxDuration}
                onChange={handleFilterChange}
                placeholder="Max"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="text" type="button" onClick={clearFilters}>
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
