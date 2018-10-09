import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import routes from '../routes';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

import { connect } from 'react-redux';

import * as web3Selectors from '../store/web3/reducer';

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

function Header(props) {
  const { classes, web3Address } = props;
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          {/* <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
                        <MenuIcon />
                    </IconButton> */}
          <Typography variant="title" color="inherit" align="left" className={classes.grow}>
            Attestari.me
                    </Typography>
          <Button color="inherit" component={Link} to={routes.PROFILE()}>My Profile</Button>
          <Button color="inherit" component={Link} to={routes.PUBLIC_PROFILE(web3Address)}>My Public Profile</Button>

          {/* <Button color="inherit">Button2</Button>
                    <Button color="inherit">Button3</Button> */}
        </Toolbar>
      </AppBar>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    web3Address: web3Selectors.getSelectedAccount(state),
  };
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(connect(mapStateToProps)(withStyles(styles)(Header)));
