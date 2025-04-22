import axios from 'axios';

const API_URL = 'http://localhost:8080/api/users';

export const fetchUsers = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

export const addUser = async (users) => {
    try {
        const response = await axios.post(API_URL, users);
        return response.data;
    } catch (error) {
        console.error('Error adding users:', error);
        throw error;
    }
};

export const updateUser = async (id, updatedUsers) => {
    try {
        console.log('old:', updatedUsers);
        const response = await axios.put(`${API_URL}/${id}`, updatedUsers);
        console.log('Updated users:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating users:', error);
        throw error;
    }
};

export const deleteUser = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting users:', error);
        throw error;
    }
};