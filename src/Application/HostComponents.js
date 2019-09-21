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
import { Link } from 'react-router-dom';
import { roomCode, listCharacters } from './listItems';
import useStyles from './Theme';

function HostPage(props) {
    const classes = useStyles();
    
    return (
        <div className={classes.root}>
          <CssBaseline />
          <AppBar position="fixed" className={classes.appBar}>
            <Toolbar>
                <Link color="primary" to="/home">
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
            <List /> <List /> <List />
            <List> {roomCode(props.room)} </List>
            <Divider />
            <List>{listCharacters}</List>
            <Divider />
          </Drawer>
          <main className = {classes.content}>
            <div className = {classes.appBarSpacer} />
            <Container maxWidth = "lg" className = {classes.container}>
              <Grid container spacing = {3}>
                {/* Character List */}
                <Grid item xs = {12}>
                  <Paper className = {classes.paper}>
                  </Paper>
                </Grid>
              </Grid>
            </Container>
            <Copyright />
          </main>
        </div>
      );
}

export { HostPage };