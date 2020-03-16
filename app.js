var app = require('express')();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);

app.get('/', function(req,res){
    res.sendfile(__dirname+'/index.html');
})


var users = {};
io.on('connection', function (socket) {
   
    socket.on('new-user', function(message){
        users[socket.id] = message;
        socket.broadcast.emit('new-user-connected', message);
    })

    socket.on('send-chat-message',function(message){
        socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] });
    })
    socket.on('disconnect', function() {
        socket.broadcast.emit('user-disconnected', users[socket.id]);
        delete users[socket.id];
      })
    
      
    

});


server.listen(8080);
