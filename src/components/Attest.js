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
import { load3box, update3BoxProfile, load3BoxPublicProfile } from '../store/3box/actions';
import { signMessage } from '../helpers/utils';
import classnames from 'classnames';

import { addApprovedAttestation } from '../modules/firebase';
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
  small: {
    fontSize: '9pt'
  }
});

class Attest extends Component {
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
    const { requestorAddress } = this.props.match.params;

    this.props.dispatch(initWeb3());
    this.props.dispatch(load3BoxPublicProfile(requestorAddress));
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
  approveAttestation = async () => {
    const { requestorAddress, skillName, skillTimeStamp, requestorEmail } = this.props.match.params;
    const timeStamp = new Date().getTime();

    const message = `I attest that user ${this.props.publicProfile.name} (${requestorAddress}) has the following skill: ${skillName} (${skillTimeStamp}). Generated at ${timeStamp}`
    const signature = await signMessage(this.props.web3Address, message);
    let requesterName = this.props.publicProfile.name;
    await addApprovedAttestation(skillName, skillTimeStamp, this.props.profile3Box.name, this.props.web3Address, requestorAddress, decodeURIComponent(requestorEmail), timeStamp, signature, requesterName);
    this.setState({ isCompleted: true });

  }
  render() {
    const { requestorAddress, skillName, skillSignature, requestorEmail } = this.props.match.params;

    const { classes, web3Address, is3BoxLoaded } = this.props;
    return (
      <React.Fragment>
        <div className={classnames(classes.containerWhite, classes.containerPadding)}>
          <Typography variant="headline" gutterBottom align="center">You have been asked to send an attestation!</Typography>
          <br />
          <Typography variant="subheading" >Requestor Name: <span className={classes.textSecondary}>{this.props.publicProfile.name}</span></Typography>
          <Typography variant="subheading" >Requestor Email: <span className={classes.textSecondary}>{decodeURIComponent(requestorEmail)}</span></Typography>
          <Typography variant="subheading" gutterBottom>Requestor Address: <span className={classes.textSecondary}>{requestorAddress}</span></Typography>
          <br />
          <Typography variant="subheading" >Skill: <span className={classes.textSecondary}>{skillName}</span></Typography>
          {/* <Typography variant="subheading" >Created: <span className={classes.textSecondary}>{moment(skillTimeStamp).fromNow()}</span></Typography> */}
          <Typography variant="subheading" gutterBottom>Skill Signature: <span className={classnames(classes.textSecondary, classes.wrap, classes.small)}>{skillSignature}</span></Typography>

          <Typography variant="subheading">Your Address: <span className={classes.profileValue}>{web3Address}</span></Typography>
          {!is3BoxLoaded && web3Address !== requestorAddress && (
            <div className={classes.centerContainer}>
              <Button variant="contained" color="primary" className={classes.button} onClick={this.load3Box} disabled={web3Address === ''}>Load 3Box Profile</Button>
            </div>
          )}

          {is3BoxLoaded && (
            <React.Fragment>

              {this.props.profile3Box.name !== '' && (<Typography variant="subheading" >Your 3Box Name: <span className={classes.textSecondary}>{this.props.profile3Box.name}</span></Typography>)}
              {this.props.profile3Box.name === '' && (<Typography variant="subheading" >Your 3Box Name: <a href={routes.PROFILE()}>Create your profile</a></Typography>)}


              {!this.state.isCompleted && (
                <div className={classes.centerContainer}>
                  <Button variant="contained" color="primary" className={classes.button} onClick={this.approveAttestation} disabled={web3Address === ''}>Approve Attestation</Button>
                </div>
              )}
              {this.state.isCompleted && (
                <Typography variant="subheading" align="center">Attestation sent!</Typography>
              )}
            </React.Fragment >

          )}
        </div>
      </React.Fragment >
    );
    // return (
    //   <div>
    //     <div className={classnames(classes.containerWhite, classes.containerPadding)}>
    //       <Typography variant="subheading" gutterBottom>You have been asked to send an attestation!</Typography>


    //       <Grid container justify="space-between">
    //         <Grid item>
    //           <Typography variant="headline" gutterBottom>Your Ethereum Profile</Typography>
    //           <Typography gutterBottom noWrap className={classes.addressContainer}>Address: <span className={classes.profileValue}>{web3Address}</span></Typography>
    //         </Grid>
    //         <Grid item>
    //           <Avatar
    //             alt={this.state.name}
    //             src={avatar}
    //             className={classes.avatar}
    //           />
    //           <IpfsUpload fileUploadedCB={this.handleAvatarUploaded} caption="Edit" />
    //         </Grid>
    //       </Grid>
    //       <form className={classes.container} noValidate autoComplete="off">

    //         <TextField
    //           id="profile-name"
    //           label="Name"
    //           value={this.state.name}
    //           onChange={this.handleChange('name')}
    //           margin="normal"
    //           variant="outlined"
    //           // placeholder="Name"
    //           className={classes.textField}
    //         />
    //         <TextField
    //           id="profile-email"
    //           label="Email"
    //           value={this.state.email}
    //           onChange={this.handleChange('email')}
    //           margin="normal"
    //           variant="outlined"
    //           // placeholder="Name"
    //           className={classes.textField}
    //         />

    //         <div className={classes.centerContainer}>
    //           <Button variant="contained" color="primary" className={classes.button} onClick={this.update3BoxProfile} disabled={!hasChanged}> Update 3Box Profile</Button>
    //         </div>
    //       </form>
    //     </div>
    //     <MySkills />
    //   </div >
    // )
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

Attest.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(connect(mapStateToProps)(withStyles(styles)(Attest)));

