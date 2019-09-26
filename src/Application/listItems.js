import React, { useCallback } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import HostIcon from '@material-ui/icons/People';
import PlayerIcon from  '@material-ui/icons/Person';
import RoomIcon from '@material-ui/icons/Info';
import { Link } from 'react-router-dom';
import { TextField } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';

export function roomCode(code) {
  return (
  <div>
    <ListSubheader inset> Room Code </ListSubheader>
    <ListItem>
      <ListItemIcon>
        <RoomIcon />
      </ListItemIcon>
      <ListItemText primary = {code} />
    </ListItem>
  </div>
  );
}

export const listCharacters = (
  <div>
    <ListSubheader inset> Characters </ListSubheader>
    <ListItem>
      <ListItemIcon>
        <PlayerIcon />
      </ListItemIcon>
      <ListItemText primary="placeholder" />
    </ListItem>
  </div>
)