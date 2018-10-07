import React, { Component } from 'react';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import { withRouter } from 'react-router-dom';

const styles = theme => ({
  homeContainer: {
    paddingTop: 50,
  }
});

class Home extends Component {

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.homeContainer}>
        <Typography variant="display3" align="center">P2P Attestations Network</Typography>
      </div>
    )
  }
}


function mapStateToProps(state) {
  return {

  };
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(connect(mapStateToProps)(withStyles(styles)(Home)));

