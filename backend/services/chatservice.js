
function joinChatRoom(data, socket,io,userId){
    // the socket of specific client that is passed is used
   
    socket.join(data.roomId);
    console.log('a client joined the room: ',data.roomId);
    message(socket,io,userId);
   
}
function message(socket,io,userId){
    socket.on('chat',(msg) => {
        console.log('msg sent: ',msg);
        io.emit('recvChat',{msg,userId});
    })
}
function receiveMessage(){

}
function fetchHistory(){

}

export { joinChatRoom, message, receiveMessage, fetchHistory };