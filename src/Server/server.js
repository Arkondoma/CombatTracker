const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port =  process.env.PORT || 4000;
const app = express();

const server = http.createServer(app);

const io = socketIo(server);

io.on("connection", socket => {
    console.log("Somebody connected somehow");

    socket.on('create', function(room) {
        console.log('Room code: ', room);
        socket.join(room);
    })

    socket.on('join', function(room) {
        console.log('Attempting to join: ', room);
        console.log(room, " currently has ", io.sockets.clients('room'), " connections");
        if (io.sockets.clients('room') === 0) {
            socket.broadcast.to(room).emit("Invalid room code");
        }
    })

    socket.on("disconnect", () => console.log("They're gone now"));
});

server.listen(port, () => console.log(`Listening to ${port}, I guess`));