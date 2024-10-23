const { io } = require('socket.io-client');
const socket = io('http://localhost:3000');
const mediasoupClient = require('mediasoup-client');

const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const start = document.getElementById('start');
const join = document.getElementById('join');



// import { roomId } from './modules/validate';

let rtpCapabilities;
let device;
let sendTransport;
let recvTransport;
let producer;
let consumer;
let isProducer = false;

start.addEventListener('click',async () => {
    // await initializeSocket();
    console.log('start button')
    await initializeDevice();
    setTimeout(function(){
        createSendTransport();

    },500);
    
})
join.addEventListener('click',async () => {
    // await initializeSocket();
    console.log('join button')
    // await initializeDevice();
    // setTimeout(function(){
    //     createRecvTransport();

    // },800)
})
function getQueryString(){
    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get('roomId');
    console.log('roomid: ',roomId);
    return roomId;
}
const roomId = getQueryString();
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
socket.on('connect', () => {
    console.log(`A client connected: ${socket.id}`);

    socket.emit('room',roomId,(data) => {
      
            console.log("new client joined the room")
            mediaStream();
            rtpCapabilities = data.rtpCapabilities;
      
    });
})

async function initializeDevice(){
    console.log("Initializing device");
    device = new mediasoupClient.Device();
    const routerRtpCapabilities = rtpCapabilities;
    await device.load({routerRtpCapabilities});
    console.log('Device loaded with rtpCapabilities: ',device.rtpCapabilities);
    // socket.emit('getRtpCapabilities',{},async (rtpCapabilities) => {
    //     console.log('getting rtpCapabilities: ',rtpCapabilities)
    //     const routerRtpCapabilities = rtpCapabilities;
    //     device = new mediasoupClient.Device();
    //     await device.load({routerRtpCapabilities});
    //     console.log('Device loaded with rtpCapabilities: ',device.rtpCapabilities);

    // })
}
async function getProducers(){
    console.log('producer exists');
    socket.emit('getProducers',{},({producerIds}) => {
        console.log("Producer ids: ",producerIds);
        producerIds.forEach(element => {
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
    const stream = await navigator.mediaDevices.getUserMedia({video: true});
    // localVideo.srcObject = stream;
    const track = stream.getVideoTracks()[0];
    console.log(track)
    try{
        console.log('before producing')
        producer = await sendTransport.produce({track});
        console.log("produced media")
        
    } catch(err){
        console.log("error in producing media: ",err);
    }
    
    
}

async function newConsumer(remoteProducerId){
    if(!device)
        console.log("Device not initialized");
   
        
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
                    console.log("calling consume")                  
                        
                            await consume(remoteProducerId,params.id,recvTransport);              
                  
                    
                } catch(err){
                    console.log("error in recv transport: ",err);
                }
            })
     

   
    
}
async function consume(remoteProducerId,consumerId,recvTransport){
    console.log("consume...");
        socket.emit('consume',{rtpCapabilities: device.rtpCapabilities,remoteProducerId,consumerId},async (params) => {
            try{
                console.log("before consuming")
                consumer = await recvTransport.consume({
                    id: params.id,
                    producerId: params.producerId,
                    kind: params.kind,
                    rtpParameters: params.rtpParameters
                });
                console.log('track')
                // Render the remote video track into a HTML video element.
                const { track } = consumer;
                console.log(track);

                remoteVideo.srcObject = new MediaStream([ track ]);
                // remoteVideo.muted = true;
                // remoteVideo.play().catch(error => console.error("Error playing video:", error));
                // console.log(remoteVideo.srcObject);
                socket.emit('resume',consumerId);
            } catch(err){
                console.log("error consuming: ",err);
            }
        })
        
    
}