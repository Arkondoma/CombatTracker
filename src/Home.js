import React, { useContext } from "react";
import { loadCharacters, CharacterList } from './FunctionalComponents';
import { AuthContext } from "./Auth.js";
import { Redirect } from "react-router";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      characters: [],
    };
  }

  componentDidMount() {
    loadCharacters().then((response) => {
      this.setState({
        loading: false,
        characters: response
      });
    });
  }

  render() {
    if (this.state.loading) {
      return (
        <div> Loading </div>
      );
    }
    return (
      <div>
        <CharacterList characters={this.state.characters}/>
      </div>
    );
  }
};

export default Home;
