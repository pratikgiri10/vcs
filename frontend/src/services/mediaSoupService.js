// const { io } = require('socket.io-client');
// const socket = io('http://localhost:3000');
// import { socket, createConnection} from './socketService.js';
// import socketManager from './socketService.js';
import { getSocket } from "./socketService.js";
import { chatroom} from "./chatService.js";
import { initializeDevice } from '../dist/device.bundle.js';

// import { Device } from 'mediasoup-client';


const localVideo = document.getElementById('localVideo');
const videoElem = document.querySelector('.video');
// const remoteVideo = document.getElementById('remoteVideo');
const start = document.getElementById('start');
const leave = document.getElementById('leave');
const end = document.getElementById('end');
const screenShare = document.getElementById('screen');

// const join = document.getElementById('join');

let rtpCapabilities;
let device;
let sendTransport;
let recvTransport;
let videoProducer;
let audioProducer;
let screenProducer;
let consumer;
let consumerTransports = [];

const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get('roomId');
const userName = urlParams.get('username');
console.log('roomid: ',roomId);

let socket = getSocket();

( async () => {

    //    socket  = socketManager.initialize();
    //     socketManager.connect();
    //     socket.on('connect', async () => {
    //         console.log('Socket connected:', socket.id);
            rtpCapabilities = await chatroom(roomId, userName);
            console.log('routerRtpCapabilities: ',rtpCapabilities);
           
        // });
    }
)();

// export const getSocket = () => socketManager.getSocket();


start.addEventListener('click',async () => {
    // await initializeSocket();
    console.log('start button')
    await loadDevice();
    setTimeout(function(){
        createSendTransport();

    },500);
    
})
leave.addEventListener('click', () => {
   socket.disconnect();
})
end.addEventListener('click',() => {
    socket.emit('end',{});
})
const displayMediaOptions = {
    video: {
      displaySurface: "window",
    },
    audio: {
      suppressLocalAudioPlayback: false,
    },
    preferCurrentTab: false,
    selfBrowserSurface: "exclude",
    systemAudio: "include",
    surfaceSwitching: "include",
    monitorTypeSurfaces: "include",
  };
let screenCapture;

async function loadDevice(){
    device = await initializeDevice();
    console.log('device: ',device);
    console.log('rtpCapabilities: ',rtpCapabilities);
    const routerRtpCapabilities = rtpCapabilities;
    await device.load({routerRtpCapabilities});
    console.log('device rtpCapabilities',device.rtpCapabilities);
    mediaStream();
}

   
 
function streamSuccess(stream){
    localVideo.srcObject = stream;
}

async function mediaStream(){
   
   navigator.mediaDevices.getUserMedia({ audio: false, video: true})
   .then(stream => {
    streamSuccess(stream);
   })
   .catch((err) => {
    console.log(err);
   })
   
    
}

// socket.on('connect', () => {
//     console.log(`A client connected: ${socket.id}`);

//     socket.emit('room',roomId,(data) => {
      
//             console.log("new client joined the room")
//             mediaStream();
//             rtpCapabilities = data.rtpCapabilities;
      
//     });
// })


//get all the producers that are already in the room
async function getProducers(){
    console.log('producer exists');
    socket.emit('getProducers',{},({producerList}) => {
        console.log("Producer ids: ",producerList);
        producerList.forEach(element => {
            console.log("you are both producer and consumer")
            newConsumer(element);
        });
    })
}

async function createSendTransport(){
    if(!device)
        console.log("Device not initialized");

    socket.emit('createTransport',{rtpCapabilities: device.rtpCapabilities,consumer: false},async (params) => {
        console.log("Params from send tranport: ",params);
        try{
            sendTransport = await device.createSendTransport(params);
            
            sendTransport.on('connect',async ({dtlsParameters},callback,errback) => {
                console.log("dtlsparameters: ",dtlsParameters);
                try{
                    console.log("producer connect event")
                    socket.emit('producer-connect',{
                        id: sendTransport.id,
                        dtlsParameters
                    })
                    callback();
                } catch(err){
                    console.log("Error emitting produce-connect: ",err);
                    errback(err);
                }
            })

            sendTransport.on('produce',async (parameters,callback,errback) => {
                try{
                    console.log('produce event')
                    const { id } = socket.emit('produce',{
                        id: sendTransport.id,
                        kind: parameters.kind,
                        rtpParameters: parameters.rtpParameters
                    },({id,producerExists}) => {
                        console.log("producer exists: ",producerExists);
                        callback({id});

                        if(producerExists) getProducers();
                    }) 
                    
                } catch(err){
                    errback(err);
                }
            })

            sendTransport.on('icestatechange',(state) => {
                console.log("IceStateChange: ",state);
            })

            sendTransport.on('connectionstatechange',(state) => {
                console.log("ConnectionStateChange: ",state);
            })

            await produceMedia();

        } catch(err){
            console.log("Error creating sendTransport: ",err);
        }
        
    })
   
}

