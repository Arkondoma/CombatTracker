import React, { Component } from "react";
import socketIOClient from "socket.io-client";

var socket;

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            endpoint: 'http://localhost:3000/'
        };
        socket = socketIOClient(this.state.endpoint);
    }

    render() {
        return(
            <div> temp </div>
        )
    }
}

export { socket, Header };