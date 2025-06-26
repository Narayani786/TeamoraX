// Initializes socket connection

import { io } from 'socket.io-client';

    const socket = io(`${import.meta.env.VITE_API_URL}`, {transports: ['websockets']});

export default socket;
