import dotenv from 'dotenv';
import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import cors from 'cors';
import { joinChatRoom, message } from './services/chatservice.js';
import connectDB from './config/mongooseConfig.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config({
    path: './env'
})

const app = express();
const http = createServer(app);
const io = new Server(http, {
     cors: "http://localhost:5500"
})

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies
app.use('/api/users',userRoutes);
// connectDB()
// .then(() => {    
//     http.listen(3000,() => {
//         console.log('Server is listening at port 3000 ...');
//     })
// })
// .catch((err) => {
//     console.log('Error loading server: ',err);
// })


// ( async () => {
//     try{
//        await mongoose.connect(`${process.env.MONGODB_URI}`);
//        app.on('error',(error) => {
//         console.log("err: ",error);
//        })
       
//     }catch(err){
//         console.log(err);
//     }
// })()




io.on('connection',(socket) => {
    const userId = socket.id;
    console.log('A client connected: ',socket.id);
    socket.emit('connection-succes',userId);
    socket.on('disconnect',() => {
        console.log("A client disconected: ",socket.id);
        

    })
    socket.on('joinChatRoom',(data) => {
        console.log("roomId: ",data.roomId)
        console.log("name: ",data.name)
        joinChatRoom(data.roomId,socket);
    })
    socket.on('sendMessage',(msg) => {
        console.log('message sent')
        message(socket,msg);
        io.emit('recvMessage',{msg,userId});
    })
    
    // socket.on('recvMessage',() => {
        
    // })
})

app.get('/', (req,res) => {
    res.send('hello');
 })
 http.listen(3000,() => {
            console.log('Server is listening at port 3000 ...');
        })
