import { displayMessage } from '../components/chatRoom.js';
// import { io } from 'socket.io-client';

let socket = null;
let currentUserId = null;


function createConnection(roomId,username){
    
    console.log(`room id ${roomId} and username ${username}`);
    // this is used because server will not initiate connection automaticall as we have set 
    // autoConnect: false
    socket = io('http://localhost:3000',{
        autoConnect: false
    });
    socket.connect();
    socket.on('connect', () => {
        currentUserId = socket.id;
        console.log("A client connected: ",socket.id);
        
        chatroom(roomId,username);
        // sendMessage(socketId,socket);
        
    })
    socket.on('disconnect',() => {
        console.log('disconnected from server');
    })
    socket.on('recvMessage', ({msg,userId}) => {
        console.log('message: ',msg);
        displayMessage(msg,userId,currentUserId);
    })
}


function chatroom(roomId,username){
    console.log(`imported room id ${roomId} and username ${username}`);
    console.log('chatroom socket: ',socket);
    socket.emit('joinChatRoom',{
        roomId: roomId,
        name: username
    });
}
function sendMessage(text){
    console.log('socket: ',socket);
    console.log('text: ',text);
    socket.emit('sendMessage',{
        
            content:text
        
    })
} 
    

export {
    createConnection,
    sendMessage,
}
