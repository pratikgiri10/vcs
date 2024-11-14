const signup = document.getElementById('signup');
const signin = document.getElementById('signin');
if (signup){
    signup.addEventListener('click',async (e) => {
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
            fetch('http://127.0.0.1:3000/api/users/register',{
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userName, email, psw }),
            })
            .then(async (response) => {
               
                const result = await response.json();
                console.log('result: ',result);
            })
            .catch((err) => {
                console.log("error fetching register: ",err)
            })
    
        }
    })
}


if (signin){
    signin.addEventListener('click',(e) => {   
        console.log('click');
        const userName = document.getElementById('username').value;
        const psw = document.getElementById('psw').value;
        e.preventDefault();
            if(!userName)
            {
                alert("please enter username");
               
            }
            
            else if(!psw)
            {
                alert('please enter password');
                
            }
            else{
                console.log('hello')
                fetch('http://127.0.0.1:3000/api/users/login',{
                    credentials: 'include',
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json'},
                    body: JSON.stringify({userName, psw})
                })
                .then( async (response) => {
                  
                    const result = await response.json();
                    console.log('response: ',result);
                    window.location.href = './index.html';
                })
                .catch((err) => {
                    console.log('error fetching login: ',err);
                })
            }
    })
}
