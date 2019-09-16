import React from "react";
import app from "./base";
import Copyright from './Copyright.js';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Logo from './assets/LogoWithText.png';
import HostIcon from '@material-ui/icons/People';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import { mainListItems } from './listItems';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from './Title';
import useStyles from './Theme';

const firebase = require("firebase");
require("firebase/firestore");
var database = firebase.firestore();

// Generate Order Data
function createData(id, name, c_class, level, hp) {
  return { id, name, c_class, level, hp };
}

// Read characters from database
async function loadCharacters() {
  const snapshot = await database.collection('characters').get();
  const chars = snapshot.docs.map(doc => doc.data());
  const uid = app.auth().currentUser.uid;
  var i = 0;
  var rows = [];

  try {
    chars.forEach(doc => {
      if (doc.userId === uid)
      {
        rows.push(createData(i++, doc.name, doc.c_class, doc.level, doc.hp));
        console.log(rows[i-1]);
      }
    });
    return rows;
  } catch(error) {
    alert(error);
  }
} 

function CharacterList(props) {
  const classes = useStyles();
  console.log("Loading: ", props.characters);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
            <Link color="primary" href="/">
              <img src ={Logo} alt = "Somebody yell at Nick" height = "60"/>
            </Link>
          <Container align="right">
            <Button
            variant="outlined"
            color="inherit"
            onClick={() => app.auth().signOut()}
            >
              <HostIcon /> &nbsp; Sign Out
            </Button>
          </Container>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.toolbar} />
        <Divider />
        <List>{mainListItems}</List>
        <Divider />
      </Drawer>
      <main className = {classes.content}>
        <div className = {classes.appBarSpacer} />
        <Container maxWidth = "lg" className = {classes.container}>
          <Grid container spacing = {3}>
            {/* Character List */}
            <Grid item xs = {12}>
              <Paper className = {classes.paper}>
              <Title>Characters</Title>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Class</TableCell>
                      <TableCell>Level</TableCell>
                      <TableCell>Hit Points</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Array.from(props.characters).map(row => (
                      <TableRow key={row.id}>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.c_class}</TableCell>
                        <TableCell>{row.level}</TableCell>
                        <TableCell>{row.hp}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className={classes.seeMore}>
                  <Link color="primary" href="./charactereditor">
                    Add new character
                  </Link>
                </div>
              </Paper>
            </Grid>
          </Grid>
        </Container>
        <Copyright />
      </main>
    </div>
  );
}

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
        <div> </div>
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
