// Initializes socket connection

import { io } from 'socket.io-client';

    const socket = io('https://teamorax-backend.onrender.com', {transports: ['websockets']});

export default socket;
