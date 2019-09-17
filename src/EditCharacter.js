import React from "react";
import { EditCharacter, loadCharacter } from './FunctionalComponents';

class CharacterEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      history: props.history,
      documentId: this.props.match.params.character,
    };
  }

  componentDidMount() {
      loadCharacter(this.state.documentId).then((response) => {
          this.setState({
              loading: false,
              character: response
          });
      });
  }

  render()
  {
    if (this.state.loading) {
      return (
        <div> Loading </div>
      );
    }
    console.log("Successfully loaded: ", this.state.character);
    return (
      <div>
        <EditCharacter history = {this.state.history} chardata = {this.state.character}/>
      </div>
    )
  }
    
};

export default CharacterEditor;