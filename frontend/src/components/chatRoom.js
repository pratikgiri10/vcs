// chatRoom.js
import { createConnection, sendMessage } from '../services/chatService.js';


    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get('roomId');
    const username = urlParams.get('userName');

    if (!roomId || !username) {
        alert("Room ID or Username is missing");
    }
    else{
        createConnection(roomId, username);
    }

    // Initialize the connection with the retrieved roomId and username
   

    const msg = document.getElementById('msg');
    const send = document.getElementById('send');
    const msgContainer = document.querySelector('.msgContainer');

    send.addEventListener('click',(e) => {
        e.preventDefault();
        const text = msg.value;
        sendMessage(text);
        console.log('text: ',text);
        msg.value = "";
    });

 export function displayMessage(msg,socketIdS,socketIdC){
    console.log(msg);
    console.log("server: ",socketIdS);
    console.log("client: ",socketIdC);
    const div = document.createElement('div');
   
    div.setAttribute('id',`id-${socketIdC}`);
    const p = document.createElement('p');
    p.innerHTML = msg.content;
    msgContainer.appendChild(div);
    
    if(socketIdC == socketIdS)
    {
        p.style.backgroundColor = 'green';
        div.setAttribute('class','msgBoxRight');        
        const msgBoxRight = document.querySelector('.msgBoxRight');
        msgBoxRight.appendChild(p);
       
    }
    else{
        p.style.backgroundColor = 'white';
        div.setAttribute('class','msgBoxLeft');
        const msgBoxLeft = document.querySelector('.msgBoxLeft');
        msgBoxLeft.appendChild(p);
       
    }
   
}

