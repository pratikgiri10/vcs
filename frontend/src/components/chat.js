
const join = document.getElementById('join');

join.addEventListener('click', (e) => {
    e.preventDefault();
    const id = document.getElementById('roomId').value;
    const userName = document.getElementById('username').value;
    if(!userName){
        alert("please enter your username");
    }
        
    else if (!id){
        alert("please enter a room id");
    }
       
    else{
       
            // Step 1: Validate the Room ID via an HTTP request
            fetch('http://localhost:3000/api/rooms/join', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ roomId: id })
            })
            .then(response => response.json())
            .then(data => {
            if (data.valid) {
                // Step 2: If the room ID is valid, redirect to meetingRoom.html
                window.location.href = `./meetingRoom.html?roomId=${id}&username=${userName}`;
            } else {
                // Step 3: If the room ID is invalid, show an error message
                alert('Invalid Room ID. Please try again.')
                
            }
            })
            .catch((error) => {
            console.error('Error:', error);
            alert('Error occurred while validating the Room ID.');
            });
      
    }
    
     
   
})
