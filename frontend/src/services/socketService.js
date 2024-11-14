

class SocketService {
    constructor() {
      this.socket = null;
      // Add this to make the instance available globally
      window.socketService = this;
    }
  
    initialize() {
      if (!this.socket) {
        this.socket = io('http://127.0.0.1:3000', {
          autoConnect: false,
        });
      }
      return this.socket;
    }
  
    connect() {
      if (this.socket && !this.socket.connected) {
        this.socket.connect();
        this.socket.on('connect',() => {
          console.log('a user connected: ',this.socket.id);
          this.socket.emit('receiver',this.socket.id);

        })
      }
    }
  
    disconnect() {
      if (this.socket && this.socket.connected) {
        this.socket.disconnect();
      }
    }
  
    getSocket() {
      return this.socket;
    }
    // Add this method to make it easy to access from anywhere
    static getInstance() {
      return window.socketService;
    }
  }
// Create and expose the instance
const socketService = new SocketService();
socketService.initialize();
socketService.connect();
export const getSocket = () => socketService.getSocket();
// export default socketService;


// let currentUserId = null;
// export function createConnection(roomId,username){
    
//     console.log(`room id ${roomId} and username ${username}`);
//     // this is used because server will not initiate connection automatically as we have set 
//     // autoConnect: false
//    if(!socket.connected){
//     socket.connect();
//     return new Promise((resolve, reject) => {
//         socket.on('connect', () => {
//             currentUserId = socket.id;
//             console.log("A client connected: ",socket.id);
            
           
//             // sendMessage(socketId,socket);
//             resolve(socket);
//         })
//         socket.on('connect_error', (err) => {
//             console.log("Socket connection error:", err);
//             reject(err); // Reject if there’s a connection error
//           });
//     });
//    }
    
   
//     socket.on('disconnect',() => {
//         console.log('disconnected from server');
//     })
//     socket.on('recvMessage', ({msg,userId}) => {
//         console.log('message: ',msg);
//         displayMessage(msg,userId,currentUserId);
//     })
   
// }
