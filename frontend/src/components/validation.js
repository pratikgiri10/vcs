const form = document.querySelector('.formSubmit');
const btn = document.getElementById('signup');


btn.addEventListener('click',async (e) => {
    console.log('click');
    const userName = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const psw = document.getElementById('psw').value;
    e.preventDefault();
    if(!userName)
    {
        alert("please enter username");
       
    }
    else if(!email)
    {
        alert('please enter email');
       
    }
    else if(!psw)
    {
        alert('please enter password');
        
    }
    else{
        console.log('hello');
        fetch('http://localhost:3000/api/users/register',{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userName, psw }),
        })
        .then(async (response) => {
            const result = await response.json();
            console.log('result: ',result.valid);
        })
        .catch((err) => {
            console.log("error fetching: ",err)
        })

    }
})