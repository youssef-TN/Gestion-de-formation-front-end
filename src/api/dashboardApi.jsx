import axios from 'axios';

const USER_API_URL = 'http://localhost:8080/api/users';
const TRAINING_API_URL = 'http://localhost:8080/api/trainings';
const TRAINER_API_URL = 'http://localhost:8080/api/trainers';
const PARTICIPANT_API_URL = 'http://localhost:8080/api/participants';

export const fetchStats = async () => {}

export const fetchRecentActivities = async (isAdmin=false) => {
	try {
		if(isAdmin){
			const user_response = await axios.get(`${USER_API_URL}/recentActivities`);
			const training_response = await axios.get(`${TRAINING_API_URL}/recentActivities`);
			const trainer_response = await axios.get(`${TRAINER_API_URL}/recentActivities`);
			const participant_response = await axios.get(`${PARTICIPANT_API_URL}/recentActivities`);
			return {
				users: user_response.data,
				trainings: training_response.data,
				trainers: trainer_response.data,
				participants: participant_response.data
			};
		}else{
			const training_response = await axios.get(`${TRAINING_API_URL}/recentActivities`);
			const trainer_response = await axios.get(`${TRAINER_API_URL}/recentActivities`);
			const participant_response = await axios.get(`${PARTICIPANT_API_URL}/recentActivities`);
			return {
				trainings: training_response.data,
				trainers: trainer_response.data,
				participants: participant_response.data
			};
		}
	} catch (error) {
		console.error('Error fetching participants:', error);
		throw error;
	}
};
