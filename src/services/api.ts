import axios from 'axios';
import { Person } from '../types/Person';

const API_URL = 'https://api.example.com/api'; // Replace with your actual API URL

export const api = {
  getPersons: () => axios.get<Person[]>(`${API_URL}/persons`),
  getPerson: (id: number) => axios.get<Person>(`${API_URL}/persons/${id}`),
  createPerson: (person: Omit<Person, 'id'>) => axios.post<Person>(`${API_URL}/persons`, person),
  updatePerson: (id: number, person: Omit<Person, 'id'>) => axios.put<Person>(`${API_URL}/persons/${id}`, person),
  deletePerson: (id: number) => axios.delete(`${API_URL}/persons/${id}`)
};