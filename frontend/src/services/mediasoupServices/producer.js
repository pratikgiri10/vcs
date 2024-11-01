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