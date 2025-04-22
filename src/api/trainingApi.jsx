import axios from 'axios';

const API_URL = 'http://localhost:8080/api/trainings';

export const fetchTrainings = async () => {
	try {
		const response = await axios.get(API_URL);
		console.log('Fetched trainings:', response); // Log the fetched data
		return response.data;
	} catch (error) {
		console.error('Error fetching trainings:', error);
		throw error;
	}
};

export const addTraining = async (trainingData) => {
	try {
		const response = await axios.post(API_URL, trainingData);
		return response.data;
	} catch (error) {
		console.error('Error adding training:', error);
		throw error;
	}
};

export const updateTraining = async (id, updatedData) => {
	try {
		console.log('old:', updatedData);
		const response = await axios.put(`${API_URL}/${id}`, updatedData);
		return response.data;
	} catch (error) {
		console.error('Error updating training:', error);
		throw error;
	}
};

export const deleteTraining = async (id) => {
	try {
		const response = await axios.delete(`${API_URL}/${id}`);
		return response.data;
	} catch (error) {
		console.error('Error deleting training:', error);
		throw error;
	}
};