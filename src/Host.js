import React from "react";
import { socket } from "./header.js";
import { HostPage } from "./HostComponents";

class Host extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        loading: false,
        characters: [],
        initiative: []
      };
    }
    
    getData = charStats => {
      console.log(charStats);
      this.setState({characters: charStats });
    };

    changeData = () => socket.emit("something for some reason");
  
    componentDidMount() {
      var state_current = this;
      socket.emit("why do these exist");
      socket.on("get_data", this.getData);
      socket.on("change_data", this.changeData);
    }

    componentWillUnmount() {
      socket.off("get_data");
      socket.off("change_data");
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