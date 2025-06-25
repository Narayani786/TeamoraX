// Initializes socket connection

import { io } from 'socket.io-client';

    const socket = io('http://localhost:5000', {transports: ['websockets']});

export default socket;
