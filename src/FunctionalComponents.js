import React, {useCallback } from "react";
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
import EditIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import { mainListItems } from './listItems';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from './Title';
import useStyles from './Theme';
import { IconButton } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';

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
  const docs = snapshot.docs.map(doc => doc.id);
  const uid = app.auth().currentUser.uid;
  var rows = [];
  var i = 0;

  try {
    chars.forEach(doc => {
      if (doc.userId === uid)
      {
        rows.push(createData(docs[i++], doc.name, doc.c_class, doc.level, doc.hp));
        console.log(rows[i - 1]);
      }
    });
    return rows;
  } catch(error) {
    alert(error);
  }
} 

async function HandleDelete(doc) {
    if (window.confirm('Are you sure you want to delete this character?')) {
      await database.collection('characters').doc(doc).delete();
      window.location.reload();
    } else{
        return;
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
            href = "/login"
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
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Array.from(props.characters).map(row => (
                      <TableRow key={row.id}>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.c_class}</TableCell>
                        <TableCell>{row.level}</TableCell>
                        <TableCell>{row.hp}</TableCell>
                        <TableCell align='right'>
                          <IconButton>
                            <EditIcon/>
                          </IconButton> 
                          &nbsp;
                          {console.log("id: ", row.id)} 
                          <IconButton onClick={() => HandleDelete(row.id)}>
                            <DeleteIcon color="error"/>
                          </IconButton> 
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className={classes.seeMore}>
                  <Link color="primary" to="./newcharacter">
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

function CharacterEdit({ history }) {
    const classes = useStyles();

    const AddCharacter = useCallback(async event => {
      event.preventDefault();
      const { name, c_class, level, hp, 
              strength, dexterity, constitution, intelligence, wisdom, charisma, 
              initmod, ac, perception } = event.target.elements;
      try {
        await app.auth()   
        const userId = app.auth().currentUser.uid;     
        database.collection("characters").add({
          userId: userId,
          name: name.value,
          c_class: c_class.value,
          level: level.value,
          hp: hp.value,
          str: strength.value,
          dex: dexterity.value,
          con: constitution.value,
          int: intelligence.value,
          wis: wisdom.value,
          cha: charisma.value,
          initmod: initmod.value,
          ac: ac.value,
          perc: perception.value
        })
        history.push("/home");
      } catch(error) {
        alert(error);
      }
    }, [history]
    );

    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
          <Container>
            <Link color="primary" href="/">
              <img src ={Logo} alt = "Somebody yell at Nick" height = "60"/>
            </Link>
          </Container>
          <Container align="right">
            <Button
            variant="outlined"
            color="inherit"
            onClick={() => app.auth().signOut()}
            href = "/login"
            >
              <HostIcon /> &nbsp; Sign Out
            </Button>
          </Container>
          </Toolbar>
        </AppBar>
        <main className = {classes.content}>
          <div className = {classes.appBarSpacer} />
            <Container maxWidth = "lg" className = {classes.container}>
              <Paper className = {classes.paper}>
                <form className={classes.form} noValidate onSubmit={AddCharacter}>
                  <Grid container spacing={3} direction="row" justify="flex-start">
                    <Grid item xs={6}>
                      <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="Character Name"
                        name="name"
                        type = "text"
                        autoComplete="Hugh Mann"
                        autoFocus
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={3} direction="row" justify="flex-start">
                    <Grid item xs={2}>
                      <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="c_class"
                        label="Class"
                        name="c_class"
                        type = "text"
                        autoComplete="Fighter"
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="level"
                        label="Level"
                        name="level"
                        type = "number"
                        autoComplete="1"
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="hp"
                        label="Max Hit Points"
                        name="hp"
                        type = "number"
                        autoComplete="1"
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={3} direction="row" justify="flex-start">
                    <Grid item xs={6} sm={1}>
                      <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        id="strength"
                        label="STR"
                        name="strength"
                        type = "number"
                        autoComplete="10"
                      />
                    </Grid>
                    <Grid item xs={6} sm={1}>
                      <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        id="dexterity"
                        label="DEX"
                        name="dexterity"
                        type = "number"
                        autoComplete="10"
                      />
                    </Grid>
                    <Grid item xs={6} sm={1}>
                      <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        id="constitution"
                        label="CON"
                        name="constitution"
                        type = "number"
                        autoComplete="10"
                      />
                    </Grid>
                    <Grid item xs={6} sm={1}>
                      <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        id="intelligence"
                        label="INT"
                        name="intelligence"
                        type = "number"
                        autoComplete="10"
                      />
                    </Grid>
                    <Grid item xs={6} sm={1}>
                      <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        id="wisdom"
                        label="WIS"
                        name="wisdom"
                        type = "number"
                        autoComplete="10"
                      />
                    </Grid>
                    <Grid item xs={6} sm={1}>
                      <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        id="charisma"
                        label="CHA"
                        name="charisma"
                        type = "number"
                        autoComplete="10"
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={3} direction="row" justify="flex-start">
                    <Grid item xs={6} sm={2}>
                      <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        id="initmod"
                        label="Initiative Modifier"
                        name="initmod"
                        type = "number"
                        autoComplete="10"
                      />
                    </Grid>
                    <Grid item xs={6} sm={2}>
                      <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        id="ac"
                        label="AC"
                        name="ac"
                        type = "number"
                        autoComplete="10"
                      />
                    </Grid>
                    <Grid item xs={6} sm={2}>
                      <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        id="perception"
                        label="Passive Perception"
                        name="perception"
                        type = "number"
                        autoComplete="10"
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={3} direction="row" justify="flex-start">
                    <Grid item xs={6} sm={2}>
                      <Button
                        type="submit"
                        variant="outlined"
                        fullWidth
                        color="default"
                        className={classes.submit}
                      >
                        Save Character
                      </Button>
                    </Grid>
                    <Grid item xs={6} sm={2}>
                      <Button
                        href= "/home"
                        type="button"
                        variant="outlined"
                        color="default"
                        className={classes.submit}
                      >
                        Cancel
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Paper>
            </Container>
          <Copyright />
        </main>
      </div>
    );
};

export { loadCharacters, CharacterList, CharacterEdit };