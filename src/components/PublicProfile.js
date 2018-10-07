import React, { Component } from 'react';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import { initWeb3 } from '../store/web3/actions';
import classnames from 'classnames';

import * as web3Selectors from '../store/web3/reducer';
import * as profile3BoxSelectors from '../store/3box/reducer';
import { load3box, update3BoxProfile, load3BoxPublicProfile } from '../store/3box/actions';
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
      isCompleted: false
    };
  }
  componentDidMount = () => {
    const { address } = this.props.match.params;

    this.props.dispatch(initWeb3());
    this.props.dispatch(load3BoxPublicProfile(address));
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

  render() {
    const { address } = this.props.match.params;
    const { name, attestations } = this.props.publicProfile;
    if (!attestations) {
      return null;
    }
    let skills = Object.keys(attestations);
    const { classes } = this.props;
    // const message = `I attest that user ${decodeURIComponent(requesterName)} (${requestorAddress}) has the following skill: ${skillName} (${skillTimeStamp}). Generated at ${timeStamp}`;
    // let isValidSignature = web3Selectors.verifySigner(message, attestationSignature, attestorAddress);
    return (
      <React.Fragment>
        <div className={classnames(classes.containerWhite, classes.containerPadding)}>
          <Typography variant="headline" gutterBottom align="center">Public Profile</Typography>

          <Typography variant="subheading" >Name: <span className={classes.textSecondary}>{name}</span></Typography>
          <Typography variant="subheading" gutterBottom>Address: <span className={classes.textSecondary}>{address}</span></Typography>
          {skills.map(skill => {
            return (
              <React.Fragment key={skill}>
                <Typography variant="title">{skill}</Typography>
                <Typography variant="caption">Attested by:</Typography>
                {
                  Object.values(attestations[skill]).map(attestation => {
                    // debugger;
                    return (
                      <Typography variant="caption" key={attestation.attestorAddress}>- {attestation.attestorAddress}</Typography>

                    )
                  })
                }
              </React.Fragment>
            )
          }
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

