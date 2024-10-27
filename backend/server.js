import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import cors from 'cors';
import { joinChatRoom } from './services/chatService.js';

const app = express();
const http = createServer(app);
const io = new Server(http, {
     cors: "http://localhost:5500"
})

export default io;

app.use(cors());
app.use(express.json());

io.on('connection',(socket) => {
    console.log('A client connected: ',socket.id);
    socket.on('disconnect',() => {
        console.log("A client disconected: ",socket.id);
        socket.emit('connectio-success',socket.id);

    })
    socket.on('joinChatRoom',(data,callback) => {
        console.log("roomId: ",data.roomId)
        console.log("name: ",data.name)
        joinChatRoom(data.roomId,socket);
        callback({
            id: socket.id
        });
    })
    socket.on('sendMessage',() => {

    })
    socket.on('recvMessage',() => {
        
    })
})

app.get('/', (req,res) => {
    res.send('hello');
    })
http.listen(3000,() => {
    console.log('Server is listening at port 3000 ...');
})