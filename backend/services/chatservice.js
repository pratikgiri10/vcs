
function joinChatRoom(data, socket){
    // the socket of specific client that is passed is used
    socket.join(data.roomId);
    console.log('a client joined the room: ',data.roomId);
    message(socket);
}
function message(socket){
    socket.on('chat',(msg) => {
        console.log('msg sent: ',msg);
        socket.emit('recvChat',msg);
    })
}
function receiveMessage(){

}
function fetchHistory(){

}

export { joinChatRoom, message, receiveMessage, fetchHistory };