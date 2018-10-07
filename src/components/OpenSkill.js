
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';

import * as web3Selectors from '../store/web3/reducer';
import * as profile3BoxSelectors from '../store/3box/reducer';
import { update3BoxPendingAttestations } from '../store/3box/actions';
import TextField from '@material-ui/core/TextField';
import _ from 'lodash'
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import SendIcon from '@material-ui/icons/Send';
import { addPendingAttestation } from '../modules/firebase';

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
  mainContainer: {
    marginTop: theme.spacing.unit * 2,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  requestAttestationContainer: {
    display: 'flex'
  },
  requestAttestationEmail: {
    width: 400
  }
});



class OpenSkill extends Component {
  constructor(props) {
    super(props);
    this.state = {
      snackbarMessage: '',
      snackbarOpenState: false,
      deleteSkillDialogState: false,
      deleteSkillEntity: undefined,
      attestatorEmail: ''
    };
  }
  componentDidMount = () => {
    // this.props.dispatch(load3BoxAttestations());
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

  openSnackbar = message => {
    this.setState({ snackbarMessage: message, snackbarOpenState: true });
  }
  closeSnackbar = () => {
    this.setState({ snackbarMessage: '', snackbarOpenState: false });
  }
  addAttestor = async () => {
    let { pendingAttestations } = this.props.profile3Box;
    let newPendingAttestations = _.cloneDeep(pendingAttestations);

    const pendingAttestation = await addPendingAttestation(
      this.props.profile3Box.address,
      this.props.profile3Box.name,
      this.props.profile3Box.email,
      this.state.attestatorEmail,
      this.props.skill.name,
      this.props.skill.timeStamp,
      this.props.skill.signature,
    );

    if (!newPendingAttestations[this.props.skill.name]) {
      newPendingAttestations[this.props.skill.name] = [];
    }

    newPendingAttestations[this.props.skill.name].push(pendingAttestation);
    this.props.dispatch(update3BoxPendingAttestations(newPendingAttestations));
    this.openSnackbar(`Attestation request sent to ${this.state.attestatorEmail}`);
    this.setState({ attestatorEmail: '' });
  }
  render() {
    const { classes, is3BoxLoaded } = this.props;
    if (!is3BoxLoaded) {
      return (
        null
      );
    }
    // let skillAttestations = this.props.profile3Box.attestations[]
    return (
      <React.Fragment>
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
        <div className={classes.mainContainer}>
          {/* <Typography variant="headline">{this.props.skill.name}</Typography>
          <Typography variant="caption" gutterBottom>Created {moment(this.props.skill.timeStamp).fromNow()}</Typography> */}
          <Typography variant="subheading" gutterBottom>Request Attestation</Typography>
          <div className={classes.requestAttestationContainer}>
            <TextField
              autoFocus
              // margin="dense"
              id="request-email"
              label="Attestator Email"
              type="email"
              width={400}
              className={classes.requestAttestationEmail}
              value={this.state.attestatorEmail}
              onChange={this.handleChange('attestatorEmail')}
            />
            <Button variant="fab" mini color="primary" aria-label="Add" className={classes.button} disabled={this.state.attestatorEmail === ''}
              onClick={this.addAttestor}>
              <SendIcon />
            </Button>
          </div>
          {/* <Typography variant="subheading" gutterBottom>Pending Attestations Resquests</Typography> */}



          {/* <Typography variant="subheading">Who Attested me?</Typography> */}
        </div>
        {/* <Table className={classnames(classes.table, classes.root)}>
          <TableHead>
            <TableRow>
              <TableCell>Skill</TableCell>
              <TableCell>Date Added</TableCell>
              <TableCell># of attestations</TableCell>
              <TableCell></TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.skills.map(skill => {
              return (
                <TableRow key={skill.name}>
                  <TableCell component="th" scope="row">
                    {skill.name}
                  </TableCell>
                  <TableCell>{moment(skill.timeStamp).fromNow()}</TableCell>
                  <TableCell>??/??</TableCell>
                  <TableCell>
                    <Tooltip title="Request Attestations">
                      <IconButton
                        color="primary"
                        className={classes.button}
                        aria-label="Request Attestations"
                        onClick={this.openSkill(skill)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Skill">
                      <IconButton
                        color="primary"
                        className={classes.button}
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
        </Table> */}

        {/* <Tooltip title="Add Skill">
          <Button variant="fab" color="primary" aria-label="Add" className={classes.addSkillButton} onClick={this.openAddSkillDialog}>
            <AddIcon />
          </Button>
        </Tooltip> */}
        {/* </div>
        </div > */}
      </React.Fragment >
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

OpenSkill.propTypes = {
  classes: PropTypes.object.isRequired,
  skill: PropTypes.object.isRequired
};

export default withRouter(connect(mapStateToProps)(withStyles(styles)(OpenSkill)));

