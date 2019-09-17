import React from "react";
import { CharacterEdit } from './FunctionalComponents';

class CharacterEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      history: props.history,
      documentId: props.docId,
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
        <CharacterEdit history = {this.state.history}/>
      </div>
    )
  }
    
};

export default CharacterEditor;