
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';

import * as web3Selectors from '../store/web3/reducer';
import * as profile3BoxSelectors from '../store/3box/reducer';
import { update3BoxSkills } from '../store/3box/actions';
import TextField from '@material-ui/core/TextField';

import AddIcon from '@material-ui/icons/Add';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import moment from 'moment-timezone';
import Tooltip from '@material-ui/core/Tooltip';
import _ from 'lodash'
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import ShareIcon from '@material-ui/icons/Share';
import { signMessage } from '../helpers/utils';
import classnames from 'classnames';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import DeleteIcon from '@material-ui/icons/Delete';
import OpenSkill from './OpenSkill';

const styles = theme => ({
  centerContainer: {
    textAlign: 'center',
    padding: theme.spacing.unit * 3,
  },
  button: {
  },
  textField: {
    width: '100%'
  },
  profileValue: {
    color: theme.palette.text.secondary,
    paddingLeft: theme.spacing.unit,
  },
  rightContainer: {
    textAlign: 'right'
  },
  avatarContainer: {
    display: 'flex',
  },
  avatar: {
    width: 80,
    height: 80,

  },
  dividerContainer: {
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  drawerPaper: {
    position: 'relative',
    width: 180,
  },
  mySkillsContainer: {
    position: 'relative',
  },
  addSkillButton: {
    position: 'absolute',
    top: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
  },
  close: {
    padding: theme.spacing.unit / 2,
  },
  containerWhite: {
    backgroundColor: 'white',
    marginBottom: theme.spacing.unit * 3,
  },
  containerPadding: {
    paddingTop: theme.spacing.unit * 3,
    paddingBottom: theme.spacing.unit * 3,
    paddingLeft: theme.spacing.unit * 3,
    paddingRight: theme.spacing.unit * 3,
  },
  addressContainer: {
    width: 300
  },
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 640,
  },
  openSkillContainer: {
    padding: 0
  },
  skillDialog: {
    width: 640
  }

});


class MySkills extends Component {
  constructor(props) {
    super(props);
    this.state = {
      skills: '',
      propsSkills: '',
      addSkillName: '',
      addSkillDialogState: false,
      addSkillError: false,
      snackbarMessage: '',
      snackbarOpenState: false,
      deleteSkillDialogState: false,
      deleteSkillEntity: undefined,
      openSkillDialogState: false,
      skillOpened: undefined, // { name: "test", timeStamp: 123456789 }
    };
  }
  static getDerivedStateFromProps(props, state) {

    if (state.propsSkills !== props.profile3Box.skills) {
      state.skills = props.profile3Box.skills;
      state.propsSkills = props.profile3Box.skill;
    }
    return state;
  }


  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  addSkill = async () => {
    const { skills, addSkillName } = this.state;
    const foundIndex = skills.findIndex((skill) => { return skill.name === addSkillName });
    // debugger;
    if (foundIndex !== -1) {
      this.openSnackbar(`Skill ${addSkillName} already exists`);
      this.setState({ addSkillError: true });
      return;
    }

    const timeStamp = new Date().getTime();
    const message = `Skill:'${addSkillName}':Timestamp:'${timeStamp}'`;
    let signature = '';
    try {
      signature = await signMessage(this.props.web3Address, message);
    }
    catch (error) {
      return;
    }
    let newSkills = _.clone(skills);
    newSkills.push({ name: addSkillName, timeStamp: moment().valueOf(), message, signature });
    this.setState({
      skills: newSkills,
      addSkillDialogState: false,
      addSkillName: ''
    });
    this.props.dispatch(update3BoxSkills(newSkills));
    this.openSnackbar(`Skill ${addSkillName} added to your 3Box profile`);
  }
  openAddSkillDialog = () => {
    this.setState({ addSkillDialogState: true });
  }
  closeAddSkillDialog = () => {
    this.setState({ addSkillDialogState: false });
  }
  openSnackbar = message => {
    this.setState({ snackbarMessage: message, snackbarOpenState: true });
  }
  closeSnackbar = () => {
    this.setState({ snackbarMessage: '', snackbarOpenState: false });
  }

