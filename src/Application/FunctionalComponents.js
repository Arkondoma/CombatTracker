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
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Title from './Title';
import useStyles from './Theme';
import { lighten, makeStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import FilterListIcon from '@material-ui/icons/FilterList';

const firebase = require("firebase");
require("firebase/firestore");
var database = firebase.firestore();

const io = require('socket.io-client');
var socket;

// Generate Order Data
function createData(id, name, c_class, level, hp) {
  return { id, name, c_class, level, hp };
}

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

const headCells = [
  { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
  { id: 'c_class', numeric: true, disablePadding: false, label: 'Class' },
  { id: 'level', numeric: true, disablePadding: false, label: 'Level' },
  { id: 'hp', numeric: true, disablePadding: false, label: 'Hit Points' },
];

function EnhancedTableHead(props) {
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox"/>
        {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={order}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? '' : ''}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell/><TableCell/>
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const useToolbarStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
}));

const EnhancedTableToolbar = props => {
  const classes = useToolbarStyles();
  const { numSelected } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      <div className={classes.title}>
        {numSelected > 0 ? (
          <Typography color="inherit" variant="subtitle1">
            {numSelected} selected
          </Typography>
        ) : (
          <Typography variant="h6" id="tableTitle">
            Characters
          </Typography>
        )}
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton aria-label="delete">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Filter list">
            <IconButton aria-label="filter list">
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        )}
      </div>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

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
        console.log("Reading from database: ", rows[i - 1]);
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
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('level');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  var rows = props.characters;
  console.log("Tabled character data: ", rows);

  const handleRequestSort = (event, property) => {
    const isDesc = orderBy === property && order === 'desc';
    setOrder(isDesc ? 'asc' : 'desc');
    setOrderBy(property);
  };

  const handleSelectAllClick = event => {
    if (event.target.checked) {
      const newSelecteds = rows.map(n => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleChangeDense = event => {
    setDense(event.target.checked);
  };

  const isSelected = name => selected.indexOf(name) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const joinRoom = useCallback(async event => {
    event.preventDefault();
    const { room } = event.target.elements;
    console.log("Searching for room: ", room.value);

    try {
      socket = io.connect('http://localhost:4000');
      socket.emit('join', room.value);
    } catch(error) {
      alert(error);
    }
  });

  return (
    <form onSubmit= {joinRoom}>
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
        <List>
        <div>
          <ListSubheader inset> Session Options </ListSubheader>
          <Link to="/host/" style={{color: 'black', textDecoration: 'none'}}>
            <ListItem button>
              <ListItemIcon>
                <HostIcon />
              </ListItemIcon>
              <ListItemText primary="Host Session" />
            </ListItem>
          </Link>
          <Divider/>
            <ListItem button type="submit" component="button">
              <ListItemIcon>
                <HostIcon />
              </ListItemIcon>
              <ListItemText primary="Join Session" />
            </ListItem>
            <ListItem>
              <TextField
                variant="outlined"
                margin="normal"
                required
                id="room"
                label="Session"
                name="room"
                type = "text"
              />
            </ListItem>
        </div>
        </List>
        <Divider />
      </Drawer>
      <main className = {classes.content}>
        <div className = {classes.appBarSpacer} />
        <Container maxWidth = "lg" className = {classes.container}>
          <Grid container spacing = {3}>
            {/* Character List */}
            <Grid item xs = {12}>
              <Paper className = {classes.paper}>
              <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={event => handleClick(event, row.id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row" padding="none">
                        {row.name}
                      </TableCell>
                      <TableCell align="right">{row.c_class}</TableCell>
                      <TableCell align="right">{row.level}</TableCell>
                      <TableCell align="right">{row.hp}</TableCell>
                      <TableCell align='right'>
                          <Link to = {'/character/' + row.id}>
                            <IconButton>
                              <EditIcon/>
                            </IconButton> 
                          </Link>
                        </TableCell>
                        <TableCell>
                          <IconButton onClick={() => HandleDelete(row.id)}>
                            <DeleteIcon color="error"/>
                          </IconButton> 
                        </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
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
    </form>
  );
}

function NewCharacter({ history }) {
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
            <Link color="primary" to="/home">
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

async function loadCharacter(character) {
    let snapshot = database.collection('characters').doc(character);
    let char = await snapshot.get();
    try {
        console.log("Loading: ", char.data())
        return char.data();
    } catch(error) {
        console.log(error);
    }
}

function EditCharacter({ history, chardata, docId }) {
    const classes = useStyles();

    const UpdateCharacter = useCallback(async event => {
        event.preventDefault();
        const { name, c_class, level, hp, 
                strength, dexterity, constitution, intelligence, wisdom, charisma, 
                initmod, ac, perception } = event.target.elements;
        try {
          if (window.confirm('Are you sure you want to modify this character?')) {
          await app.auth()   
          const userId = app.auth().currentUser.uid;     
          database.collection("characters").doc(docId).set({
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
        }
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
              <Link color="primary" to="/home">
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
                          defaultValue = {chardata.name}
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
                          defaultValue = {chardata.c_class}
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
                          defaultValue = {chardata.level}
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
                          defaultValue = {chardata.hp}
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
                          defaultValue = {chardata.str}
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
                          defaultValue = {chardata.dex}
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
                          defaultValue = {chardata.con}
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
                          defaultValue = {chardata.int}
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
                          defaultValue = {chardata.wis}
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
                          defaultValue = {chardata.cha}
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
                          defaultValue = {chardata.initmod}
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
                          defaultValue = {chardata.ac}
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
                          defaultValue = {chardata.perc}
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
                          Update Character
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
}

export { loadCharacters, loadCharacter, CharacterList, NewCharacter, EditCharacter };