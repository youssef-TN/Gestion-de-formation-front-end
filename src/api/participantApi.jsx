import axios from 'axios';

const API_URL = 'http://localhost:8080/api/participants';

export const fetchParticipants = async () => {
	try {
		const response = await axios.get(API_URL);
		return response.data;
	} catch (error) {
		console.error('Error fetching participants:', error);
		throw error;
	}
};

export const addParticipant = async (participant) => {
	try {
		const response = await axios.post(API_URL, participant);
		return response.data;
	} catch (error) {
		console.error('Error adding participant:', error);
		throw error;
	}
};

export const updateParticipant = async (id, updatedParticipant) => {
	try {
		console.log('old:', updatedParticipant);
		const response = await axios.put(`${API_URL}/${id}`, updatedParticipant);
		console.log('Updated participant:', response.data);
		return response.data;
	} catch (error) {
		console.error('Error updating participant:', error);
		throw error;
	}
};

export const deleteParticipant = async (id) => {
	try {
		const response = await axios.delete(`${API_URL}/${id}`);
		return response.data;
	} catch (error) {
		console.error('Error deleting participant:', error);
		throw error;
	}
};