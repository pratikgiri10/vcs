// chatRoom.js
import { createConnection } from '../dist/bundle.js';
import { sendMessage } from '../services/chatService.js';

    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get('roomId');
    const username = urlParams.get('userName');

    if (!roomId || !username) {
        alert("Room ID or Username is missing");
    }

    // Initialize the connection with the retrieved roomId and username
    createConnection(roomId, username);

    const msg = document.getElementById('msg');
    const send = document.getElementById('send');
    const msgBox = document.querySelector('.msgBox');

    send.addEventListener('click', (e) => {
        e.preventDefault();
        const text = msg.value;
        sendMessage(text);
        const p = document.createElement('p');
        p.innerHTML = text;
        msgBox.appendChild(p);
    });

