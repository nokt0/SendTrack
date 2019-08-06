import React, { Component } from 'react';
import ListItem from '@material-ui/core/ListItem';
import BugReport from '@material-ui/icons/BugReport';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import '../scss/Mailito.scss';

export default class Mailito extends Component{

  constructor(props){
    super(props);
    this.state = {
      mail: 'mailto:vlad60870@gmail.com?subject=Bug%20Report?&body=Describe%20what%20happen%3A%20%22%20%22%0A%0A',
      log: encodeURI(this.props.log),
    };
  }

   render(){
       return(
        <a href={this.state.mail + this.state.log} className="Mailito">
        <ListItem button key='Bug Report'>
        <ListItemIcon><BugReport /></ListItemIcon>
        <ListItemText primary='Bug Report' />
      </ListItem></a>
       );
   }
}