import React from 'react';
import app from "./base";
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from './Title';

const firebase = require("firebase");
require("firebase/firestore");

var database = firebase.firestore();

var oldRows = [
  createData(0, 'Aegwyn', 'Ranger', 15, 150),
  createData(1, 'Ghost', 'Shaman', 15, 150),
];

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
  } catch(error) {
    alert(error);
  }

  return rows;
} 

const useStyles = makeStyles(theme => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));

export default function Characters() {
  const classes = useStyles();
  var rows = [];
  rows.concat(loadCharacters());
  console.log(rows);

  return (
    <>
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
          {rows.map(row => (
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
    </>
  );
}