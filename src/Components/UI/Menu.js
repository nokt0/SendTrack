import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {withStyles} from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Settings from '@material-ui/icons/Settings';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import InfoIcon from '@material-ui/icons/Info';
import '../../scss/Menu.scss';
import {getLog} from '../../SendTrack_lib.js';

import Mailito from './Mailito';


const GlobalCss = withStyles({
  // @global is handled by jss-plugin-global.
  '@global': {
    // You should target [class*="MuiButton-root"] instead if you nest themes.
    '.MuiPaper-root': {
      backgroundColor: '#f5f5f5bd',
    },

  },
})(() => null);

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
  button: {
    color: '#bdbdbd',
  },
  text: {
    padding: '10px',
    textAlign: 'center',
  },

});

export default function SwipeableTemporaryDrawer() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (side, open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({...state, [side]: open});
  };

  const sideList = (side) => (
    <div
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer(side, false)}
      onKeyDown={toggleDrawer(side, false)}
    >
      <List class={classes.text}>
        {'If you find error please report!'}
      </List>
      <Divider />
      <List>
        <ListItem button key='About App'>
          <ListItemIcon><InfoIcon /></ListItemIcon>
          <ListItemText primary='About App' />
        </ListItem>
        <ListItem button key='Settings'>
          <ListItemIcon><Settings /></ListItemIcon>
          <ListItemText primary='Settings' />
        </ListItem>
        <Mailito log={getLog()}/>
      </List>
    </div>
  );

  return (
    <div className="input-form__menu__button">
      <GlobalCss />
      <IconButton
        color="disabled"
        aria-label="open drawer"
        onClick={toggleDrawer('right', true)}
        edge="start"
        size="large"
        className={classes.button}
      >
        <MenuIcon className="menuIcon"/>
      </IconButton>
      <SwipeableDrawer
        anchor="right"
        open={state.right}
        onClose={toggleDrawer('right', false)}
        onOpen={toggleDrawer('right', true)}
      >
        {sideList('right')}
      </SwipeableDrawer>
    </div>
  );
}
