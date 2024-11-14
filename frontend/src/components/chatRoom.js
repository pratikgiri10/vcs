// chatRoom.js
import { message, recvChat} from "../services/chatService.js";

    const msg = document.getElementById('msg');
    const send = document.getElementById('send');
    const msgContainer = document.querySelector('.msgContainer');

    send.addEventListener('click',(e) => {
        e.preventDefault();
        const text = msg.value.trim();
        
        if (!text) {
            console.warn('Message is empty');
            return;
        }
    
        message(text);
        msg.value = "";
       
    });
    
    recvChat();
       
   
   
 export function displayMessage(msg,localUserId,remoteUserId){
    console.log(msg);
    console.log("server: ",remoteUserId);
    console.log("client: ",localUserId);
    const div = document.createElement('div');
   
    div.setAttribute('id',`id-${localUserId}`);
    const p = document.createElement('p');
    p.innerHTML = msg.content;
    msgContainer.appendChild(div);
    
    if(localUserId == remoteUserId)
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

