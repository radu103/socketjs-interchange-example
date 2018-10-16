var socketClient = require('socket.io-client');

var listeningID = process.env.INTERSECTION_ID || "intersection1";
var publishingIds = ["intersection2", "intersection3"];
var socketServerUrl = process.env.SOCKET_SERVER_URL || 'http://localhost:3000';

var intervalFunc;

if(listeningID){

    var socket = socketClient(socketServerUrl);

    socket.on('connect', function(){
        console.log('socketio connected');
    });
    
    socket.on('alive', function(data){
        console.log("publisher heartbeat received : " , data);
    });

    socket.on(listeningID, function(data){
        console.log(listeningID + " received on publisher : " , data);
    });

    intervalFunc = setInterval(function(){
            
        for(var i = 0; i < publishingIds.length; i++){
            
            var mess = { 
                from : listeningID, 
                to : publishingIds[i],
                message : new Date().getTime()
            };

            socket.emit("message", mess);
        }

        socket.emit('alive', 'publisher :' + new Date().getTime());
        console.log("publisher still opened");

    }, 1000);
    
    socket.on('disconnect', function(){
        clearInterval(intervalFunc);
        intervalFunc = null;
    });
}