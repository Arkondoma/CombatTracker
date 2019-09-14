import React from 'react';
import app from "./base";
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import HostIcon from '@material-ui/icons/People';

export const mainListItems = (
  <div>
    <ListSubheader inset> Session Options </ListSubheader>
    <ListItem button>
      <ListItemIcon>
        <HostIcon />
      </ListItemIcon>
      <ListItemText primary="Host Session" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <HostIcon />
      </ListItemIcon>
      <ListItemText primary="Join Session" />
    </ListItem>
  </div>
);

export const secondaryListItems = (
  <div>
    <ListSubheader inset> Account Options </ListSubheader>
    <ListItem button onClick={() => app.auth().signOut()}>
      <ListItemIcon>
        <HostIcon />
      </ListItemIcon>
      <ListItemText primary = "Sign out" />
    </ListItem>
  </div>
);