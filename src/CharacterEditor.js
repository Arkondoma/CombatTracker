import React from "react";
import { CharacterEdit } from './FunctionalComponents';

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
        <CharacterEdit history = {this.state.history}/>
      </div>
    )
  }
    
};

export default CharacterEditor;