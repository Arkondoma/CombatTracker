import React, { useCallback } from "react";
import app from "./base";
import Copyright from './Copyright.js';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Logo from './assets/LogoWithText.png';
import HostIcon from '@material-ui/icons/People';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import TextField from '@material-ui/core/TextField';
import useStyles from './Theme';

const firebase = require("firebase");
require("firebase/firestore");

var database = firebase.firestore();

function CharacterEditor({ history }) {
    const classes = useStyles();

    const UpdateCharacter = useCallback(async event => {
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
        history.push("/");
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
                <form className={classes.form} noValidate onSubmit={UpdateCharacter}>
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
                        href= "/"
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

export default CharacterEditor;