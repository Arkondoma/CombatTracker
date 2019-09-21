import React from "react";
import { HostPage } from "./HostComponents";
import openSocket from "socket.io-client";

var socket = openSocket('http://localhost:4000');

class Host extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        loading: true,
        characters: [],
        initiative: []
      };
    }
    
    createRoom() {
      console.log("Local room created");
    }
  
    componentDidMount() {
      var state_current = this;
      //socket.emit("why do these exist");
      socket.on("create_room", this.createRoom);
      this.setState({loading: false});
      console.log("Page loaded");
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
            <HostPage />
        </div>
      );
    }
  };
  
  export default Host;