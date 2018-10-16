var port = process.env.PORT || 3000;

var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(port);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

var allListeningIds = ["intersection1", "intersection2", "intersection3"];

io.on('connection', function (socket) {
    
    socket.on('alive', function(data){
        console.log("client is alive : ", data);
    });

    socket.on('message', function(receivedMess){
        
        console.log("message received : ", receivedMess);

        var mess = {
            to : receivedMess.to,
            from : receivedMess.from,
            message : receivedMess.message 
        };

        io.emit(receivedMess.to,  mess);
    });
});

setInterval(function(){
  io.emit('alive', 'Server is alive : ' + new Date().getTime());
}, 1000);

console.log('Socket.io is listening on port ', port);