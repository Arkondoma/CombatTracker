import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import socketIOCLient from "socket.io-client";

var socket;

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            endpoint: 'http://localhost:3001/'
        };
        socket = socketIOCLient(this.state.endpoint);
    }

    render() {
        return(
            <div> temp </div>
        )
    }
}

export { socket, Header };