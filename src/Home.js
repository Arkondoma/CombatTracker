import React from "react";
import app from "./base";
import Copyright from './Copyright.js';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Characters from './Characters';
import Logo from './assets/LogoWithText.png';
import HostIcon from '@material-ui/icons/People';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import { mainListItems } from './listItems';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  toolbar: {

  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    background: '#800000',
    zIndex:  theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  title: {
    flexGrow: 1,
  },
  grid: {
    direction: 'row',
    alignItems: 'left',
    VerticalAlign: 'text-bottom',
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
}));

const Home = () => {
  const classes = useStyles();

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
                <Characters />
              </Paper>
            </Grid>
          </Grid>
        </Container>
        <Copyright />
      </main>
    </div>
  );
};

export default Home;
