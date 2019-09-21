const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port =  process.env.PORT || 4000;
const app = express();

const server = http.createServer(app);

const io = socketIo(server);

io.on("connection", socket => {
    console.log("Somebody connected somehow");

    socket.on("create_room", () => {
        console.log("Remote room created");
    })

    socket.on("disconnect", () => console.log("They're gone now"));
});

server.listen(port, () => console.log(`Listening to ${port}, I guess`));