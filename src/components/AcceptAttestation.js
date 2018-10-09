import React, { Component } from 'react';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { initWeb3 } from '../store/web3/actions';

import * as web3Selectors from '../store/web3/reducer';
import * as profile3BoxSelectors from '../store/3box/reducer';
import { load3box, update3BoxProfile, load3BoxPublicProfile, update3BoxAttestations } from '../store/3box/actions';
import _ from 'lodash'
import classnames from 'classnames';
import routes from '../routes';
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
    top: theme.spacing.unit * 1,
    right: theme.spacing.unit * 1,
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
  textSecondary: {
    color: theme.palette.text.secondary
  },
  wrap: {
    wordWrap: 'break-word'
  },
  error: {
    color: 'red'
  }
});

class AcceptAttestation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      avatar: '',
      propsName: '',
      propsEmail: '',
      propsAvatar: '',
      isCompleted: false,
      isValidSignature: true,
    };
  }
  componentDidMount = async () => {
    const { attestorAddress } = this.props.match.params;

    this.props.dispatch(initWeb3());
    this.props.dispatch(load3BoxPublicProfile(attestorAddress));
    const { requestorAddress, skillName, attestationSignature, requesterName, skillTimeStamp, timeStamp } = this.props.match.params;

    const message = `I attest that user ${decodeURIComponent(requesterName)} (${requestorAddress}) has the following skill: ${skillName} (${skillTimeStamp}). Generated at ${timeStamp}`;
    let isValidSignature = await web3Selectors.verifySigner(message, attestationSignature, attestorAddress);
    // debugger;
    this.setState({ isValidSignature });

  }
  static getDerivedStateFromProps(props, state) {
    if (state.propsName !== props.profile3Box.name) {
      state.name = props.profile3Box.name;
      state.propsName = props.profile3Box.name;
    }
    if (state.propsEmail !== props.profile3Box.email) {
      state.email = props.profile3Box.email;
      state.propsEmail = props.profile3Box.email;
    }
    if (state.propsAvatar !== props.profile3Box.avatar) {
      state.avatar = props.profile3Box.avatar;
      state.propsAvatar = props.profile3Box.avatar;
    }
    return state;
  }
  load3Box = () => {
    this.props.dispatch(load3box(this.props.web3Address));
  }
  update3BoxProfile = () => {
    const { name, email, avatar } = this.state;

    this.props.dispatch(update3BoxProfile(name, email, avatar));
  }
  addAttestation = async () => {
    const { skillName, skillTimeStamp, attestationSignature, attestorAddress } = this.props.match.params;
    // const timeStamp = new Date().getTime();

    let newAttestations = _.cloneDeep(this.props.profile3Box.attestations);
    if (!newAttestations[skillName]) {
      newAttestations[skillName] = {};
    }
    newAttestations[skillName][attestationSignature] = {
      skillName,
      skillTimeStamp,
      attestorAddress,
      acceptedDate: new Date().getTime()
    }
    this.props.dispatch(update3BoxAttestations(newAttestations));
    this.setState({ isCompleted: true })
  }
  render() {
    const { requestorAddress, skillName, attestationSignature, attestorAddress } = this.props.match.params;

    const { classes, web3Address, is3BoxLoaded } = this.props;
    let isValidSignature = this.state.isValidSignature;
    console.log("valid:" + isValidSignature);
    return (
      <React.Fragment>
        <div className={classnames(classes.containerWhite, classes.containerPadding)}>
          <Typography variant="headline" align="center" gutterBottom>You have been attested!</Typography>
          <br />
          <Typography variant="subheading" >Attestor Name: <span className={classes.textSecondary}>{this.props.publicProfile.name}</span></Typography>
          <Typography variant="subheading" >Attestor Address: <span className={classes.textSecondary}>{attestorAddress}</span></Typography>
          <br />
          <Typography variant="subheading" >Skill: <span className={classes.textSecondary}>{skillName}</span></Typography>
          <br />
          {/* <Typography variant="subheading" >Created: <span className={classes.textSecondary}>{moment(skillTimeStamp).fromNow()}</span></Typography> */}
          <Typography variant="subheading" gutterBottom>Attestation Signature: <span className={classnames(classes.textSecondary, classes.wrap)}>{attestationSignature}</span></Typography>
          <br />

          {!isValidSignature && (
            <Typography align="center" className={classes.error}>Signature not valid!!!</Typography>
          )}

          {isValidSignature && !is3BoxLoaded && web3Address === requestorAddress && (
            <div className={classes.centerContainer}>
              <Button variant="contained" color="primary" className={classes.button} onClick={this.load3Box} disabled={web3Address === ''}>Load 3Box Profile</Button>
            </div>
          )}

          {isValidSignature && is3BoxLoaded && (
            <React.Fragment>

              {this.props.profile3Box.name !== '' && (<Typography variant="subheading" >Your 3Box Name: <span className={classes.textSecondary}>{this.props.profile3Box.name}</span></Typography>)}
              {this.props.profile3Box.name === '' && (<Typography variant="subheading" >Your 3Box Name: <a href={routes.PROFILE()}>Create your profile</a></Typography>)}


              {!this.state.isCompleted && (
                <div className={classes.centerContainer}>
                  <Button variant="contained" color="primary" className={classes.button} onClick={this.addAttestation} disabled={web3Address === ''}>Add Attestation to 3Box Profile</Button>
                </div>
              )}
              {this.state.isCompleted && (
                <React.Fragment>
                  <Typography variant="subheading" align="center">Attestation stored on 3Box!</Typography>
                  <a href={routes.PUBLIC_PROFILE(web3Address)}>Open public profile</a>
                </React.Fragment>
              )}
            </React.Fragment >

          )}
        </div>
      </React.Fragment >
    );
  }
}


function mapStateToProps(state) {
  return {
    web3Address: web3Selectors.getSelectedAccount(state),
    web3Provider: web3Selectors.getWeb3Provider(state),
    is3BoxLoaded: profile3BoxSelectors.is3BoxLoaded(state),
    profile3Box: profile3BoxSelectors.get3BoxProfile(state),
    publicProfile: profile3BoxSelectors.get3BoxPublicProfile(state)
  };
}

AcceptAttestation.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(connect(mapStateToProps)(withStyles(styles)(AcceptAttestation)));

