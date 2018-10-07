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
import { load3box, update3BoxProfile } from '../store/3box/actions';
import TextField from '@material-ui/core/TextField';
import IpfsUpload from './ipfs/ipfs-upload/IpfsUpload';
import Avatar from '@material-ui/core/Avatar';
import classnames from 'classnames';
import Grid from '@material-ui/core/Grid';
import MySkills from './MySkills';

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
  }
});

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      avatar: '',
      propsName: '',
      propsEmail: '',
      propsAvatar: '',
    };
  }
  componentDidMount = () => {
    this.props.dispatch(initWeb3());
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

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleAvatarUploaded = (url, hash) => {
    this.setState({
      avatar: url
    });
  }

  update3BoxProfile = () => {
    const { name, email, avatar } = this.state;

    this.props.dispatch(update3BoxProfile(name, email, avatar));
  }

  render() {
    const { classes, web3Address, is3BoxLoaded } = this.props;
    let hasChanged = this.state.name !== this.props.profile3Box.name || this.state.email !== this.props.profile3Box.email || this.state.avatar !== this.props.profile3Box.avatar;
    const avatar = this.state.avatar !== '' ? this.state.avatar : '/assets/no-avatar2.svg';
    // if (this.props.is3BoxLoaded) debugger;
    if (!is3BoxLoaded) {
      return (
        <React.Fragment>
          <div className={classnames(classes.containerWhite, classes.containerPadding)}>

            <Typography variant="headline" gutterBottom>Ethereum Profile</Typography>
            <Typography gutterBottom>Address: <span className={classes.profileValue}>{web3Address}</span></Typography>
            <div className={classes.centerContainer}>
              <Button variant="contained" color="primary" className={classes.button} onClick={this.load3Box} disabled={web3Address === '' || web3Address === undefined}> Load 3Box Profile</Button>
            </div>
          </div>
        </React.Fragment >
      );
    }
    return (
      <div>
        <div className={classnames(classes.containerWhite, classes.containerPadding)}>
          <Grid container justify="space-between">
            <Grid item>
              <Typography variant="headline" gutterBottom>Ethereum Profile</Typography>
              <Typography gutterBottom className={classes.addressContainer}>Address: <span className={classes.profileValue}>{web3Address}</span></Typography>
            </Grid>
            <Grid item>
              {/* <div className={classes.avatarContainer}> */}
              <Avatar
                alt={this.state.name}
                src={avatar}
                className={classes.avatar}
              />
              <IpfsUpload fileUploadedCB={this.handleAvatarUploaded} caption="Edit" />
              {/* </div> */}
            </Grid>
          </Grid>
          <form className={classes.container} noValidate autoComplete="off">

            <TextField
              id="profile-name"
              label="Name"
              value={this.state.name}
              onChange={this.handleChange('name')}
              margin="normal"
              variant="outlined"
              // placeholder="Name"
              className={classes.textField}
            />
            <TextField
              id="profile-email"
              label="Email"
              value={this.state.email}
              onChange={this.handleChange('email')}
              margin="normal"
              variant="outlined"
              // placeholder="Name"
              className={classes.textField}
            />

            <div className={classes.centerContainer}>
              <Button variant="contained" color="primary" className={classes.button} onClick={this.update3BoxProfile} disabled={!hasChanged}> Update 3Box Profile</Button>
            </div>
          </form>
        </div>
        <MySkills />
      </div >
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

Profile.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(connect(mapStateToProps)(withStyles(styles)(Profile)));

