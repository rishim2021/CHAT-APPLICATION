const express = require("express");

const app = express();

const server = require("http").createServer(app);

const io = require("socket.io")(server,{cors:{origin:"*"}})

const mongoose = require('mongoose');

const chatModel = require('./models/chat').Chat;

const cors = require('cors');

const url = "mongodb+srv://rishi:rishi@cluster0.44u6n.mongodb.net/chat?retryWrites=true&w=majority";

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true},(err)=>{
    if(err){
        console.log(err)
    }else{
        console.log("Database connected ....")
    }
});


// const db = mongoose.connection;

// db.on('error',console.error.bind(console,'connection error'));

// db.once('open',()=>{
//     console.log("Database connected ...")
// })

app.use(cors())
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.set('view engine','ejs');

app.get('/chat',async (req,res)=>{
    let data = await chatModel.find();
    if(!data) return res.status(400).send({ status:'404', msg:'Not Found' });
    return res.status(200).send({ status:'200', data:data })
})

app.post('/chat',async(req,res)=>{
    let bodyData = req.body;
    let postData = new chatModel();
    postData.chat = bodyData.chat;
    postData.save()
    return res.status(200).send({ status:'200', msg:"Sucessfully Submitted.." })
    
})

app.post('/chat/:id',async(req,res)=>{
    let data = await chatModel.findByIdAndDelete(req.params.id)
  
    return res.status(200).send({ status:'200', msg:"Sucessfully deleted ..." })
})



server.listen(3000,()=>{
    console.log("server running...")
})

io.on('connection',(socket)=>{
    console.log("user connected " + socket.id)
    socket.on("message",(data)=>{
        console.log(data)
        socket.broadcast.emit("message",data)
    })

})