import { io } from 'socket.io-client';
import { chatroom, sendMessage } from './chatService.js';
const socket = io('http://localhost:3000',{
    autoConnect: false
});

function createConnection(roomId,username){
    let socketId;
    console.log(`room id ${roomId} and username ${username}`);
    // this is used because server will not initiate connection automaticall as we have set 
    // autoConnect: false
    socket.connect();
    socket.on('connect', () => {
        console.log("A client connected: ",socket.id);
        chatroom(roomId,username,socket);
        // sendMessage(socketId,socket);
        return true;
    })
    socket.on('connection-succes',(id) => {
        socketId = id;
    })
    socket.on('disconnect',() => {
        console.log('disconnected from server');
    })
    return true;
}
export default socket;
export {
    createConnection
}