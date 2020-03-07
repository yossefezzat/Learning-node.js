var express = require('express')
var bodyParser = require('body-parser')

var app = express()
var http =  require('http').Server(app)
var io  = require('socket.io')(http)
var mongoose = require('mongoose')

mongoose.Promise = Promise

app.use(express.static(__dirname));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))


var dbUrl = "mongodb+srv://username:password@cluster0-1uzlx.mongodb.net/test?retryWrites=true&w=majority" 

var Message = mongoose.model('Message', {
    name: String,
    message: String
})

var messages = [
    {name:"yousssef" , message: "hello"}
]

app.get('/messages' , (req , res)=>{
    Message.find({} , (err , messages)=>{
        res.send(messages)
    })
})

app.get('/messages/:user' , (req , res)=>{
    var user = req.params.user
    Message.find({name: user} , (err , messages)=>{
        res.send(messages)
    })
})


app.post('/messages' , async (req , res)=>{

    try {
    var message = new Message(req.body)
    var savedMessage = await message.save()

       console.log ("saved")
    
    var censored = await Message.findOne({message:"badword"})

        if(censored)
            await Message.deleteOne({ _id: censored.id })
        else 
            io.emit('message' , req.body)
        res.sendStatus(200)

    } catch (error) {
        return console.error(error)
        res.sendStatus(500)
    } finally {
        console.log("should executed with or not an error :D ")
    }
})

io.on('connection' , (socket)=>{
    console.log("user is connected")
})

mongoose.connect(dbUrl ,{ useNewUrlParser: true , useUnifiedTopology: true  },  (err)=>{
    console.log("db connection" , err)
})
var server = http.listen(3000 , ()=>{
    console.log('server is listening to port' ,  server.address().port);
});
