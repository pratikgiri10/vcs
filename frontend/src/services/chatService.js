// import socketManager from './socketService.js';
import { getSocket } from './mediaSoupService.js';
import { displayMessage } from '../components/chatRoom.js';

export function chatroom(roomId,username,socket){
    
    console.log(`imported room id ${roomId} and username ${username}`);
    console.log('chatroom socket: ',socket);
    socket.emit('room',{
        roomId: roomId,
        name: username
    });
}

export async function message(text){
    // const socket = window.socketService.getSocket();
    const socket = getSocket();
    console.log('socket: ', socket);
    // if (!socket) {
    //     console.warn('Socket not initialized, queuing message');
    //     return;
    // }
        try {
            console.log('Sending message:', text);
            socket.emit('chat', {
                content: text,
                timestamp: Date.now()
            });
        } catch (error) {
            console.error('Error sending message:', error);
            
        }         
    
   
}
export async function recvChat(){
    const socket = getSocket();
    socket.on('recvChat',(msg) => {
        console.log('msg received: ',msg);
        displayMessage(msg);
    })
} 