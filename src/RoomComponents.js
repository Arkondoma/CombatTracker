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

var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/something');
});

io.on('connection', function(socket) {
    console.log('somebody connected');
});

http.listen(3000, function() {
    console.log('listening on *:3000');
});

