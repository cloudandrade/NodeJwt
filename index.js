const express = require('express')
const jwt = require('jsonwebtoken')
const app = express();

//sample route dafault
app.get('/', (req,res) => {
    res.send('app funcionando')
})

//sample route to api
app.get('/api', (req, res) => {
    res.json({
        text:'my api'
    })
})
//route to login and get token created
app.post('/api/login', (req,res) => {
    //creating a test object to obtain in the json web token
    const user = { 
        id: 3,
        name: "Jane Doe",
        age: 31
    };
    //passing the payload (the data you want to pass through) and defining  the secret key (the key you want to encapsule)
    const token = jwt.sign( {user}, 'my_secret_key'/*{expiresIn: 30 * 60} the expiration time*/ );
    //send a response receiving the json with the token created
    res.json({
        token: token
    })
})

app.get('/api/protected',ensureToken, (req, res) => {
    //get the token requested and the secret, send a callback function to verify and shows a error or the data
    jwt.verify(req.token, 'my_secret_key', function(err, data){
        if(err){
            res.sendStatus(403);
        }
        else{
            res.json({
                text: 'this is protected',
                data: data
            });
        }
    });
});

//creating a middleware
function ensureToken(req,res, next){
    //catching the requisition with header authorization
    const bearerHeader = req.headers["authorization"];
    //if the requisition token isn't undefined will do a request
    if (typeof bearerHeader != 'undefined'){
        //split string in a array everytime find the "[key of keyboard, in case space]"
        const bearer = bearerHeader.split(" ");
        //receiving the substring of the array splitted in second position
        const bearerToken = bearer[1];
        //sending token
        req.token = bearerToken;
        next();
    }else{
        res.sendStatus(403); // forbiden its' because i am sending a status code, why? i have no token, so
    }



}


app.listen(3000, function(){
    console.log('servidor rodando na porta 3000!')
})