// import io from 'socket.io';
import { createWorker, createRoom } from './mediaSoupService.js';

async function createWebRtcTransport(router){
    try{
        const transport = await router.createWebRtcTransport(
            {
                listenInfos :
                [
                  {
                    ip               : "0.0.0.0", 
                    announcedIp      : "127.0.0.1"
                    
                  }
                ],
                enableUdp    : true,
                enableTcp    : true,
                preferUdp    : true
              }
        )
        transport.on('icestatechange',(state) => {
            console.log(`IceStateChange: ${state}`);
        })
        transport.on('dtlstatechange',(state) => {
            console.log(`dtlsStateChange: ${state}`);
        })
        console.log("Rooms: ",rooms);
        return transport;
    } catch(err){
        console.log("Cannot create transport: ",err);
    }
    
    
}

export async function initialize(io){
    io.on('connection',async (socket) => {
        console.log(`A user connected: ${socket.id}`);
        socket.on('room',async (roomId,callback) => {
                
            const router1 = await createRoom(roomId,socket.id);
            peers[socket.id] = {
                socket,
                roomId,           // id for the Router this Peer joined
                transports: [],
                producers: [],
                consumers: [],
                peerDetails: {
                  name: '',
                  isAdmin: false,   // Is this Peer the Admin?
                }
            }
    
            rtpCapabilities = router1.rtpCapabilities;
            callback({rtpCapabilities});          
         
        })
            
        
        
        // socket.on('getRtpCapabilities',async (_,callback) => {
        //         try{
        //             callback(rtpCapabilities);
        //         }catch(err){
        //             console.log('error sending rtpCapbilities')
                   
        //         }
                
        // });
    
        socket.on('createTransport',async({rtpCapabilities,consumer},callback) => {
            const roomId = peers[socket.id].roomId;
            const router = rooms[roomId].router;
            // console.log("room id in ct: ",roomId);
            try{            
                transport = await createWebRtcTransport(router);
                // console.log(`Producer Transport created: ${transport}`);
    
                // add transport to the transports array
                transports = [
                    ...transports,
                    {socketId: socket.id,transport,roomId,consumer}
                ]
                // add tranport to the peers obj
                peers[socket.id] = {
                    ...peers[socket.id],
                    transports: [...peers[socket.id].transports, transport]
                }
                // peers[socket.id].transports.push(transport);
               
                // console.log("peers: ",peers);
                // console.log("transports: ",transports);
                callback({
                    id: transport.id,
                    iceParameters: transport.iceParameters,
                    iceCandidates: transport.iceCandidates,
                    dtlsParameters:transport.dtlsParameters
                })
            } catch(err){
                console.log(`Error creating transport: ${err}`);
            }
           
        })
    
        // getting the producers except ourself from producers array
        socket.on('getProducers',(_,callback) => {
            const roomId = peers[socket.id].roomId;
            let producerList = [];
            producers.forEach(producerData => {
                if(producerData.socketId != socket.id && producerData.roomId == roomId)
                {
                    producerList = [
                        ...producerList,
                        producerData.producer.id
                    ]
                }
            })
            console.log('producerList: ',producerList);
            callback({producerList});
        })
    
        socket.on('producer-connect',async ({dtlsParameters}) => {
            // const producerTransport = peers[socket.id].transports;
            const [producerTransport] = transports.filter(transport => transport.socketId === socket.id && !transport.consumer)
            // console.log('producerTransport: ',producerTransport);
           
            try{
                await producerTransport.transport.connect({dtlsParameters});
                // console.log("dtlsParameters: ",producerTransport.transport.dtlsParameters);
               
            } catch(err){
                console.log('error connecting ',err);
            }
            // console.log(`producer-connect event: ${producerTransport.dtlsParameters}`);
        })
    
        //when the new producer is found inform the consumers 
        function informConsumers(producerId,socketId, roomId){
            let producerLists = [];
            // producerLists = producers.find(producerData => (producerData.socketId != socketId && producerData.roomId == roomId)).producer;
            console.log("inform about new producer");
            // socket.emit('newProducer',producerLists.id);
            producers.forEach(producerData => {
                if (producerData.socketId !== socketId && producerData.roomId === roomId) {
                //   const producerSocket = peers[producerData.socketId].socket
                  // use socket to send producer id to producer
                  const producerSocket = peers[producerData.socketId].socket
                  console.log("producerSocket: ",producerSocket.id);
                  producerSocket.emit('newProducer', { producerId: producerId })
                }
              })
        }
    
        socket.on('produce',async({kind, rtpParameters},callback) => {
            // const producerTransport = peers[socket.id].transports;
            // filtering producer transport from transport array
            const [producerTransport] = transports.filter(transport => transport.socketId === socket.id && !transport.consumer)
            // console.log('producer transport: ',producerTransport);
            const roomId = peers[socket.id].roomId;
            try{
                // using the filtered producer transport that matches the socketid to produce that producer media
                producer = await producerTransport.transport.produce({kind, rtpParameters});
                console.log("produce event: ",producer.id);
    
                //adding producer to peers
                peers[socket.id] = {
                    ...peers[socket.id],
                    producers:[
                        ...peers[socket.id].producers,
                        producer,
                    ]
                }
    
                //adding producer to producers
                producers = [
                    ...producers,
                    {producer,socketId: socket.id,roomId}
                ]
                console.log("producers: ",producers);
                // console.log("producers id: ",producers.producer);
                callback({
                    id: producer.id,
                    producerExists: producers.length>1?true: false
                })
    
                // inform about new producer
                informConsumers(producer.id,socket.id,roomId);
                // socket.emit('newProducer',{producerId: producer.id,socketId: socket.id});
    
            } catch(err){
                console.log('error producing: ',err);
            }        
        })
    
        // socket.on('createRecvTransport',async (rtpCapabilities,callback) => {
        //     const roomId = peers[socket.id].roomId;
        //     const router = rooms[roomId].router;
        //     console.log("room id in crt: ",roomId);
        //     try{
        //         consumerTransport = await createWebRtcTransport();
        //         console.log(`Consumer Transport created: ${consumerTransport}`);
        //         callback({
        //             id: consumerTransport.id,
        //             iceParameters: consumerTransport.iceParameters,
        //             iceCandidates: consumerTransport.iceCandidates,
        //             dtlsParameters:consumerTransport.dtlsParameters
        //         })
        //     } catch(err){
        //         console.log("error creating consumer transport: ",err);
        //     }
        // })
    
        socket.on('consumer-connect',async({dtlsParameters,consumerTransportId}) => {
            const [consumerTransport] = transports.filter(transportData => transportData.transport.id === consumerTransportId&& transportData.consumer)
            // console.log('consumerTransport: ',consumerTransport);
            try{
                await consumerTransport.transport.connect({dtlsParameters});
                console.log("consumer connected")
            } catch(err){
                console.log("error connecting consumer: ",err);
            }
        })
    
        socket.on('consume',async({rtpCapabilities,remoteProducerId,consumerTransportId},callback) => {
            const roomId = peers[socket.id].roomId;
            const [consumerTransport] = transports.filter(transportData => transportData.transport.id === consumerTransportId && transportData.consumer)
            // console.log('consumerTransport: ',consumerTransport);
            console.log("remote producer id: ",remoteProducerId)
            try{
                consumer = await consumerTransport.transport.consume({
                    rtpCapabilities,
                    producerId: remoteProducerId,
                    paused: true
                });
                console.log("consumed: ",remoteProducerId);
    
                // adding consumer to peers
                peers[socket.id] = {
                    ...peers[socket.id],
                    consumers:[
                        ...peers[socket.id].consumers,
                        consumer,
                    ]
                }
    
                // adding consumers to consumers
                consumers = [
                    ...consumers,
                    {consumer,socketId: socket.id,roomId}
                ]
                console.log("consumers: ",consumers);
                console.log("consumers id: ",consumer.id);
                // console.log('remoteproducerId: ',remoteProducerId);
    
                callback({
                    id: consumer.id,
                    producerId: remoteProducerId,
                    kind: consumer.kind,
                    rtpParameters: consumer.rtpParameters
                });
    
            } catch(err){
                console.log("error consuming: ",err);
            }
    
            socket.on('resume',async (consumerId) => {
              
                const { consumer } = consumers.find(consumerData => consumerData.consumer.id === consumerId)
                await consumer.resume();
                console.log("consumer resumed");
            })
        })
        
    
        
        // console.log('router rtpCapabilities: ',rtpCapabilities);
    })
}