  openDeleteDialog = skill => () => {
    this.setState({ deleteSkillDialogState: true, deleteSkillEntity: skill });
  }
  closeDeleteDialog = () => {
    this.setState({ deleteSkillDialogState: false, deleteSkillEntity: undefined });
  }
  openSkillDialog = skill => () => {
    this.setState({ openSkillDialogState: true, skillOpened: skill });
  }
  closeSkillDialog = () => {
    this.setState({ openSkillDialogState: false, skillOpened: undefined });
  }
  deleteSkill = () => {
    let { skills, deleteSkillEntity } = this.state;
    const foundIndex = skills.findIndex((skill) => { return deleteSkillEntity.name === skill.name });
    if (foundIndex !== -1) {
      let newSkills = _.clone(skills);
      newSkills.splice(foundIndex, 1);
      this.props.dispatch(update3BoxSkills(newSkills));
      // let newAttestations = _.cloneDeep(this.props.profile3Box.attestations);

      // const foundIndexAttestation = newAttestations.findIndex((skill) => { return deleteSkillEntity.name === skill.name });

      this.setState({
        deleteSkillDialogState: false,
        deleteSkillEntity: undefined,
      })
      this.openSnackbar(`Skill ${deleteSkillEntity.name} deleted from your 3Box profile`);
    }
  }
  render() {
    const { classes, is3BoxLoaded } = this.props;
    if (!is3BoxLoaded) {
      return (
        null
      );
    }
    let deletedSkillName = this.state.deleteSkillEntity ? this.state.deleteSkillEntity.name : '';
    let skillOpenedName = this.state.skillOpened ? this.state.skillOpened.name : '';
    let skillOpenedTimeStamp = this.state.skillOpened ? moment(this.state.skillOpened.timeStamp).fromNow() : '';
    let attestations = this.props.profile3Box.attestations;
    return (
      <React.Fragment>
        <div className={classnames(classes.containerWhite)}>
          <div className={classes.mySkillsContainer}>
            <Dialog
              open={this.state.addSkillDialogState}
              onClose={this.closeAddSkillDialog}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title">Add new skill to your profile</DialogTitle>
              <DialogContent>
                <TextField
                  error={this.state.addSkillError}
                  autoFocus
                  margin="dense"
                  id="add-skill"
                  label="Skill"
                  type="text"
                  fullWidth
                  value={this.state.addSkillName}
                  onChange={this.handleChange('addSkillName')}
                />
                <Typography variant="caption">You will need to sign a message with your wallet</Typography>

              </DialogContent>
              <DialogActions>
                <Button onClick={this.closeAddSkillDialog} variant="outlined" color="primary">
                  Cancel
            </Button>
                <Button onClick={this.addSkill} variant="raised" color="primary">
                  Add
            </Button>
              </DialogActions>
            </Dialog>
            <Dialog
              open={this.state.deleteSkillDialogState}
              onClose={this.closeDeleteDialog}
              aria-labelledby="form-dialog-delete-title"
            >
              <DialogTitle id="form-dialog-delete-title">Do you want to delete this skill?</DialogTitle>
              <DialogContent>
                <Typography variant="caption" gutterbottom >The skill {deletedSkillName} is going to be deleted as well as the attestations associated to this skill.</Typography>
                <Typography variant="caption">Are you sure you want to proceed?</Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.closeAddSkillDialog} variant="outlined" color="primary">
                  Cancel
            </Button>
                <Button onClick={this.deleteSkill} variant="raised" color="primary">
                  Delete
            </Button>
              </DialogActions>
            </Dialog>
            <Dialog
              open={this.state.openSkillDialogState}
              onClose={this.closeSkillDialog}
              aria-labelledby="form-dialog-delete-title"
            >

              {/* <DialogTitle id="form-dialog-delete-title">{skillOpenedName}</DialogTitle> */}
              <DialogContent className={classnames(classes.containerPadding, classes.skillDialog)}>
                <Typography variant="headline">Skill: {skillOpenedName}</Typography>
                <Typography variant="caption">{skillOpenedTimeStamp}</Typography>
                <OpenSkill skill={this.state.skillOpened} />
              </DialogContent>
            </Dialog>
            <Snackbar
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              open={this.state.snackbarOpenState}
              autoHideDuration={4000}
              onClose={this.closeSnackbar}
              ContentProps={{
                'aria-describedby': 'message-id',
              }}
              message={<span id="message-id">{this.state.snackbarMessage}</span>}
              action={[
                <IconButton
                  key="close"
                  aria-label="Close"
                  // color="inherit"
                  className={classes.close}
                  onClick={this.closeSnackbar}
                >
                  <CloseIcon />
                </IconButton>,
              ]}
            />
            {/* <Paper className={classes.root}> */}
            <Typography variant="headline" gutterBottom className={classes.containerPadding}>My Skills</Typography>

            <Table className={classnames(classes.table, classes.root)}>
              <TableHead>
                <TableRow>
                  <TableCell>Skill</TableCell>
                  <TableCell>Added</TableCell>
                  <TableCell># of attestations</TableCell>
                  <TableCell></TableCell>

                </TableRow>
              </TableHead>
              <TableBody>

                {this.state.skills.map(skill => {
                  if (!attestations) debugger;
                  let numAttestations = attestations[skill.name] ? Object.keys(attestations[skill.name]).length : 0;
                  return (
                    <TableRow key={skill.name}>
                      <TableCell component="th" scope="row">
                        {skill.name}
                      </TableCell>
                      <TableCell>{moment(skill.timeStamp).fromNow()}</TableCell>
                      <TableCell>{numAttestations}</TableCell>
                      <TableCell>
                        <Tooltip title="Request Attestations">
                          <IconButton
                            color="primary"
                            // className={classes.button}
                            aria-label="Request Attestations"
                            onClick={this.openSkillDialog(skill)}
                          >
                            <ShareIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Skill">
                          <IconButton
                            color="primary"
                            // className={classes.button}
                            aria-label="Delete Skill"
                            onClick={this.openDeleteDialog(skill)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            {/* </Paper> */}

            <Tooltip title="Add Skill">
              <Button variant="fab" color="primary" aria-label="Add" className={classes.addSkillButton} onClick={this.openAddSkillDialog}>
                <AddIcon />
              </Button>
            </Tooltip>
          </div>
        </div>
      </React.Fragment>
    )
  }
}


function mapStateToProps(state) {
  return {
    web3Address: web3Selectors.getSelectedAccount(state),
    web3Provider: web3Selectors.getWeb3Provider(state),
    is3BoxLoaded: profile3BoxSelectors.is3BoxLoaded(state),
    profile3Box: profile3BoxSelectors.get3BoxProfile(state)
  };
}

MySkills.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(connect(mapStateToProps)(withStyles(styles)(MySkills)));

