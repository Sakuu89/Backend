const express = require('express');
const {connection} = require('./db');
const jwt = require('jsonwebtoken');
const UserModel = require('./user.model');
const app = express();
const bcrypt = require('bcrypt');
require('dotenv').config();
app.use(express.json())
app.get('/', (req, res)=>{
    res.send("API IS WORKING")
})

app.get('/tasks', (req, res)=>{
    res.send("TAsks")
});


// Hashing
app.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    bcrypt.hash(password, 5, async function(err, hash) {

        await UserModel.create({ email, password: hash });
        res.send({ msg: "Signup Successful" });

    });
        
});




app.post('/login', async(req, res)=>{
  const {email, password} = req.body;
  const user = await UserModel.findOne({email});
   
  if(!user){
    res.send({msg: "Login Failed"});
}

const hashed_pass = user.password;

  bcrypt.compare(password, hashed_pass, function(err, result) {
   if(result){
    const token = jwt.sign({org: "masai"}, 'shhhhhh')
    res.send({msg: "Login Sucessfull", token : token});
   }
  else{
    res.send({msg: "Login failed, invalid credentials"})
  }
}); 
    
});

const authentication = (req, res, next)=>{
    const token = req.headers.authorization?.split(" ")[1];
    jwt.verify(token, 'shhhhhh', function(err, decoded) {
        if(decoded){
           next();
            console.log(decoded.org) // masai
        }
        else{
            console.error(err);
            res.send({msg: "login first"})
        }
      
      });
}

app.get('/reports',authentication, async(req, res)=>{
    res.send({msg: "here are the reports"})
});

app.get('/contacts',authentication, async(req, res)=>{
    res.send({msg: "here are the contacts"})
});

app.get('/summary',authentication, async(req, res)=>{
    res.send({msg: "here are the summary"})
});
const PORT = process.env.PORT
app.listen(PORT, async()=>{
    try{ 
        await connection;
        console.log("connected to mongodb")
    }catch(err){
        console.log("error while connecting")
    }
});


// cd6357efdd966de8c0cb2f876cc89ec74ce35f0968e11743987084bd42fb8944  hash for cup