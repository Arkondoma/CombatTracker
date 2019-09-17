import React from "react";
import { NewCharacter } from './FunctionalComponents';

const firebase = require("firebase");
require("firebase/firestore");

var database = firebase.firestore();

class CharacterEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      history: props.history,
    };
  }

  render()
  {
    if (this.state.loading) {
      return (
        <div> Loading </div>
      );
    }
    return (
      <div>
        <NewCharacter history = {this.state.history}/>
      </div>
    )
  }
    
};

export default CharacterEditor;