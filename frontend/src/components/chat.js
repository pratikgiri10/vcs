
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
         
        window.location.href = `./chatRoom.html?roomId=${id}&userName=${userName}`;  
      
    }
    
     
   
})
