import React, { Component } from 'react';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { CircularProgress } from '@material-ui/core';

const styles = theme => ({
  container: {
    textAlign: 'center',
    padding: theme.spacing.unit * 4,
  }
});

class Loading extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <CircularProgress className={classes.progress} color="secondary" />
      </div>
    )
  }
}


function mapStateToProps(state) {
  return {

  };
}

Loading.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(withStyles(styles)(Loading));

