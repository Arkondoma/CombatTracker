import React from "react";
import { NewCharacter } from './FunctionalComponents';

class CharacterEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      history: props.history,
      documentId: this.props.match.params.character,
    };
  }

  render()
  {
    console.log(this.state.documentId);

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