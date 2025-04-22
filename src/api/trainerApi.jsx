import axios from 'axios';

const API_URL = 'http://localhost:8080/api/trainers';

// Fetch all trainers
export const fetchTrainers = async () => {
	try {
		const response = await axios.get(API_URL);
		return response.data;
	} catch (error) {
		console.error('Error fetching trainers:', error);
		throw error;
	}
};

// Add a new trainer
export const addTrainer = async (trainerData) => {
	try {
		const response = await axios.post(API_URL, trainerData);
		return response.data;
	} catch (error) {
		console.error('Error adding trainer:', error);
		throw error;
	}
};

// Update an existing trainer
export const updateTrainer = async (id, updatedData) => {
	try {
		const response = await axios.put(`${API_URL}/${id}`, updatedData);
		return response.data;
	} catch (error) {
		console.error('Error updating trainer:', error);
		throw error;
	}
};

// Delete a trainer
export const deleteTrainer = async (id) => {
	try {
		const response = await axios.delete(`${API_URL}/${id}`);
		return response.data;
	} catch (error) {
		console.error('Error deleting trainer:', error);
		throw error;
	}
};