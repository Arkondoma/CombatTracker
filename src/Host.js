import React from "react";

class Host extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        loading: true,
        characters: [],
      };
    }
  
    componentDidMount() {
      
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
            Loading done
        </div>
      );
    }
  };
  
  export default Host;