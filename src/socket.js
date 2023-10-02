import { io } from 'socket.io-client';

//import.meta.env.VITE_API_URL ||
const URL =  'ws://localhost:4000';

export const socket = io(URL);  