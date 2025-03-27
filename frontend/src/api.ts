// frontend/src/api.ts
import axios from 'axios';
import { GameState } from './types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const makeGuess = async (word: string): Promise<GameState> => {
    const response = await axios.post(`${API_BASE_URL}/guess`, { word });
    return response.data;
};

export const startNewGame = async (): Promise<GameState> => {
    const response = await axios.post(`${API_BASE_URL}/new-game`);
    return response.data;
};

export const getGameState = async (): Promise<GameState> => {
    const response = await axios.get(`${API_BASE_URL}/game-state`);
    return response.data;
};