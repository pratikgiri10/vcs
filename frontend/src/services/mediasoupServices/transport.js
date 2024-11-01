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