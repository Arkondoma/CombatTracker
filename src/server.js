const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const firebase = require("firebase");
require("firebase/firestore");
var database = firebase.firestore();

const port = process.env.PORT || 3000;
const app = express();

const server = http.createServer(app);

const io = socketIo(server);

io.on("connection", socket => {
    console.log("Somebody connected somehow");

    socket.on("initial_data", () => {
        //database.get
    })

    socket.on("disconnect", () => console.log("They're gone now"));
});

server.listen(port, () => console.log("Listening to ${port}, I guess"));