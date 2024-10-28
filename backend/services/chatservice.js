import io from '../server.js';
function joinChatRoom(roomId, socket){
    // the socket of specific client that is passed is used
    socket.join(roomId);
    console.log('a client joined the room: ',roomId);
}
function message(socket){
    
}
function receiveMessage(){

}
function fetchHistory(){

}

export { joinChatRoom, message, receiveMessage, fetchHistory };