async function produceMedia(){
    console.log("producing media")
    const stream = await navigator.mediaDevices.getUserMedia({video: true, audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44100,
        suppressLocalAudioPlayback: true,
    }});
    screenShare.addEventListener('click' ,async () => {
        console.log('share screen')
        screenCapture = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
        console.log('screen capture: ',screenCapture);
        let screenTrack;
    if(screenCapture){
        console.log('producing screen capture')
        screenTrack = screenCapture.getVideoTracks()[0];
        try{
            screenProducer = await sendTransport.produce({
                track: screenTrack,
               
            });
        }catch(err){
            console.log("screen capture failed: ",err);
        }
        
        console.log('screen shared');
    }
    })
    // localVideo.srcObject = stream;
    const videoTrack = stream.getVideoTracks()[0];
    const audioTrack = stream.getAudioTracks()[0];
    
   
    // console.log(track)
    try{
        console.log('before producing')
        videoProducer = await sendTransport.produce({
            track: videoTrack,
           

        });
        audioProducer = await sendTransport.produce({track: audioTrack});
        
        console.log("produced media")
        
    } catch(err){
        console.log("error in producing media: ",err);
    }  
    videoProducer.on('trackended',() => {
        console.log('A track ended.');
    })
    videoProducer.on('transportClose', () => {
        console.log('video transport ended');
    })
}
let consumingTransports = [];
async function newConsumer(remoteProducerId){
    if(!device)
        console.log("Device not initialized");
    if(consumingTransports.includes(remoteProducerId)) 
        {
            console.log("already consumed");
            return;
            
        }
        else{
            console.log('pusing into consuming transports')
            consumingTransports.push(remoteProducerId);
        }
    
   
        
            socket.emit('createTransport',{rtpCapabilities: device.rtpCapabilities,consumer: true},async (params) => {
        
                try{                
                    recvTransport = await device.createRecvTransport(params);
                    console.log("recv transport created: ",params);

                    recvTransport.on('connect',async ({dtlsParameters},callback,errback) => {
                        try{
                            console.log('consumer connect');
                            socket.emit('consumer-connect',{    

                                dtlsParameters,
                                consumerTransportId: params.id
                            })
                            callback();
                        } catch(err){
                            console.log("Error emitting consumer-connect: ",err);
                            errback(err);
                        }
                    })
               
                    recvTransport.on('connectionstatechange',(state) => {
                        console.log("Consumer ConnectionStateChange: ",state);
                    })

                    console.log("calling consume");                  
                    console.log("remote producer id: ",remoteProducerId);

                    await consume(remoteProducerId,params.id,recvTransport);              
                  
                    
                } catch(err){
                    console.log("error in recv transport: ",err);
                }
            })  
    
}

socket.on('newProducer',({producerId}) => {
    console.log("inform about new producer: ",producerId);
    newConsumer(producerId);
})

async function consume(remoteProducerId,consumerTransportId,recvTransport){
    console.log("consume...");
        socket.emit('consume',{rtpCapabilities: device.rtpCapabilities,remoteProducerId,consumerTransportId},async (params) => {
            try{
                console.log("before consuming")
                console.log('producerId: ',params.producerId);

                consumer = await recvTransport.consume({
                    id: params.id,
                    producerId: params.producerId,
                    kind: params.kind,
                    rtpParameters: params.rtpParameters
                });
                consumerTransports = [
                    ...consumerTransports,
                    {
                        recvTransport,
                        consumer,
                        producerId: remoteProducerId,
                        serverConsumerTransportId: consumerTransportId
                    }
                ]
                console.log('track')
                // Render the remote video track into a HTML video element.
                const { track } = consumer;
                console.log(track);
                const video  = document.createElement('video');
                video.setAttribute('autoplay','true');
                video.setAttribute('id',`td-${remoteProducerId}`);
                // video.setAttribute('id',`sc-${remoteProducerId}`);
                const audio  = document.createElement('audio');
                audio.setAttribute('autoplay','true');
                audio.setAttribute('id',`td-${remoteProducerId}`);
                if(params.kind == 'video'){
                   
                    document.querySelector('.video').appendChild(video);
                   
                }
                else{
                    document.querySelector('.video').appendChild(audio);
                   
                }
                document.getElementById(`td-${remoteProducerId}`).srcObject = new MediaStream([ track ]);
                if(screenCapture){
                    console.log('screen captured');
                    document.getElementById(`td-${remoteProducerId}`).srcObject = screenCapture;
                }
                
                // console.log(remoteVideo.srcObject);
                // remoteVideo.muted = true;
                // remoteVideo.play().catch(error => console.error("Error playing video:", error));

                
                socket.emit('resume',params.id);
            } catch(err){
                console.log("error consuming: ",err);
            }
        })        
    
}
socket.on('producer-closed', (remoteProducerId) => {
    // server notification is received when a producer is closed
    // we need to close the client-side consumer and associated transport
    console.log('producer-closed event: ',consumerTransports);
    console.log('remoteProducerId: ',remoteProducerId);
    const producerToClose = consumerTransports.find(transportData => transportData.producerId === remoteProducerId);
    console.log('producerToClose: ',producerToClose);
    producerToClose.recvTransport.close()
    producerToClose.consumer.close()
    
    // remove the consumer transport from the list
    consumerTransports = consumerTransports.filter(transportData => transportData.producerId !== remoteProducerId)
  
    // remove the video div element
    document.querySelector('.video').removeChild(document.getElementById(`td-${remoteProducerId}`));
  })