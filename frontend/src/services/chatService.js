// import { roomId} from '../components/chat.js';
// import { username} from '../components/chat.js';
import   socket  from '../dist/bundle.js';
let socketId;
function chatroom(roomId,username, socket){
    console.log(`imported room id ${roomId} and username ${username}`);
    console.log('chatroom socket: ',socket);
    socket.emit('joinChatRoom',{
        roomId: roomId,
        name: username
    },({id}) => {
        socketId = id;
        console.log('socketId: ',socketId);
        // sendMessage(socketId,socket);
    })
}
function sendMessage(text){
    console.log('socket: ',socket);
    console.log('text: ',text);
    socket.emit('sendMessage', () => {
        const message = {
            to: socket.id,
            from:socketId,
            content:msg
        }
    })
}
function recvMessage(){
    socket.emit('recvMessage', () => {

    })
}
export {
    chatroom,
    sendMessage,
    recvMessage
}
