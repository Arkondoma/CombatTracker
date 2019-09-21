import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { AuthProvider } from "./Auth";
import Home from "./Home";
import Login from "./Login";
import SignUp from "./SignUp";
import PrivateRoute from "./PrivateRoute";
import EditCharacter from "./EditCharacter";
import NewCharacter from "./CharacterEditor";
import Host from "./Host";

class App extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
        authenticated: false,
      };
    }

  render()
  {
    return (
      <AuthProvider>
        <Router>
          <div>
            <Redirect from="/" to="/login" />
            <Redirect from="" to="/login" />
            <PrivateRoute path="/home" component = {Home} />
            <PrivateRoute path="/newcharacter" component = {NewCharacter} />
            <PrivateRoute path="/character/:character" component = {EditCharacter} />
            <PrivateRoute path="/host/" component = {Host} />
            <Route path="/login" component = {Login} />
            <Route path="/signup" component = {SignUp} />
          </div>
        </Router>
      </AuthProvider>
    );
  }
}

export default App;
