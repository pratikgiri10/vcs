import dotenv from 'dotenv';
import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import cors from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { joinChatRoom, message } from './services/chatservice.js';
import connectDB from './config/mongooseConfig.js';
import userRoutes from './routes/userRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';
import scheduleRoutes from './routes/scheduleRoutes.js';
import { initialize } from './services/transportService.js';

dotenv.config({
    path: './env'
})

const app = express();
const http = createServer(app);
const io = new Server(http, {
     cors: "http://localhost:5500",
    //  credentials: true
})

app.use(cors({
    origin: "http://127.0.0.1:5500",
    credentials: true
}));
// app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies
app.use(session({
    secret: 'collab',
    resave: false,
    saveUninitialized: false,
    cookie: {
         secure: false,
         httpOnly: false,
        //  sameSite: 'lax',
        //  maxAge: 1000 * 60 * 60 * 24,
        }
  }))
app.use('/api/users',userRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/session',sessionRoutes);
app.use('/api/meeting', scheduleRoutes);
// function isAuthenticated (req, res, next) {
//     if (req.session.user) next()
//     else res.send('not authenticated.')
//   }
// app.get('/',isAuthenticated, (req,res) => {
//     res.send('welcome');
// })

initialize(io);
connectDB()
.then(() => {    
    http.listen(3000,() => {
        console.log('Server is listening at port 3000 ...');
    })
})
.catch((err) => {
    console.log('Error loading server: ',err);
})


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




//  io.on('connection',(socket) => {
//     const userId = socket.id;
//     console.log('A client connected: ',socket.id);
//     socket.emit('connection-succes',userId);
//     socket.on('disconnect',() => {
//         console.log("A client disconected: ",socket.id);
        

//     })
    
//     // socket.on('joinChatRoom',(data) => {
//     //     console.log("roomId: ",data.roomId)
//     //     console.log("name: ",data.name)
//     //     joinChatRoom(data.roomId,socket);
//     // })
//     // socket.on('sendMessage',(msg) => {
//     //     console.log('message sent')
//     //     message(socket,msg);
//     //     io.emit('recvMessage',{msg,userId});
//     // })
    
//     // socket.on('recvMessage',() => {
        
//     // })
// })

app.get('/', (req,res) => {
    res.send('hello');
 })
//  http.listen(3000,() => {
//             console.log('Server is listening at port 3000 ...');
//         })
