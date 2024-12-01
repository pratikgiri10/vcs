import { mediaCodecs } from "../config/mediaSoupConfig.js";
import mediaSoup from 'mediasoup';
let worker;
let router1;
async function createWorker(){
    worker = await mediaSoup.createWorker({
        rtcMinPort: 10000,
        rtcMaxPort: 10100,
        logLevel: 'warn',
    });
    console.log(`WorkerPid: ${worker.pid}`);

    // router = await worker.createRouter({mediaCodecs});
    // console.log(`Router: ${router}`);
    
}
createWorker();

async function createRoom(roomId,socketId,rooms){
    // let router1;
    let peers = [];

    if(rooms[roomId])
    {
        // if room already exists, then assign the router info that is stored in rooms obj to the router 1
        router1 = rooms[roomId].router;
        peers = rooms[roomId].peers || [];
        console.log('room already exists');
    }
    else{

        console.log("creating new room: ",roomId);
        router1 = await worker.createRouter({mediaCodecs});
        // console.log(`Router: ${router1}`);
        // rtpCapabilities = router.rtpCapabilities;
        // console.log('rtpCapabilities:',router.rtpCapabilities);
       
        // validRooms.push(roomId);
    }
    rooms[roomId] = { 
        router: router1,
        peers: [...peers,socketId]
    };

    return router1;
   
}
export {
    createWorker,
    createRoom,
    worker,
    router1,
}
