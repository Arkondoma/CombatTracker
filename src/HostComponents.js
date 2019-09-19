import React, { Component } from "react";
import { socket } from "./header.js";
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

function HostPage() {
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
                        <TableRow>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell align='right'>
                              <IconButton>
                                <EditIcon/>
                              </IconButton> 
                            &nbsp;
                            <IconButton>
                              <DeleteIcon color="error"/>
                            </IconButton> 
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                    <div className={classes.seeMore}>
                      <Link color="primary" visited="primary" to="/newcharacter">
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

export { HostPage };