let consumer;
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

                console.log('track')
                // Render the remote video track into a HTML video element.
                const { track } = consumer;
                console.log(track);
                const video  = document.createElement('video');
                video.setAttribute('autoplay','true');
                video.setAttribute('id',`td-${remoteProducerId}`);
                document.querySelector('.video').appendChild(video);
                document.getElementById(`td-${remoteProducerId}`).srcObject = new MediaStream([ track ]);
                // console.log(remoteVideo.srcObject);
                // remoteVideo.muted = true;
                // remoteVideo.play().catch(error => console.error("Error playing video:", error));

                
                socket.emit('resume',params.id);
            } catch(err){
                console.log("error consuming: ",err);
            }
        })        
    
}