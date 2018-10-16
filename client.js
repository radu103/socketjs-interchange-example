var socketClient = require('socket.io-client');

var listeningID = process.env.INTERSECTION_ID || "intersection2";
var publishingIds = ["intersection1", "intersection3"];
var socketServerUrl = process.env.SOCKET_SERVER_URL || 'https://stm-socketioservice.cfapps.eu10.hana.ondemand.com';

var intervalFunc;

if(listeningID){

    var socket = socketClient(socketServerUrl);

    socket.on('connect', function(){
        console.log('socketio connected');
    });
    
    socket.on('alive', function(data){
        console.log("client heartbeat received : " , data);
    });
    
    socket.on(listeningID, function(data){
        console.log(listeningID + " received on client : " , data);
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

        socket.emit('alive', 'client :' + new Date().getTime());
        console.log("client still opened");

    }, 1000);

    socket.on('disconnect', function(){
        clearInterval(intervalFunc);
        intervalFunc = null;
    });
}