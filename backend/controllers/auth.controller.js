export function login(req,res){

    const { username, psw: password } = req.body;
    res.send(`Username: ${username}, password: ${password}`)
   
}

export function register(req,res){
    res.send({valid: true});
}