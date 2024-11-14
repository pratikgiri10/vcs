// import socketManager from './socketService.js';
// import { getSocket } from './mediaSoupService.js';
import { getSocket } from './socketService.js';
import { displayMessage } from '../components/chatRoom.js';
let localUserId;
let remoteUserId;
export async function chatroom(roomId,username){
    const socket  = getSocket();
   
    console.log(`imported room id ${roomId} and username ${username}`);
    console.log('chatroom socket: ',socket);
    const rtpCapabilities = await new Promise((resolve,reject) => {
            socket.emit('room',{
                roomId: roomId,
                name: username
            },(data) => {
            if(data && data.rtpCapabilities){

                console.log('data: ',data.rtpCapabilities);
                // rtpCapabilities = data.rtpCapabilities;
                resolve(data.rtpCapabilities);
            }
            else{
                reject(new Error('Failed to get response'));
            }
         });
    })
    
    console.log('rtpCapabilities: ',rtpCapabilities);
    return rtpCapabilities;
}

export async function message(text){
    // const socket = window.socketService.getSocket();
    const socket = getSocket();
    console.log('socket: ', socket);
    // remoteUserId = socket.id;
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
   
    socket.on('recvChat',({msg,userId}) => {
        console.log('msg received: ',msg);
       
        displayMessage(msg,socket.id,userId);
    })
} 