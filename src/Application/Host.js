import React from "react";
import { HostPage } from "./HostComponents";
const shortid = require("shortid");

const io = require('socket.io-client');
var socket;

class Host extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        loading: true,
        characters: [],
        initiative: [],
        room: shortid.generate(),
      }; 
      socket = io.connect('http://localhost:4000');
      console.log('room code: ', this.state.room);
      socket.emit('create', this.state.room);
    }
  
    componentDidMount() {
      var state_current = this;
      this.setState({
        loading: false,
      });
      console.log("Page loaded, room code: ", this.state.room);
    }

    componentWillUnmount() {
      //socket.off("create_room");
    }
  
    render() {
      if (this.state.loading) {
        return (
          <div> 
              Loading 
          </div>
        );
      }
      return (
        <div>
            <HostPage room ={this.state.room}/>
        </div>
      );
    }
  };
  
  export default Host;