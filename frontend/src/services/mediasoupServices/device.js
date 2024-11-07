import { Device } from 'mediasoup-client';
let device;
async function initializeDevice(){
    console.log("Initializing device");
    device = new Device();
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