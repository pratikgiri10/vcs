let validRooms = 2002;
export function createRoom(){

}
export function joinRoom(req,res){
    const { roomId } = req.body;
    console.log('roomId: ',roomId);
    // Check if the room ID is in the list of valid rooms
    if (validRooms == roomId) {
      return res.json({ valid: true });
    } else {
      return res.json({ valid: false });
    }
}
export function leaveRoom(){

}